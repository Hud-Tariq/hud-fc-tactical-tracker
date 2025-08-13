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
    rating += performance.goals * 1.5;
    rating += performance.assists * 1.0;
    rating += performance.saves * 0.1;
    
    if (performance.cleanSheet && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
      rating += 1.0;
    }

    if (performance.teamWon) {
      rating += 0.5;
    } else if (performance.teamLost) {
      rating -= 0.3;
    }

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

    const teamAScore = match.goals.filter(g => 
      (g.team === 'A' && !g.isOwnGoal) || (g.team === 'B' && g.isOwnGoal)
    ).length;
    
    const teamBScore = match.goals.filter(g => 
      (g.team === 'B' && !g.isOwnGoal) || (g.team === 'A' && g.isOwnGoal)
    ).length;

    const goals = match.goals.filter(g => g.scorer === playerId && !g.isOwnGoal).length;
    const assists = match.goals.filter(g => g.assister === playerId).length;
    const saves = match.saves[playerId] || 0;
    
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

  // Improved rating calculation with more gradual changes
  static calculateRatingAdjustment(
    currentRating: number, 
    matchRating: number, 
    matchesPlayed: number
  ): number {
    const ratingDifference = matchRating - 6.0;
    
    // Base multiplier that decreases as player gets more experienced
    const experienceFactor = Math.max(0.3, 1 - (matchesPlayed * 0.05));
    
    // Rating adjustment based on current rating level
    let baseMultiplier: number;
    if (currentRating < 50) {
      // Low rated players improve faster
      baseMultiplier = 0.8;
    } else if (currentRating < 70) {
      // Average players have moderate change
      baseMultiplier = 0.6;
    } else if (currentRating < 85) {
      // Good players change slower
      baseMultiplier = 0.4;
    } else {
      // Elite players change very slowly
      baseMultiplier = 0.25;
    }
    
    // Apply diminishing returns for extreme ratings
    const extremeRatingFactor = Math.max(0.2, 1 - Math.abs(ratingDifference) * 0.1);
    
    // Final multiplier combines all factors
    const finalMultiplier = baseMultiplier * experienceFactor * extremeRatingFactor;
    
    // Only apply significant changes for substantial performance differences
    if (Math.abs(ratingDifference) > 0.5) {
      return ratingDifference * finalMultiplier;
    }
    
    return 0;
  }

  // Update player statistics in database with improved rating system
  static async updatePlayerStatistics(
    playerId: string,
    performance: PlayerMatchPerformance
  ): Promise<void> {
    try {
      console.log(`Updating statistics for player ${playerId}:`, performance);
      
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching player:', fetchError);
        throw new Error(`Failed to fetch player ${playerId}: ${fetchError.message}`);
      }

      if (!currentPlayer) {
        throw new Error(`Player ${playerId} not found`);
      }

      const newMatchesPlayed = currentPlayer.matches_played + 1;
      
      // Improved rating adjustment with more realistic progression
      let newRating = currentPlayer.rating;
      const ratingAdjustment = this.calculateRatingAdjustment(
        currentPlayer.rating,
        performance.matchRating,
        currentPlayer.matches_played
      );
      
      // Apply the rating change
      newRating = Math.max(1, Math.min(100, currentPlayer.rating + ratingAdjustment));
      
      // Log rating changes for debugging
      if (Math.abs(ratingAdjustment) > 0) {
        console.log(`Rating change for ${playerId}: ${currentPlayer.rating} → ${Math.round(newRating)} (${ratingAdjustment > 0 ? '+' : ''}${ratingAdjustment.toFixed(1)})`);
      }

      const updates = {
        matches_played: newMatchesPlayed,
        total_goals: currentPlayer.total_goals + performance.goals,
        total_assists: currentPlayer.total_assists + performance.assists,
        total_saves: currentPlayer.total_saves + performance.saves,
        clean_sheets: currentPlayer.clean_sheets + (performance.cleanSheet ? 1 : 0),
        rating: Math.round(newRating)
      };

      console.log(`Applying updates to player ${playerId}:`, updates);

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error updating player stats:', updateError);
        throw new Error(`Failed to update player ${playerId}: ${updateError.message}`);
      }

      console.log(`Successfully updated statistics for player ${playerId}`);
    } catch (error) {
      console.error('Error in updatePlayerStatistics:', error);
      throw error;
    }
  }

  // New method to reverse player statistics when a match is deleted
  static async reversePlayerStatistics(
    playerId: string,
    performance: PlayerMatchPerformance
  ): Promise<void> {
    try {
      console.log(`Reversing statistics for player ${playerId}:`, performance);
      
      const { data: currentPlayer, error: fetchError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching player:', fetchError);
        throw new Error(`Failed to fetch player ${playerId}: ${fetchError.message}`);
      }

      if (!currentPlayer) {
        throw new Error(`Player ${playerId} not found`);
      }

      const newMatchesPlayed = Math.max(0, currentPlayer.matches_played - 1);
      
      // Reverse the rating adjustment
      let newRating = currentPlayer.rating;
      const ratingAdjustment = this.calculateRatingAdjustment(
        currentPlayer.rating,
        performance.matchRating,
        currentPlayer.matches_played - 1 // Use the count before this match
      );
      
      // Reverse the rating change by subtracting the adjustment
      newRating = Math.max(1, Math.min(100, currentPlayer.rating - ratingAdjustment));
      
      // Log rating changes for debugging
      if (Math.abs(ratingAdjustment) > 0) {
        console.log(`Reversing rating change for ${playerId}: ${currentPlayer.rating} → ${Math.round(newRating)} (${ratingAdjustment > 0 ? '-' : '+'}${Math.abs(ratingAdjustment).toFixed(1)})`);
      }

      const updates = {
        matches_played: newMatchesPlayed,
        total_goals: Math.max(0, currentPlayer.total_goals - performance.goals),
        total_assists: Math.max(0, currentPlayer.total_assists - performance.assists),
        total_saves: Math.max(0, currentPlayer.total_saves - performance.saves),
        clean_sheets: Math.max(0, currentPlayer.clean_sheets - (performance.cleanSheet ? 1 : 0)),
        rating: Math.round(newRating)
      };

      console.log(`Applying reverse updates to player ${playerId}:`, updates);

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);
      
      if (updateError) {
        console.error('Error reversing player stats:', updateError);
        throw new Error(`Failed to reverse player stats ${playerId}: ${updateError.message}`);
      }

      console.log(`Successfully reversed statistics for player ${playerId}`);
    } catch (error) {
      console.error('Error in reversePlayerStatistics:', error);
      throw error;
    }
  }

  // Process all players in a completed match
  static async processMatchStatistics(
    match: Match,
    players: Player[]
  ): Promise<void> {
    console.log('Processing match statistics for match:', match.id);
    console.log('Match data:', { 
      teamA: match.teamA, 
      teamB: match.teamB, 
      goals: match.goals, 
      saves: match.saves 
    });
    
    const allPlayers = [...match.teamA, ...match.teamB];
    const errors: string[] = [];
    
    for (const playerId of allPlayers) {
      try {
        console.log(`Processing statistics for player: ${playerId}`);
        const performance = this.calculatePlayerPerformance(playerId, match, players);
        console.log(`Calculated performance for ${playerId}:`, performance);
        
        await this.updatePlayerStatistics(playerId, performance);
        console.log(`Successfully processed player: ${playerId}`);
      } catch (error) {
        const errorMsg = `Error processing player ${playerId}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }
    
    if (errors.length > 0) {
      console.error('Errors during statistics processing:', errors);
      throw new Error(`Statistics processing completed with errors: ${errors.join(', ')}`);
    }
    
    console.log('Match statistics processing completed successfully');
  }

  // New method to reverse all players' statistics when a match is deleted
  static async reverseMatchStatistics(
    match: Match,
    players: Player[]
  ): Promise<void> {
    console.log('Reversing match statistics for match:', match.id);
    console.log('Match data:', { 
      teamA: match.teamA, 
      teamB: match.teamB, 
      goals: match.goals, 
      saves: match.saves 
    });
    
    const allPlayers = [...match.teamA, ...match.teamB];
    const errors: string[] = [];
    
    for (const playerId of allPlayers) {
      try {
        console.log(`Reversing statistics for player: ${playerId}`);
        const performance = this.calculatePlayerPerformance(playerId, match, players);
        console.log(`Calculated performance to reverse for ${playerId}:`, performance);
        
        await this.reversePlayerStatistics(playerId, performance);
        console.log(`Successfully reversed stats for player: ${playerId}`);
      } catch (error) {
        const errorMsg = `Error reversing stats for player ${playerId}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }
    
    if (errors.length > 0) {
      console.error('Errors during statistics reversal:', errors);
      throw new Error(`Statistics reversal completed with errors: ${errors.join(', ')}`);
    }
    
    console.log('Match statistics reversal completed successfully');
  }
}
