import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Player, Match, Goal } from '@/types/football';
import { useToast } from '@/hooks/use-toast';
import { StatisticsService } from '@/services/statisticsService';

export const useSupabaseFootballData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Track current user to avoid unnecessary re-fetches
  const currentUserId = useRef<string | null>(null);
  
  // Get current user
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch players using React Query
  const { 
    data: players = [], 
    isLoading: playersLoading, 
    error: playersError,
    refetch: refetchPlayers
  } = useQuery({
    queryKey: ['players', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('=== FETCH PLAYERS START ===');
      console.log('User ID:', user.id);
      
      const { data, error } = await supabase
        .from('players')
        .select('id, name, age, position, rating, matches_played, total_goals, total_assists, total_saves, clean_sheets')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Supabase query error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      const mappedPlayers = data?.map(player => ({
        id: player.id,
        name: player.name,
        age: player.age,
        position: player.position as 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward',
        rating: player.rating,
        matchesPlayed: player.matches_played,
        totalGoals: player.total_goals,
        totalAssists: player.total_assists,
        totalSaves: player.total_saves,
        cleanSheets: player.clean_sheets,
        averageMatchRating: player.matches_played > 0 ? player.rating / 10 : 0,
        matchRatings: []
      })) || [];

      console.log('Mapped players count:', mappedPlayers.length);
      console.log('=== FETCH PLAYERS SUCCESS ===');
      return mappedPlayers;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch matches using React Query
  const { 
    data: matches = [], 
    isLoading: matchesLoading, 
    error: matchesError,
    refetch: refetchMatches
  } = useQuery({
    queryKey: ['matches', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('=== FETCH MATCHES START ===');
      console.log('User ID:', user.id);

      // Fetch matches without expensive joins - get goals and saves separately if needed
      const { data, error } = await supabase
        .from('matches')
        .select('id, date, team_a_players, team_b_players, score_a, score_b, completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase matches query error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // Get match goals and saves in parallel for completed matches only
      const completedMatchIds = data?.filter(m => m.completed).map(m => m.id) || [];
      
      let matchGoals: any[] = [];
      let matchSaves: any[] = [];
      
      if (completedMatchIds.length > 0) {
        const [goalsResult, savesResult] = await Promise.all([
          supabase
            .from('match_goals')
            .select('match_id, scorer_id, assister_id, team, is_own_goal')
            .in('match_id', completedMatchIds),
          supabase
            .from('match_saves')
            .select('match_id, player_id, saves_count')
            .in('match_id', completedMatchIds)
        ]);
        
        if (goalsResult.error) {
          console.error('Error fetching match goals:', goalsResult.error);
        } else {
          matchGoals = goalsResult.data || [];
        }
        
        if (savesResult.error) {
          console.error('Error fetching match saves:', savesResult.error);
        } else {
          matchSaves = savesResult.data || [];
        }
      }

      const formattedMatches = data?.map(match => {
        // Get goals for this match
        const matchGoalsForThisMatch = matchGoals.filter(g => g.match_id === match.id);
        const goalsFormatted = matchGoalsForThisMatch.map((goal: any) => ({
          scorer: goal.scorer_id,
          assister: goal.assister_id,
          team: goal.team as 'A' | 'B',
          isOwnGoal: goal.is_own_goal
        }));
        
        // Get saves for this match
        const matchSavesForThisMatch = matchSaves.filter(s => s.match_id === match.id);
        const savesFormatted = matchSavesForThisMatch.reduce((acc: Record<string, number>, save: any) => {
          acc[save.player_id] = save.saves_count;
          return acc;
        }, {});
        
        return {
          id: match.id,
          date: match.date,
          teamA: match.team_a_players,
          teamB: match.team_b_players,
          scoreA: match.score_a,
          scoreB: match.score_b,
          completed: match.completed,
          goals: goalsFormatted,
          saves: savesFormatted,
          matchRatings: {},
          averageTeamARating: 0,
          averageTeamBRating: 0
        };
      }) || [];

      console.log('Formatted matches count:', formattedMatches.length);
      console.log('=== FETCH MATCHES SUCCESS ===');
      return formattedMatches;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Store match goals in database
  const storeMatchGoals = async (matchId: string, goals: Goal[]) => {
    try {
      console.log('Storing match goals for match:', matchId, goals);
      
      await supabase
        .from('match_goals')
        .delete()
        .eq('match_id', matchId);

      if (goals.length > 0) {
        const goalData = goals.map(goal => ({
          match_id: matchId,
          scorer_id: goal.scorer,
          assister_id: goal.assister || null,
          team: goal.team,
          is_own_goal: goal.isOwnGoal || false
        }));

        const { error } = await supabase
          .from('match_goals')
          .insert(goalData);

        if (error) throw error;
      }
      
      console.log('Successfully stored match goals');
    } catch (error) {
      console.error('Error storing match goals:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to store match goals: ${errorMessage}`);
    }
  };

  // Store match saves in database
  const storeMatchSaves = async (matchId: string, saves: Record<string, number>) => {
    try {
      console.log('Storing match saves for match:', matchId, saves);
      
      await supabase
        .from('match_saves')
        .delete()
        .eq('match_id', matchId);

      const saveData = Object.entries(saves)
        .filter(([_, count]) => count > 0)
        .map(([playerId, count]) => ({
          match_id: matchId,
          player_id: playerId,
          saves_count: count
        }));

      if (saveData.length > 0) {
        const { error } = await supabase
          .from('match_saves')
          .insert(saveData);

        if (error) throw error;
      }
      
      console.log('Successfully stored match saves');
    } catch (error) {
      console.error('Error storing match saves:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to store match saves: ${errorMessage}`);
    }
  };

  // Add player using mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: playerData.name,
          age: playerData.age,
          position: playerData.position,
          rating: playerData.rating,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['players', user?.id] });
      toast({
        title: "Success",
        description: `${variables.name} has been added to the squad!`,
      });
    },
    onError: (error) => {
      console.error('Error adding player:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to add player: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });
  
  const addPlayer = addPlayerMutation.mutate;

  // Remove player using mutation
  const removePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)
        .eq('user_id', user.id);

      if (error) throw error;
      return playerId;
    },
    onSuccess: (playerId, variables) => {
      queryClient.invalidateQueries({ queryKey: ['players', user?.id] });
      // Find the player name for the toast
      const player = players.find(p => p.id === playerId);
      toast({
        title: "Success",
        description: `${player?.name || 'Player'} has been removed from the squad.`,
      });
    },
    onError: (error) => {
      console.error('Error removing player:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to remove player: ${errorMessage}`,
        variant: "destructive",
      });
    }
  });

  const removePlayer = removePlayerMutation.mutate;

  // Create match function with proper statistics processing
  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      console.log('Creating match with data:', matchData);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('matches')
        .insert([{
          date: matchData.date,
          team_a_players: matchData.teamA,
          team_b_players: matchData.teamB,
          score_a: matchData.scoreA,
          score_b: matchData.scoreB,
          completed: matchData.completed,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;

      console.log('Match created with ID:', data.id);

      if (matchData.completed) {
        console.log('Match is completed, processing statistics...');
        
        await storeMatchGoals(data.id, matchData.goals);
        await storeMatchSaves(data.id, matchData.saves);
        
        const completeMatch = {
          ...matchData,
          id: data.id
        };
        
        await StatisticsService.processMatchStatistics(completeMatch, players);
        console.log('Statistics processing completed');
      }

      // Invalidate queries after creating match
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['matches', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['players', user?.id] })
      ]);

      toast({
        title: "Success",
        description: "Match created successfully!",
      });
      
      return data.id;
    } catch (error) {
      console.error('Error creating match:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to create match: ${errorMessage}`,
        variant: "destructive",
      });
      return null;
    }
  };

  // Complete match function with proper statistics processing
  const completeMatch = async (matchId: string, scoreA: number, scoreB: number, goals: Goal[], saves: Record<string, number>) => {
    try {
      console.log('Completing match:', matchId, { scoreA, scoreB, goals, saves });
      
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          score_a: scoreA,
          score_b: scoreB,
          completed: true
        })
        .eq('id', matchId);
      
      if (matchError) throw matchError;

      await storeMatchGoals(matchId, goals);
      await storeMatchSaves(matchId, saves);
      
      const match = matches.find(m => m.id === matchId);
      if (match) {
        const completedMatch = {
          ...match,
          scoreA,
          scoreB,
          goals,
          saves,
          completed: true
        };
        
        console.log('Processing statistics for completed match...');
        await StatisticsService.processMatchStatistics(completedMatch, players);
        console.log('Statistics processing completed');
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['matches', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['players', user?.id] })
      ]);

      toast({
        title: "Success",
        description: `Match completed! Score: ${scoreA} - ${scoreB}`,
      });
    } catch (error) {
      console.error('Error completing match:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to complete match: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  // Enhanced delete match function
  const deleteMatch = async (matchId: string) => {
    try {
      console.log('Starting match deletion for:', matchId);

      const match = matches.find(m => m.id === matchId);
      if (!match) {
        console.error('Match not found:', matchId);
        toast({
          title: "Error",
          description: "Match not found",
          variant: "destructive",
        });
        return;
      }

      // If match was completed, reverse the statistics first
      if (match.completed) {
        console.log('Match was completed, reversing statistics...');
        try {
          await StatisticsService.reverseMatchStatistics(match, players);
          console.log('Statistics reversal completed');
        } catch (statError) {
          console.error('Error reversing statistics:', statError);
          // Continue with deletion even if stats reversal fails
          toast({
            title: "Warning",
            description: "Match deleted but statistics may need manual correction",
            variant: "destructive",
          });
        }
      }

      console.log('Deleting match goals...');
      const { error: goalsError } = await supabase
        .from('match_goals')
        .delete()
        .eq('match_id', matchId);

      if (goalsError) {
        console.error('Error deleting match goals:', goalsError);
        throw goalsError;
      }

      console.log('Deleting match saves...');
      const { error: savesError } = await supabase
        .from('match_saves')
        .delete()
        .eq('match_id', matchId);

      if (savesError) {
        console.error('Error deleting match saves:', savesError);
        throw savesError;
      }

      console.log('Deleting match...');
      const { error: matchError } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (matchError) {
        console.error('Error deleting match:', matchError);
        throw matchError;
      }

      console.log('Match deletion completed successfully');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['matches', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['players', user?.id] })
      ]);

      toast({
        title: "Success",
        description: "Match deleted successfully and statistics updated!",
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to delete match: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  // Show toast for errors
  useEffect(() => {
    if (playersError) {
      const errorMessage = playersError instanceof Error ? playersError.message : 'Unknown error';
      toast({
        title: "Error Loading Players",
        description: `Failed to fetch players: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [playersError, toast]);
  
  useEffect(() => {
    if (matchesError) {
      const errorMessage = matchesError instanceof Error ? matchesError.message : 'Unknown error';
      toast({
        title: "Error Loading Matches",
        description: `Failed to fetch matches: ${errorMessage}`,
        variant: "destructive",
      });
    }
  }, [matchesError, toast]);

  const loading = playersLoading || matchesLoading;
  const getPlayerById = (id: string) => players.find(p => p.id === id);
  
  return {
    players,
    matches,
    loading,
    playersLoading,
    matchesLoading,
    addPlayer,
    removePlayer,
    createMatch,
    completeMatch,
    deleteMatch,
    getPlayerById,
    refreshData: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['players', user?.id] }),
      queryClient.invalidateQueries({ queryKey: ['matches', user?.id] })
    ]),
    refreshPlayers: () => queryClient.invalidateQueries({ queryKey: ['players', user?.id] }),
    refreshMatches: () => queryClient.invalidateQueries({ queryKey: ['matches', user?.id] })
  };
};
