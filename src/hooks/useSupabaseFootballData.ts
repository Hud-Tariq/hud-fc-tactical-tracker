import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player, Match, Goal } from '@/types/football';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseFootballData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch players from Supabase
  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Map database fields to frontend types
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
      
      setPlayers(mappedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive",
      });
    }
  };

  // Fetch matches from Supabase
  const fetchMatches = async () => {
    try {
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
        .order('date', { ascending: false });
      
      if (error) throw error;
      
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
      
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch matches",
        variant: "destructive",
      });
    }
  };

  // Calculate match rating based on performance
  const calculateMatchRating = (
    playerId: string,
    match: Match,
    goals: number,
    assists: number,
    saves: number,
    cleanSheet: boolean,
    teamWon: boolean,
    teamLost: boolean
  ): number => {
    const player = players.find(p => p.id === playerId);
    if (!player) return 6.0;

    let rating = 6.0; // Base rating

    // Performance bonuses
    rating += goals * 1.5; // Goals are worth 1.5 points each
    rating += assists * 1.0; // Assists are worth 1.0 point each
    rating += saves * 0.1; // Saves are worth 0.1 points each
    
    // Clean sheet bonus (defenders and goalkeepers)
    if (cleanSheet && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
      rating += 1.0;
    }

    // Team result bonuses
    if (teamWon) {
      rating += 0.5; // Winning team bonus
    } else if (teamLost) {
      rating -= 0.3; // Losing team penalty
    }

    // Position-specific adjustments
    switch (player.position) {
      case 'Forward':
        if (goals === 0) rating -= 0.2; // Forwards expected to score
        break;
      case 'Midfielder':
        if (assists === 0) rating -= 0.1; // Midfielders expected to assist
        break;
      case 'Goalkeeper':
        if (saves > 5) rating += 0.5; // Reward excellent goalkeeping
        break;
    }

    // Cap the rating between 1 and 10
    return Math.max(1, Math.min(10, rating));
  };

  // Improved delete match function with better error handling
  const deleteMatch = async (matchId: string) => {
    try {
      console.log('Starting match deletion for:', matchId);
      
      // First, we need to reverse the player statistics
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

      if (match.completed) {
        console.log('Reversing statistics for completed match');
        
        const teamAScore = match.goals.filter(g => g.team === 'A' && !g.isOwnGoal).length + 
                          match.goals.filter(g => g.team === 'B' && g.isOwnGoal).length;
        const teamBScore = match.goals.filter(g => g.team === 'B' && !g.isOwnGoal).length + 
                          match.goals.filter(g => g.team === 'A' && g.isOwnGoal).length;

        const teamACleanSheet = teamBScore === 0;
        const teamBCleanSheet = teamAScore === 0;

        // Process each player to reverse their stats
        const allPlayers = [...match.teamA, ...match.teamB];
        console.log('Reversing stats for players:', allPlayers);

        for (const playerId of allPlayers) {
          const isTeamA = match.teamA.includes(playerId);
          const playerGoals = match.goals.filter(g => g.scorer === playerId && !g.isOwnGoal).length;
          const playerAssists = match.goals.filter(g => g.assister === playerId).length;
          const playerSaves = match.saves[playerId] || 0;
          const playerCleanSheet = isTeamA ? teamACleanSheet : teamBCleanSheet;

          console.log(`Reversing stats for player ${playerId}:`, {
            goals: playerGoals,
            assists: playerAssists,
            saves: playerSaves,
            cleanSheet: playerCleanSheet
          });

          // Reverse player statistics
          await reversePlayerStats(playerId, {
            matches_played: 1,
            total_goals: playerGoals,
            total_assists: playerAssists,
            total_saves: playerSaves,
            clean_sheets: playerCleanSheet ? 1 : 0
          });
        }
      }

      // Delete in correct order to avoid foreign key constraints
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
      
      // Refresh data
      await fetchMatches();
      await fetchPlayers();

      toast({
        title: "Success",
        description: "Match deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        title: "Error",
        description: "Failed to delete match. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reverse player stats when deleting a match
  const reversePlayerStats = async (playerId: string, updates: { 
    matches_played?: number;
    total_goals?: number;
    total_assists?: number;
    total_saves?: number;
    clean_sheets?: number;
  }) => {
    try {
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError || !currentPlayer) {
        console.error('Error fetching player for reversal:', fetchError);
        return;
      }

      const newStats = {
        matches_played: Math.max(0, currentPlayer.matches_played - (updates.matches_played || 0)),
        total_goals: Math.max(0, currentPlayer.total_goals - (updates.total_goals || 0)),
        total_assists: Math.max(0, currentPlayer.total_assists - (updates.total_assists || 0)),
        total_saves: Math.max(0, currentPlayer.total_saves - (updates.total_saves || 0)),
        clean_sheets: Math.max(0, currentPlayer.clean_sheets - (updates.clean_sheets || 0))
      };

      const { error: updateError } = await supabase
        .from('players')
        .update(newStats)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error reversing player stats:', updateError);
      }
    } catch (error) {
      console.error('Error in reversePlayerStats:', error);
    }
  };

  // Store match goals in database
  const storeMatchGoals = async (matchId: string, goals: Goal[]) => {
    try {
      // Delete existing goals for this match
      await supabase
        .from('match_goals')
        .delete()
        .eq('match_id', matchId);

      // Insert new goals
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
    } catch (error) {
      console.error('Error storing match goals:', error);
    }
  };

  // Store match saves in database
  const storeMatchSaves = async (matchId: string, saves: Record<string, number>) => {
    try {
      // Delete existing saves for this match
      await supabase
        .from('match_saves')
        .delete()
        .eq('match_id', matchId);

      // Insert new saves
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
    } catch (error) {
      console.error('Error storing match saves:', error);
    }
  };

  // Calculate and update player statistics
  const updatePlayerStatistics = async (matchId: string, goals: Goal[], saves: Record<string, number>) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;

      const teamAScore = goals.filter(g => g.team === 'A' && !g.isOwnGoal).length + 
                        goals.filter(g => g.team === 'B' && g.isOwnGoal).length;
      const teamBScore = goals.filter(g => g.team === 'B' && !g.isOwnGoal).length + 
                        goals.filter(g => g.team === 'A' && g.isOwnGoal).length;

      const teamAWon = teamAScore > teamBScore;
      const teamBWon = teamBScore > teamAScore;
      const teamACleanSheet = teamBScore === 0;
      const teamBCleanSheet = teamAScore === 0;

      // Process each player
      for (const playerId of [...match.teamA, ...match.teamB]) {
        const isTeamA = match.teamA.includes(playerId);
        const playerGoals = goals.filter(g => g.scorer === playerId && !g.isOwnGoal).length;
        const playerAssists = goals.filter(g => g.assister === playerId).length;
        const playerSaves = saves[playerId] || 0;
        const playerCleanSheet = isTeamA ? teamACleanSheet : teamBCleanSheet;
        const playerTeamWon = isTeamA ? teamAWon : teamBWon;
        const playerTeamLost = isTeamA ? teamBWon : teamAWon;

        // Calculate match rating
        const matchRating = calculateMatchRating(
          playerId,
          match,
          playerGoals,
          playerAssists,
          playerSaves,
          playerCleanSheet,
          playerTeamWon,
          playerTeamLost
        );

        // Update player statistics
        await updatePlayerStats(playerId, {
          matches_played: 1,
          total_goals: playerGoals,
          total_assists: playerAssists,
          total_saves: playerSaves,
          clean_sheets: playerCleanSheet ? 1 : 0,
          match_rating: matchRating
        });
      }
    } catch (error) {
      console.error('Error updating player statistics:', error);
    }
  };

  // Update player stats with match rating consideration
  const updatePlayerStats = async (playerId: string, updates: { 
    matches_played?: number;
    total_goals?: number;
    total_assists?: number;
    total_saves?: number;
    clean_sheets?: number;
    match_rating?: number;
  }) => {
    try {
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError || !currentPlayer) {
        console.error('Error fetching player for update:', fetchError);
        return;
      }

      const newMatchesPlayed = currentPlayer.matches_played + (updates.matches_played || 0);
      
      let newRating = currentPlayer.rating;
      
      // Update rating every 5 games based on recent performance
      if (updates.match_rating && newMatchesPlayed > 0 && newMatchesPlayed % 5 === 0) {
        // For simplicity, we'll use a weighted average approach
        // In a real system, you'd want to store match ratings and calculate from last 5 games
        const ratingAdjustment = (updates.match_rating - 6.0) * 2; // Amplify rating changes
        newRating = Math.max(1, Math.min(100, currentPlayer.rating + ratingAdjustment));
      }

      const newStats = {
        matches_played: newMatchesPlayed,
        total_goals: currentPlayer.total_goals + (updates.total_goals || 0),
        total_assists: currentPlayer.total_assists + (updates.total_assists || 0),
        total_saves: currentPlayer.total_saves + (updates.total_saves || 0),
        clean_sheets: currentPlayer.clean_sheets + (updates.clean_sheets || 0),
        rating: Math.round(newRating)
      };

      const { error: updateError } = await supabase
        .from('players')
        .update(newStats)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error updating player stats:', updateError);
      }
    } catch (error) {
      console.error('Error in updatePlayerStats:', error);
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
      toast({
        title: "Error", 
        description: "Failed to add player",
        variant: "destructive",
      });
    }
  };

  // Create match in Supabase with user_id
  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
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

      // Store goals and saves
      if (matchData.completed) {
        await storeMatchGoals(data.id, matchData.goals);
        await storeMatchSaves(data.id, matchData.saves);
        await updatePlayerStatistics(data.id, matchData.goals, matchData.saves);
      }
      
      await fetchMatches();
      await fetchPlayers();
      
      toast({
        title: "Success",
        description: "Match created successfully!",
      });
      
      return data.id;
    } catch (error) {
      console.error('Error creating match:', error);
      toast({
        title: "Error",
        description: "Failed to create match",
        variant: "destructive",
      });
      return null;
    }
  };

  // Legacy complete match function for backward compatibility
  const completeMatch = async (matchId: string, scoreA: number, scoreB: number, goals: Goal[], saves: Record<string, number>) => {
    try {
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
      await updatePlayerStatistics(matchId, goals, saves);
      
      await fetchMatches();
      await fetchPlayers();
      
      toast({
        title: "Success",
        description: `Match completed! Score: ${scoreA} - ${scoreB}`,
      });
    } catch (error) {
      console.error('Error completing match:', error);
      toast({
        title: "Error",
        description: "Failed to complete match",
        variant: "destructive",
      });
    }
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setLoading(true);
        await Promise.all([fetchPlayers(), fetchMatches()]);
        setLoading(false);
      } else {
        setLoading(false);
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
