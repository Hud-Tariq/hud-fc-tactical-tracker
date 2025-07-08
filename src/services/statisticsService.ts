import { supabase } from '@/integrations/supabase/client';
import { Player, Match, Goal } from '@/types/football';

export interface PlayerMatchPerformance {
  playerId: string;
  goals: number;
  assists: number;
  saves: number;
  cleanSheet: boolean;
  teamWon: boolean;
  teamLost: boolean;
  matchRating: number;
}

export class StatisticsService {
  // Calculate match rating based on performance
  static calculateMatchRating(
    player: Player,
    performance: Omit<PlayerMatchPerformance, 'playerId' | 'matchRating'>
  ): number {
    let rating = 6.0; // Base rating

    // Performance bonuses
    rating += performance.goals * 1.5; // Goals worth 1.5 points each
    rating += performance.assists * 1.0; // Assists worth 1.0 point each
    rating += performance.saves * 0.1; // Saves worth 0.1 points each
    
    // Clean sheet bonus (defenders and goalkeepers)
    if (performance.cleanSheet && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
      rating += 1.0;
    }

    // Team result bonuses
    if (performance.teamWon) {
      rating += 0.5;
    } else if (performance.teamLost) {
      rating -= 0.3;
    }

    // Position-specific adjustments
    switch (player.position) {
      case 'Forward':
        if (performance.goals === 0) rating -= 0.2;
        break;
      case 'Midfielder':
        if (performance.assists === 0) rating -= 0.1;
        break;
      case 'Goalkeeper':
        if (performance.saves > 5) rating += 0.5;
        break;
    }

    return Math.max(1, Math.min(10, rating));
  }

  // Calculate player performance from match data
  static calculatePlayerPerformance(
    playerId: string,
    match: Match,
    players: Player[]
  ): PlayerMatchPerformance {
    const isTeamA = match.teamA.includes(playerId);
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
      throw new Error(`Player ${playerId} not found`);
    }

    // Calculate scores
    const teamAScore = match.goals.filter(g => 
      (g.team === 'A' && !g.isOwnGoal) || (g.team === 'B' && g.isOwnGoal)
    ).length;
    
    const teamBScore = match.goals.filter(g => 
      (g.team === 'B' && !g.isOwnGoal) || (g.team === 'A' && g.isOwnGoal)
    ).length;

    // Player stats
    const goals = match.goals.filter(g => g.scorer === playerId && !g.isOwnGoal).length;
    const assists = match.goals.filter(g => g.assister === playerId).length;
    const saves = match.saves[playerId] || 0;
    
    // Team performance
    const teamWon = isTeamA ? teamAScore > teamBScore : teamBScore > teamAScore;
    const teamLost = isTeamA ? teamAScore < teamBScore : teamBScore < teamAScore;
    const cleanSheet = isTeamA ? teamBScore === 0 : teamAScore === 0;

    const performance = {
      goals,
      assists,
      saves,
      cleanSheet,
      teamWon,
      teamLost
    };

    const matchRating = this.calculateMatchRating(player, performance);

    return {
      playerId,
      ...performance,
      matchRating
    };
  }

  // Update player statistics in database
  static async updatePlayerStatistics(
    playerId: string,
    performance: PlayerMatchPerformance
  ): Promise<void> {
    try {
      // Get current player data
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError || !currentPlayer) {
        console.error('Error fetching player for update:', fetchError);
        throw new Error(`Failed to fetch player ${playerId}`);
      }

      const newMatchesPlayed = currentPlayer.matches_played + 1;
      
      // Calculate new overall rating based on recent performance
      let newRating = currentPlayer.rating;
      
      // Adjust rating every 5 games or if significant performance difference
      const ratingDifference = performance.matchRating - 6.0; // 6.0 is average
      if (newMatchesPlayed % 5 === 0 || Math.abs(ratingDifference) > 2) {
        const ratingAdjustment = ratingDifference * 2; // Amplify rating changes
        newRating = Math.max(1, Math.min(100, currentPlayer.rating + ratingAdjustment));
      }

      // Update player statistics
      const updates = {
        matches_played: newMatchesPlayed,
        total_goals: currentPlayer.total_goals + performance.goals,
        total_assists: currentPlayer.total_assists + performance.assists,
        total_saves: currentPlayer.total_saves + performance.saves,
        clean_sheets: currentPlayer.clean_sheets + (performance.cleanSheet ? 1 : 0),
        rating: Math.round(newRating)
      };

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error updating player stats:', updateError);
        throw new Error(`Failed to update player ${playerId} statistics`);
      }

      console.log(`Updated statistics for player ${playerId}:`, updates);
    } catch (error) {
      console.error('Error in updatePlayerStatistics:', error);
      throw error;
    }
  }

  // Reverse player statistics (for match deletion)
  static async reversePlayerStatistics(
    playerId: string,
    performance: PlayerMatchPerformance
  ): Promise<void> {
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

      const updates = {
        matches_played: Math.max(0, currentPlayer.matches_played - 1),
        total_goals: Math.max(0, currentPlayer.total_goals - performance.goals),
        total_assists: Math.max(0, currentPlayer.total_assists - performance.assists),
        total_saves: Math.max(0, currentPlayer.total_saves - performance.saves),
        clean_sheets: Math.max(0, currentPlayer.clean_sheets - (performance.cleanSheet ? 1 : 0))
      };

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error reversing player stats:', updateError);
      }

      console.log(`Reversed statistics for player ${playerId}:`, updates);
    } catch (error) {
      console.error('Error in reversePlayerStatistics:', error);
    }
  }

  // Process all players in a completed match
  static async processMatchStatistics(
    match: Match,
    players: Player[]
  ): Promise<void> {
    console.log('Processing match statistics for match:', match.id);
    
    const allPlayers = [...match.teamA, ...match.teamB];
    
    for (const playerId of allPlayers) {
      try {
        const performance = this.calculatePlayerPerformance(playerId, match, players);
        await this.updatePlayerStatistics(playerId, performance);
      } catch (error) {
        console.error(`Error processing statistics for player ${playerId}:`, error);
      }
    }
  }

  // Reverse all players statistics for a match (for deletion)
  static async reverseMatchStatistics(
    match: Match,
    players: Player[]
  ): Promise<void> {
    console.log('Reversing match statistics for match:', match.id);
    
    const allPlayers = [...match.teamA, ...match.teamB];
    
    for (const playerId of allPlayers) {
      try {
        const performance = this.calculatePlayerPerformance(playerId, match, players);
        await this.reversePlayerStatistics(playerId, performance);
      } catch (error) {
        console.error(`Error reversing statistics for player ${playerId}:`, error);
      }
    }
  }
}
