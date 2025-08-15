import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, Match, Goal } from '@/types/football';
import { useToast } from '@/hooks/use-toast';
import { StatisticsService } from '@/services/statisticsService';

export const useSupabaseFootballData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const { toast } = useToast();

  // Cache refs to prevent unnecessary re-fetches
  const lastFetchTime = useRef<{ players: number; matches: number }>({ players: 0, matches: 0 });
  const currentUserId = useRef<string | null>(null);
  const CACHE_DURATION = 30000; // 30 seconds cache

  // Optimized fetch players with caching
  const fetchPlayers = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now();

      // Check cache validity
      if (!forceRefresh && now - lastFetchTime.current.players < CACHE_DURATION) {
        console.log('Using cached players data');
        return;
      }

      setPlayersLoading(true);
      console.log('Fetching players...');

      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!user) {
        console.log('No authenticated user found');
        setPlayers([]);
        setPlayersLoading(false);
        return;
      }

      // Update current user reference
      currentUserId.current = user.id;
      console.log('User authenticated, fetching players for user:', user.id);

      const { data, error } = await supabase
        .from('players')
        .select('id, name, age, position, rating, matches_played, total_goals, total_assists, total_saves, clean_sheets')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        console.error('Supabase query error:', error);
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

      console.log('Fetched players:', mappedPlayers.length);
      setPlayers(mappedPlayers);
      lastFetchTime.current.players = now;

    } catch (error) {
      console.error('Error fetching players:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to fetch players: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setPlayersLoading(false);
    }
  }, [toast]);

  // Fetch matches from Supabase
  const fetchMatches = async () => {
    try {
      console.log('Fetching matches...');

      // Check authentication first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!user) {
        console.log('No authenticated user found');
        setMatches([]);
        return;
      }

      console.log('User authenticated, fetching matches for user:', user.id);

      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_goals (
            id,
            scorer_id,
            assister_id,
            team,
            minute,
            is_own_goal
          ),
          match_saves (
            id,
            player_id,
            saves_count
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      const formattedMatches = data?.map(match => ({
        id: match.id,
        date: match.date,
        teamA: match.team_a_players,
        teamB: match.team_b_players,
        scoreA: match.score_a,
        scoreB: match.score_b,
        completed: match.completed,
        goals: match.match_goals?.map((goal: any) => ({
          scorer: goal.scorer_id,
          assister: goal.assister_id,
          team: goal.team as 'A' | 'B',
          isOwnGoal: goal.is_own_goal
        })) || [],
        saves: match.match_saves?.reduce((acc: Record<string, number>, save: any) => {
          acc[save.player_id] = save.saves_count;
          return acc;
        }, {}) || {},
        matchRatings: {},
        averageTeamARating: 0,
        averageTeamBRating: 0
      })) || [];
      
      console.log('Fetched matches:', formattedMatches.length);
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to fetch matches: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

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

  // Add player to Supabase with user_id
  const addPlayer = async (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

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
      
      await fetchPlayers();
      
      toast({
        title: "Success",
        description: `${playerData.name} has been added to the squad!`,
      });
    } catch (error) {
      console.error('Error adding player:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to add player: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  // Create match function with proper statistics processing
  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      console.log('Creating match with data:', matchData);
      
      const { data: { user } } = await supabase.auth.getUser();
      
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
      
      await Promise.all([fetchMatches(), fetchPlayers()]);
      
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

      await Promise.all([fetchMatches(), fetchPlayers()]);
      
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

      await Promise.all([fetchMatches(), fetchPlayers()]);

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

  const getPlayerById = (id: string) => players.find(p => p.id === id);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading football data...');
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Error getting user:', error);
          setLoading(false);
          return;
        }

        if (user) {
          console.log('User authenticated, fetching data...');
          setLoading(true);
          await Promise.all([fetchPlayers(), fetchMatches()]);
          setLoading(false);
        } else {
          console.log('No authenticated user');
          setLoading(false);
        }
      } catch (error) {
        console.error('Network error in loadData:', error);
        setLoading(false);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: "Network Error",
          description: `Failed to connect to the server: ${errorMessage}`,
          variant: "destructive",
        });
      }
    };

    loadData();
  }, []);

  return {
    players,
    matches,
    loading,
    addPlayer,
    createMatch,
    completeMatch,
    deleteMatch,
    getPlayerById,
    refreshData: () => Promise.all([fetchPlayers(), fetchMatches()])
  };
};
