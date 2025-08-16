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

    // Enhanced defender bonuses for clean sheets
    if (performance.cleanSheet && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
      rating += 1.5; // Increased from 1.0
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
        // Better rewards for exceptional saves (8+ saves)
        if (performance.saves >= 8) {
          rating += 1.0; // Significant bonus for exceptional performance
        } else if (performance.saves > 5) {
          rating += 0.5;
        }
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

  // Enhanced rating calculation with improved time evolution and consistency rewards
  static calculateRatingAdjustment(
    currentRating: number,
    matchRating: number,
    matchesPlayed: number,
    previousRatings: number[] = [] // For consistency bonus
  ): number {
    const ratingDifference = matchRating - 6.0;

    // Slower experience decay (2% per match vs 5%)
    const experienceFactor = Math.max(0.3, 1 - (matchesPlayed * 0.02));

    // Form boost: Struggling players (under 40 rating) get 30% faster improvement
    const formBoost = currentRating < 40 ? 1.3 : 1.0;

    // Maturity bonus: New players adapt 20% faster, experienced players change 10% slower
    let maturityBonus: number;
    if (matchesPlayed < 10) {
      maturityBonus = 1.2; // New players adapt faster
    } else if (matchesPlayed > 50) {
      maturityBonus = 0.9; // Experienced players change slower
    } else {
      maturityBonus = 1.0;
    }

    // Consistency bonus: Reward consistent performance with 10% bonus
    let consistencyBonus = 1.0;
    if (previousRatings.length >= 3) {
      const recentRatings = previousRatings.slice(-3);
      const avgRecent = recentRatings.reduce((sum, r) => sum + r, 0) / recentRatings.length;
      const variance = recentRatings.reduce((sum, r) => sum + Math.pow(r - avgRecent, 2), 0) / recentRatings.length;

      // Low variance = consistent performance = bonus
      if (variance < 1.0) {
        consistencyBonus = 1.1;
      }
    }

    // Rating adjustment based on current rating level
    let baseMultiplier: number;
    if (currentRating < 40) {
      // Struggling players get significant help to recover
      baseMultiplier = 1.0;
    } else if (currentRating < 50) {
      // Low rated players improve faster
      baseMultiplier = 0.8;
    } else if (currentRating < 70) {
      // Average players have moderate change
      baseMultiplier = 0.6;
    } else if (currentRating < 85) {
      // Good players change slower
      baseMultiplier = 0.4;
    } else if (currentRating < 90) {
      // Elite players change slowly but still change
      baseMultiplier = 0.3;
    } else {
      // Super elite players (90+) still change, just very gradually
      baseMultiplier = 0.2;
    }

    // Apply diminishing returns for extreme ratings
    const extremeRatingFactor = Math.max(0.2, 1 - Math.abs(ratingDifference) * 0.1);

    // Final multiplier combines all factors
    const finalMultiplier = baseMultiplier * experienceFactor * formBoost * maturityBonus * consistencyBonus * extremeRatingFactor;

    // Smaller threshold: Changes apply for 0.2+ difference instead of 0.5+
    if (Math.abs(ratingDifference) >= 0.2) {
      let adjustment = ratingDifference * finalMultiplier;

      // Capped changes: Maximum single-match change of 3 points (2 for higher rated players)
      const maxChange = currentRating >= 80 ? 2.0 : 3.0;
      adjustment = Math.max(-maxChange, Math.min(maxChange, adjustment));

      return adjustment;
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
      
      // Enhanced rating adjustment with better time evolution and consistency rewards
      let newRating = currentPlayer.rating;

      // Get previous match ratings for consistency bonus (simplified for now)
      // In a full implementation, you'd fetch the last few match ratings from the database
      const previousRatings: number[] = []; // TODO: Implement actual previous ratings tracking

      const ratingAdjustment = this.calculateRatingAdjustment(
        currentPlayer.rating,
        performance.matchRating,
        currentPlayer.matches_played,
        previousRatings
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

  // Reverse player statistics for a deleted match
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

      // Reverse the statistics (subtract what was added)
      const updates = {
        matches_played: Math.max(0, currentPlayer.matches_played - 1),
        total_goals: Math.max(0, currentPlayer.total_goals - performance.goals),
        total_assists: Math.max(0, currentPlayer.total_assists - performance.assists),
        total_saves: Math.max(0, currentPlayer.total_saves - performance.saves),
        clean_sheets: Math.max(0, currentPlayer.clean_sheets - (performance.cleanSheet ? 1 : 0)),
        // For rating, we'll recalculate based on remaining matches rather than trying to reverse
        // This is more accurate since rating adjustments are complex
      };

      console.log(`Applying reverse updates to player ${playerId}:`, updates);

      const { error: updateError } = await supabase
        .from('players')
        .update(updates)
        .eq('id', playerId);

      if (updateError) {
        console.error('Error reversing player stats:', updateError);
        throw new Error(`Failed to reverse stats for player ${playerId}: ${updateError.message}`);
      }

      console.log(`Successfully reversed statistics for player ${playerId}`);
    } catch (error) {
      console.error('Error in reversePlayerStatistics:', error);
      throw error;
    }
  }

  // Reverse all players' statistics for a deleted match
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
}
