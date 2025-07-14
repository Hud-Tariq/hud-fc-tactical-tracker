import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import FootballPitch from './FootballPitch';
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
  const [completedMatches, setCompletedMatches] = useState<string[]>([]);
  const { toast } = useToast();

  const pendingMatches = matches.filter(match => !match.completed);

  const handleMatchComplete = async (matchId: string, teamAScore: number, teamBScore: number, playerRatings: Record<string, number>) => {
    // Convert player ratings to goals and saves format for the backend
    const goals: Goal[] = [];
    const saves: Record<string, number> = {};
    
    // Process player ratings into match events
    Object.entries(playerRatings).forEach(([playerId, rating]) => {
      const player = players.find(p => p.id === playerId);
      if (!player) return;
      
      // Simplified conversion: high ratings indicate good performance
      if (player.position === 'Goalkeeper' && rating > 7) {
        saves[playerId] = Math.floor((rating - 6) * 2); // Convert rating to saves
      }
      
      // Add goals based on rating and position
      if (rating > 8 && ['Forward', 'Midfielder'].includes(player.position)) {
        const match = matches.find(m => m.id === matchId);
        if (match) {
          const team = match.teamA.includes(playerId) ? 'A' : 'B';
          goals.push({
            scorer: playerId,
            team,
            isOwnGoal: false
          });
        }
      }
    });
    
    await onMatchComplete(matchId, teamAScore, teamBScore, goals, saves);
    setSelectedMatch(null);
  };


  if (selectedMatch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedMatch(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Button>
          <h2 className="text-xl font-semibold">Match Simulation - {selectedMatch.date}</h2>
        </div>
        
        <FootballPitch
          match={selectedMatch}
          players={players}
          onMatchComplete={handleMatchComplete}
        />
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
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Start Match Simulation
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
