import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';
import { Player, Match, Goal } from '@/types/football';
import { useToast } from '@/hooks/use-toast';

interface MatchSimulationProps {
  matches: Match[];
  players: Player[];
  onMatchComplete: (matchId: string, teamAScore: number, teamBScore: number, goals: Goal[], saves: Record<string, number>) => Promise<void>;
  onBack: () => void;
}

const MatchSimulation = ({ matches, players, onMatchComplete, onBack }: MatchSimulationProps) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [playerRatings, setPlayerRatings] = useState<Record<string, number>>({});
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const { toast } = useToast();

  const pendingMatches = matches.filter(match => !match.completed);

  const simulateMatch = (match: Match) => {
    setIsSimulating(true);
    
    // Initialize ratings for all players (6.0 is average)
    const ratings: Record<string, number> = {};
    [...match.teamA, ...match.teamB].forEach(playerId => {
      const player = players.find(p => p.id === playerId);
      if (player) {
        // Base rating influenced by player's overall rating
        const baseRating = 4 + (player.rating / 100) * 4; // Scale 50-100 rating to 4-8 base
        // Add some randomness for match performance
        const performanceVariation = (Math.random() - 0.5) * 3; // ±1.5 variation
        ratings[playerId] = Math.max(1, Math.min(10, baseRating + performanceVariation));
      }
    });

    // Simulate match result based on team strength
    const teamAStrength = match.teamA.reduce((sum, playerId) => {
      const player = players.find(p => p.id === playerId);
      return sum + (player?.rating || 50);
    }, 0) / match.teamA.length;

    const teamBStrength = match.teamB.reduce((sum, playerId) => {
      const player = players.find(p => p.id === playerId);
      return sum + (player?.rating || 50);
    }, 0) / match.teamB.length;

    // Generate realistic scores based on team strength
    const strengthDiff = teamAStrength - teamBStrength;
    const baseGoals = 1 + Math.random() * 3; // 1-4 goals per team base
    
    let scoreA = Math.round(baseGoals + (strengthDiff / 50));
    let scoreB = Math.round(baseGoals - (strengthDiff / 50));
    
    // Ensure realistic scores (0-6 range)
    scoreA = Math.max(0, Math.min(6, scoreA));
    scoreB = Math.max(0, Math.min(6, scoreB));

    setTimeout(() => {
      setPlayerRatings(ratings);
      setTeamAScore(scoreA);
      setTeamBScore(scoreB);
      setIsSimulating(false);
      
      toast({
        title: "Match Simulated!",
        description: `Final Score: ${scoreA} - ${scoreB}`,
      });
    }, 2000);
  };

  const completeMatch = async () => {
    if (!selectedMatch) return;
    
    // Convert ratings to goals and saves
    const goals: Goal[] = [];
    const saves: Record<string, number> = {};
    
    // Generate goals based on high-performing players
    Object.entries(playerRatings).forEach(([playerId, rating]) => {
      const player = players.find(p => p.id === playerId);
      if (!player) return;
      
      // Goalkeepers get saves for good performances
      if (player.position === 'Goalkeeper' && rating > 6.5) {
        saves[playerId] = Math.floor((rating - 6) * 3);
      }
      
      // High-rated forwards/midfielders score goals
      if (rating > 7.5 && ['Forward', 'Midfielder'].includes(player.position)) {
        const team = selectedMatch.teamA.includes(playerId) ? 'A' : 'B';
        const goalsCount = rating > 9 ? 2 : 1; // Excellent players might score twice
        
        for (let i = 0; i < goalsCount; i++) {
          goals.push({
            scorer: playerId,
            team,
            isOwnGoal: false
          });
        }
      }
    });
    
    await onMatchComplete(selectedMatch.id, teamAScore, teamBScore, goals, saves);
    setSelectedMatch(null);
    setPlayerRatings({});
    setTeamAScore(0);
    setTeamBScore(0);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'bg-green-100 text-green-800 border-green-300';
    if (rating >= 7.5) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (rating >= 6.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rating >= 5.5) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };


  if (selectedMatch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedMatch(null);
              setPlayerRatings({});
              setTeamAScore(0);
              setTeamBScore(0);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Button>
          <h2 className="text-xl font-semibold">Match Simulation - {selectedMatch.date}</h2>
        </div>

        {/* Match Score Display */}
        <Card className="bg-gradient-to-r from-blue-50 to-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                Team A <span className="text-blue-600">{teamAScore}</span> - <span className="text-red-600">{teamBScore}</span> Team B
              </div>
              {!isSimulating && Object.keys(playerRatings).length === 0 && (
                <Button 
                  onClick={() => simulateMatch(selectedMatch)}
                  className="mt-4"
                  size="lg"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Simulate Match
                </Button>
              )}
              
              {isSimulating && (
                <div className="flex items-center justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Simulating match...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player Ratings */}
        {Object.keys(playerRatings).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Team A Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedMatch.teamA.map(playerId => {
                  const player = players.find(p => p.id === playerId);
                  const rating = playerRatings[playerId];
                  if (!player) return null;
                  
                  return (
                    <div key={playerId} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.position}</div>
                      </div>
                      <Badge className={getRatingColor(rating)}>
                        {rating.toFixed(1)}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Team B Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedMatch.teamB.map(playerId => {
                  const player = players.find(p => p.id === playerId);
                  const rating = playerRatings[playerId];
                  if (!player) return null;
                  
                  return (
                    <div key={playerId} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">{player.position}</div>
                      </div>
                      <Badge className={getRatingColor(rating)}>
                        {rating.toFixed(1)}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Complete Match Button */}
        {Object.keys(playerRatings).length > 0 && (
          <div className="text-center">
            <Button 
              onClick={completeMatch}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Match & Save Results
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Match Simulation</h2>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {pendingMatches.length > 0 ? (
        <div className="grid gap-4">
          {pendingMatches.map((match) => (
            <Card key={match.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Match - {match.date}</span>
                  <Badge variant="secondary">Pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2">Team A</h4>
                    <div className="space-y-1">
                      {match.teamA.map(playerId => {
                        const player = players.find(p => p.id === playerId);
                        return player ? (
                          <div key={playerId} className="text-sm">
                            {player.name} ({player.position})
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Team B</h4>
                    <div className="space-y-1">
                      {match.teamB.map(playerId => {
                        const player = players.find(p => p.id === playerId);
                        return player ? (
                          <div key={playerId} className="text-sm">
                            {player.name} ({player.position})
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={() => setSelectedMatch(match)}
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Simulate Match
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No pending matches available for simulation
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchSimulation;
