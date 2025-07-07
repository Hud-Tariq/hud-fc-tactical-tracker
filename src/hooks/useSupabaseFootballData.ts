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
            minute
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
          team: goal.team as 'A' | 'B'
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

  // Add player to Supabase
  const addPlayer = async (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets'>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: playerData.name,
          age: playerData.age,
          position: playerData.position,
          rating: playerData.rating
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

  // Create match in Supabase
  const createMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          date: matchData.date,
          team_a_players: matchData.teamA,
          team_b_players: matchData.teamB,
          score_a: matchData.scoreA,
          score_b: matchData.scoreB,
          completed: matchData.completed
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchMatches();
      
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

  // Complete match with comprehensive ratings
  const completeMatchWithRatings = async (
    matchId: string, 
    teamAScore: number, 
    teamBScore: number, 
    playerRatings: Record<string, number>
  ) => {
    try {
      console.log('Completing match with ratings:', { matchId, teamAScore, teamBScore, playerRatings });

      // Update match score and completion status
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          score_a: teamAScore,
          score_b: teamBScore,
          completed: true
        })
        .eq('id', matchId);
      
      if (matchError) throw matchError;

      // Update player statistics with match ratings
      const match = matches.find(m => m.id === matchId);
      if (!match) throw new Error('Match not found');

      // Calculate team average ratings
      const teamARatings = match.teamA.map(playerId => playerRatings[playerId] || 6.0);
      const teamBRatings = match.teamB.map(playerId => playerRatings[playerId] || 6.0);
      const averageTeamARating = teamARatings.reduce((sum, rating) => sum + rating, 0) / teamARatings.length;
      const averageTeamBRating = teamBRatings.reduce((sum, rating) => sum + rating, 0) / teamBRatings.length;

      console.log('Team average ratings calculated:', { averageTeamARating, averageTeamBRating });

      // Update each player's stats and ratings
      for (const [playerId, matchRating] of Object.entries(playerRatings)) {
        await updatePlayerWithMatchRating(playerId, matchRating);
      }

      // Update matches played for all players
      const allPlayers = [...match.teamA, ...match.teamB];
      for (const playerId of allPlayers) {
        await incrementMatchesPlayed(playerId);
      }
      
      await fetchMatches();
      await fetchPlayers();
      
      toast({
        title: "Success",
        description: `Match completed! Team A: ${teamAScore} - ${teamBScore} Team B`,
      });

      console.log('Match completion successful');
    } catch (error) {
      console.error('Error completing match with ratings:', error);
      toast({
        title: "Error",
        description: "Failed to complete match",
        variant: "destructive",
      });
    }
  };

  // Update player with match rating
  const updatePlayerWithMatchRating = async (playerId: string, matchRating: number) => {
    try {
      // Fetch current player data
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError || !currentPlayer) {
        console.error('Error fetching player for rating update:', fetchError);
        return;
      }

      // Calculate new overall rating (weighted average of current rating and match rating)
      const currentRating = currentPlayer.rating;
      const matchesPlayed = currentPlayer.matches_played;
      const newOverallRating = matchesPlayed > 0 
        ? Math.round((currentRating * 0.8) + (matchRating * 2)) // Match rating has more impact
        : Math.round(matchRating * 10); // First match sets the base

      // Ensure rating stays within bounds (1-100)
      const finalRating = Math.max(1, Math.min(100, newOverallRating));

      console.log(`Updating player ${playerId}: current rating ${currentRating}, match rating ${matchRating}, new rating ${finalRating}`);

      // Update the player's overall rating
      const { error: updateError } = await supabase
        .from('players')
        .update({ 
          rating: finalRating
        })
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error updating player rating:', updateError);
      }
    } catch (error) {
      console.error('Error in updatePlayerWithMatchRating:', error);
    }
  };

  // Increment matches played for a player
  const incrementMatchesPlayed = async (playerId: string) => {
    try {
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('matches_played')
        .eq('id', playerId)
        .single();
      
      if (fetchError || !currentPlayer) {
        console.error('Error fetching player for matches played update:', fetchError);
        return;
      }

      const { error: updateError } = await supabase
        .from('players')
        .update({ 
          matches_played: currentPlayer.matches_played + 1
        })
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error updating matches played:', updateError);
      }
    } catch (error) {
      console.error('Error in incrementMatchesPlayed:', error);
    }
  };

  // Legacy function for backward compatibility
  const completeMatch = async (matchId: string, scoreA: number, scoreB: number, goals: Goal[], saves: Record<string, number>) => {
    console.log('Legacy completeMatch called, redirecting to completeMatchWithRatings');
    // For backward compatibility, create basic ratings
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const playerRatings: Record<string, number> = {};
    [...match.teamA, ...match.teamB].forEach(playerId => {
      playerRatings[playerId] = 6.0; // Default rating
    });
    
    return completeMatchWithRatings(matchId, scoreA, scoreB, playerRatings);
  };

  const updatePlayerStats = async (playerId: string, updates: { 
    matches_played?: number;
    total_goals?: number;
    total_assists?: number;
    total_saves?: number;
    clean_sheets?: number;
    rating?: number;
  }) => {
    const { data: currentPlayer, error: fetchError } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();
    
    if (fetchError || !currentPlayer) {
      console.error('Error fetching player for update:', fetchError);
      return;
    }

    const newStats = {
      matches_played: (updates.matches_played !== undefined) 
        ? currentPlayer.matches_played + updates.matches_played 
        : currentPlayer.matches_played,
      total_goals: (updates.total_goals !== undefined) 
        ? currentPlayer.total_goals + updates.total_goals 
        : currentPlayer.total_goals,
      total_assists: (updates.total_assists !== undefined) 
        ? currentPlayer.total_assists + updates.total_assists 
        : currentPlayer.total_assists,
      total_saves: (updates.total_saves !== undefined) 
        ? currentPlayer.total_saves + updates.total_saves 
        : currentPlayer.total_saves,
      clean_sheets: (updates.clean_sheets !== undefined) 
        ? currentPlayer.clean_sheets + updates.clean_sheets 
        : currentPlayer.clean_sheets,
      rating: (updates.rating !== undefined) 
        ? Math.max(1, Math.min(100, currentPlayer.rating + updates.rating))
        : currentPlayer.rating
    };

    const { error: updateError } = await supabase
      .from('players')
      .update(newStats)
      .eq('id', playerId);
    
    if (updateError) {
      console.error('Error updating player stats:', updateError);
    }
  };

  const updatePlayerStatistics = async (matchId: string, goals: Goal[], saves: Record<string, number>) => {
    try {
      const match = matches.find(m => m.id === matchId);
      if (!match) return;

      const allPlayers = [...match.teamA, ...match.teamB];
      
      for (const playerId of allPlayers) {
        await updatePlayerStats(playerId, { matches_played: 1 });
      }

      for (const goal of goals) {
        await updatePlayerStats(goal.scorer, { 
          total_goals: 1,
          rating: 3
        });

        if (goal.assister) {
          await updatePlayerStats(goal.assister, {
            total_assists: 1,
            rating: 2
          });
        }
      }

      for (const [playerId, saveCount] of Object.entries(saves)) {
        await updatePlayerStats(playerId, {
          total_saves: saveCount,
          rating: saveCount
        });
      }

      const scoreA = goals.filter(g => g.team === 'A').length;
      const scoreB = goals.filter(g => g.team === 'B').length;
      
      if (scoreB === 0) {
        for (const playerId of match.teamA) {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            await updatePlayerStats(playerId, {
              clean_sheets: 1,
              rating: 2
            });
          }
        }
      }
      
      if (scoreA === 0) {
        for (const playerId of match.teamB) {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            await updatePlayerStats(playerId, {
              clean_sheets: 1,
              rating: 2
            });
          }
        }
      }

    } catch (error) {
      console.error('Error updating player statistics:', error);
    }
  };

  const updatePlayerRating = async (playerId: string, ratingChange: number) => {
    try {
      await updatePlayerStats(playerId, { rating: ratingChange });
      await fetchPlayers();
    } catch (error) {
      console.error('Error updating player rating:', error);
    }
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPlayers(), fetchMatches()]);
      setLoading(false);
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
    completeMatchWithRatings,
    getPlayerById,
    updatePlayerRating,
    refreshData: () => Promise.all([fetchPlayers(), fetchMatches()])
  };
};
