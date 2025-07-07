
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player, Match } from '@/types/football';
import { useToast } from '@/hooks/use-toast';

interface PitchPosition {
  top: string;
  left: string;
}

interface PlayerPosition {
  player: Player;
  position: PitchPosition;
  matchRating: number;
  matchStats: {
    goals: number;
    assists: number;
    saves: number;
    tackles: number;
    passes: number;
    interceptions: number;
    shots: number;
    fouls: number;
  };
}

interface FootballPitchProps {
  match: Match;
  players: Player[];
  onMatchComplete: (matchId: string, teamAScore: number, teamBScore: number, playerRatings: Record<string, number>) => void;
}

const FootballPitch = ({ match, players, onMatchComplete }: FootballPitchProps) => {
  const { toast } = useToast();
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [playerPositions, setPlayerPositions] = useState<Record<string, PlayerPosition>>({});
  const [matchInProgress, setMatchInProgress] = useState(false);
  const [matchCompleted, setMatchCompleted] = useState(false);

  // Formation positions for 5v5
  const formationPositions: Record<string, PitchPosition[]> = {
    teamA: [
      { top: '85%', left: '50%' }, // Goalkeeper
      { top: '65%', left: '25%' }, // Left Defender
      { top: '65%', left: '75%' }, // Right Defender
      { top: '35%', left: '40%' }, // Left Midfielder
      { top: '35%', left: '60%' }, // Right Midfielder
    ],
    teamB: [
      { top: '15%', left: '50%' }, // Goalkeeper
      { top: '35%', left: '25%' }, // Left Defender
      { top: '35%', left: '75%' }, // Right Defender
      { top: '65%', left: '40%' }, // Left Midfielder
      { top: '65%', left: '60%' }, // Right Midfielder
    ],
  };

  useEffect(() => {
    initializePlayerPositions();
  }, [match, players]);

  const initializePlayerPositions = () => {
    const positions: Record<string, PlayerPosition> = {};

    // Position Team A players
    match.teamA.forEach((playerId, index) => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        positions[playerId] = {
          player,
          position: formationPositions.teamA[index],
          matchRating: 6.0, // Starting rating
          matchStats: {
            goals: 0,
            assists: 0,
            saves: 0,
            tackles: 0,
            passes: 0,
            interceptions: 0,
            shots: 0,
            fouls: 0,
          },
        };
      }
    });

    // Position Team B players
    match.teamB.forEach((playerId, index) => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        positions[playerId] = {
          player,
          position: formationPositions.teamB[index],
          matchRating: 6.0, // Starting rating
          matchStats: {
            goals: 0,
            assists: 0,
            saves: 0,
            tackles: 0,
            passes: 0,
            interceptions: 0,
            shots: 0,
            fouls: 0,
          },
        };
      }
    });

    setPlayerPositions(positions);
  };

  const calculateComprehensiveRating = (playerId: string, stats: any) => {
    const player = playerPositions[playerId]?.player;
    if (!player) return 6.0;

    let rating = 6.0; // Base rating

    // Position-specific calculations
    switch (player.position) {
      case 'Goalkeeper':
        rating += stats.saves * 0.3;
        rating += stats.goals === 0 ? 1.5 : 0; // Clean sheet bonus
        rating -= stats.goals * 0.8; // Goals conceded penalty
        rating += stats.passes * 0.05;
        rating -= stats.fouls * 0.2;
        break;

      case 'Defender':
        rating += stats.tackles * 0.4;
        rating += stats.interceptions * 0.3;
        rating += stats.goals * 1.2; // Defenders scoring is valuable
        rating += stats.assists * 0.8;
        rating += stats.passes * 0.03;
        rating -= stats.fouls * 0.3;
        rating += stats.goals === 0 ? 0.8 : 0; // Clean sheet bonus (reduced)
        break;

      case 'Midfielder':
        rating += stats.goals * 0.8;
        rating += stats.assists * 0.9;
        rating += stats.passes * 0.04;
        rating += stats.tackles * 0.3;
        rating += stats.interceptions * 0.2;
        rating += stats.shots * 0.1;
        rating -= stats.fouls * 0.25;
        break;

      case 'Forward':
        rating += stats.goals * 1.0;
        rating += stats.assists * 0.7;
        rating += stats.shots * 0.15;
        rating += stats.passes * 0.02;
        rating -= stats.fouls * 0.2;
        break;
    }

    // Ensure rating stays within bounds (1-10)
    return Math.max(1, Math.min(10, rating));
  };

  const simulateMatch = () => {
    setMatchInProgress(true);
    toast({
      title: "Match Started!",
      description: "Simulating match events...",
    });

    // Reset scores
    let currentTeamAScore = 0;
    let currentTeamBScore = 0;

    // Simulate match events
    const events = Math.floor(Math.random() * 15) + 10; // 10-25 events
    console.log(`Simulating ${events} match events`);

    for (let i = 0; i < events; i++) {
      setTimeout(() => {
        const eventResult = simulateEvent();
        if (eventResult.goal) {
          if (eventResult.team === 'A') {
            currentTeamAScore++;
          } else {
            currentTeamBScore++;
          }
        }
      }, i * 500);
    }

    // Complete match after all events
    setTimeout(() => {
      setTeamAScore(currentTeamAScore);
      setTeamBScore(currentTeamBScore);
      completeMatch(currentTeamAScore, currentTeamBScore);
    }, events * 500 + 1000);
  };

  const simulateEvent = () => {
    const eventTypes = ['goal', 'assist', 'save', 'tackle', 'pass', 'interception', 'shot', 'foul'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const allPlayerIds = [...match.teamA, ...match.teamB];
    const randomPlayerId = allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)];
    
    let goalScored = false;
    let scoringTeam = null;

    setPlayerPositions(prev => {
      const updated = { ...prev };
      if (updated[randomPlayerId]) {
        const stats = { ...updated[randomPlayerId].matchStats };
        
        switch (eventType) {
          case 'goal':
            stats.goals += 1;
            goalScored = true;
            scoringTeam = match.teamA.includes(randomPlayerId) ? 'A' : 'B';
            console.log(`Goal scored by ${updated[randomPlayerId].player.name} for team ${scoringTeam}`);
            break;
          case 'assist':
            stats.assists += 1;
            break;
          case 'save':
            if (updated[randomPlayerId].player.position === 'Goalkeeper') {
              stats.saves += 1;
            }
            break;
          case 'tackle':
            if (['Defender', 'Midfielder'].includes(updated[randomPlayerId].player.position)) {
              stats.tackles += 1;
            }
            break;
          case 'pass':
            stats.passes += Math.floor(Math.random() * 5) + 1;
            break;
          case 'interception':
            if (['Defender', 'Midfielder'].includes(updated[randomPlayerId].player.position)) {
              stats.interceptions += 1;
            }
            break;
          case 'shot':
            if (['Forward', 'Midfielder'].includes(updated[randomPlayerId].player.position)) {
              stats.shots += 1;
            }
            break;
          case 'foul':
            stats.fouls += 1;
            break;
        }
        
        updated[randomPlayerId].matchStats = stats;
        updated[randomPlayerId].matchRating = calculateComprehensiveRating(randomPlayerId, stats);
      }
      return updated;
    });

    return { goal: goalScored, team: scoringTeam };
  };

  const completeMatch = (finalScoreA: number, finalScoreB: number) => {
    setMatchInProgress(false);
    setMatchCompleted(true);
    
    // Prepare comprehensive player ratings for database update
    const playerRatings: Record<string, number> = {};
    Object.entries(playerPositions).forEach(([playerId, data]) => {
      playerRatings[playerId] = data.matchRating;
    });

    console.log('Match completed with comprehensive ratings:', {
      finalScoreA,
      finalScoreB,
      playerRatings
    });

    toast({
      title: "Match Completed!",
      description: `Final Score: Team A ${finalScoreA} - ${finalScoreB} Team B`,
    });

    // Call the parent component's match completion handler with comprehensive ratings
    onMatchComplete(match.id, finalScoreA, finalScoreB, playerRatings);
  };

  const getPlayerColor = (playerId: string) => {
    if (match.teamA.includes(playerId)) return 'bg-blue-500';
    return 'bg-red-500';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 7) return 'text-blue-600 bg-blue-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Match Simulation</h2>
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold">
            Team A: {teamAScore} - {teamBScore} Team B
          </div>
          {!matchInProgress && !matchCompleted && (
            <Button onClick={simulateMatch} className="bg-green-600 hover:bg-green-700">
              Start Match
            </Button>
          )}
        </div>
      </div>

      {/* Football Pitch */}
      <Card className="relative h-96 bg-green-400 overflow-hidden">
        <CardContent className="p-0 h-full relative">
          {/* Pitch markings */}
          <div className="absolute inset-4 border-4 border-white rounded-lg">
            {/* Center line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-0.5"></div>
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Goals */}
            <div className="absolute -top-2 left-1/2 w-16 h-4 bg-white transform -translate-x-1/2"></div>
            <div className="absolute -bottom-2 left-1/2 w-16 h-4 bg-white transform -translate-x-1/2"></div>
          </div>

          {/* Players */}
          {Object.entries(playerPositions).map(([playerId, data]) => (
            <div
              key={playerId}
              className={`absolute w-12 h-12 rounded-full ${getPlayerColor(playerId)} border-2 border-white flex items-center justify-center text-white text-xs font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110`}
              style={{
                top: data.position.top,
                left: data.position.left,
              }}
              title={`${data.player.name} - Rating: ${data.matchRating.toFixed(1)}`}
            >
              {data.player.name.substring(0, 2).toUpperCase()}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Match Statistics */}
      {matchCompleted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Team A Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {match.teamA.map(playerId => {
                const playerData = playerPositions[playerId];
                if (!playerData) return null;
                return (
                  <div key={playerId} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">{playerData.player.name}</div>
                      <div className="text-sm text-muted-foreground">{playerData.player.position}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRatingColor(playerData.matchRating)}>
                        {playerData.matchRating.toFixed(1)}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        G:{playerData.matchStats.goals} A:{playerData.matchStats.assists} S:{playerData.matchStats.saves}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Team B Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {match.teamB.map(playerId => {
                const playerData = playerPositions[playerId];
                if (!playerData) return null;
                return (
                  <div key={playerId} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <div className="font-medium">{playerData.player.name}</div>
                      <div className="text-sm text-muted-foreground">{playerData.player.position}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRatingColor(playerData.matchRating)}>
                        {playerData.matchRating.toFixed(1)}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        G:{playerData.matchStats.goals} A:{playerData.matchStats.assists} S:{playerData.matchStats.saves}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FootballPitch;
