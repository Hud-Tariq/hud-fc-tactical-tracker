
import { useState } from 'react';
import { Player, Match } from '@/types/football';

export const useFootballData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const addPlayer = (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString(),
      matchesPlayed: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalSaves: 0,
      cleanSheets: 0
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayerRating = (playerId: string, ratingChange: number) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, rating: Math.max(1, Math.min(100, player.rating + ratingChange)) }
        : player
    ));
  };

  const updatePlayerStats = (playerId: string, stats: Partial<Pick<Player, 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets' | 'matchesPlayed'>>) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, ...stats }
        : player
    ));
  };

  const createMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString()
    };
    setMatches(prev => [...prev, newMatch]);
    return newMatch.id;
  };

  const completeMatch = (matchId: string, scoreA: number, scoreB: number, goals: any[], saves: Record<string, number>) => {
    // Update match
    setMatches(prev => prev.map(match => 
      match.id === matchId 
        ? { ...match, scoreA, scoreB, goals, saves, completed: true }
        : match
    ));

    // Update player statistics and ratings
    const match = matches.find(m => m.id === matchId);
    if (match) {
      const allPlayers = [...match.teamA, ...match.teamB];
      
      // Update matches played
      allPlayers.forEach(playerId => {
        updatePlayerStats(playerId, { 
          matchesPlayed: players.find(p => p.id === playerId)?.matchesPlayed! + 1 
        });
      });

      // Process goals and assists
      goals.forEach(goal => {
        // Goal scorer
        updatePlayerStats(goal.scorer, {
          totalGoals: players.find(p => p.id === goal.scorer)?.totalGoals! + 1
        });
        updatePlayerRating(goal.scorer, 3);

        // Assister
        if (goal.assister) {
          updatePlayerStats(goal.assister, {
            totalAssists: players.find(p => p.id === goal.assister)?.totalAssists! + 1
          });
          updatePlayerRating(goal.assister, 2);
        }
      });

      // Process saves
      Object.entries(saves).forEach(([playerId, saveCount]) => {
        updatePlayerStats(playerId, {
          totalSaves: players.find(p => p.id === playerId)?.totalSaves! + saveCount
        });
        updatePlayerRating(playerId, saveCount); // +1 per save
      });

      // Process clean sheets and defensive penalties
      const teamACleanSheet = scoreB === 0;
      const teamBCleanSheet = scoreA === 0;
      
      if (teamACleanSheet) {
        match.teamA.forEach(playerId => {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            updatePlayerStats(playerId, {
              cleanSheets: player.cleanSheets + 1
            });
            updatePlayerRating(playerId, 2);
          }
        });
      }

      if (teamBCleanSheet) {
        match.teamB.forEach(playerId => {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            updatePlayerStats(playerId, {
              cleanSheets: player.cleanSheets + 1
            });
            updatePlayerRating(playerId, 2);
          }
        });
      }

      // Penalty for conceding 3+ goals
      if (scoreA >= 3) {
        match.teamB.forEach(playerId => {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            updatePlayerRating(playerId, -2);
          }
        });
      }

      if (scoreB >= 3) {
        match.teamA.forEach(playerId => {
          const player = players.find(p => p.id === playerId);
          if (player && (player.position === 'Defender' || player.position === 'Goalkeeper')) {
            updatePlayerRating(playerId, -2);
          }
        });
      }
    }
  };

  const getPlayerById = (id: string) => players.find(p => p.id === id);

  return {
    players,
    matches,
    addPlayer,
    createMatch,
    completeMatch,
    getPlayerById,
    updatePlayerRating,
    updatePlayerStats
  };
};
