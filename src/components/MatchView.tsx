
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Player, Match } from '@/types/football';

interface MatchViewProps {
  matches: Match[];
  players: Player[];
  onBack: () => void;
}

const MatchView = ({ matches, players, onBack }: MatchViewProps) => {
  const getPlayerById = (id: string) => players.find(p => p.id === id);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 7) return 'text-blue-600 bg-blue-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const generateMatchRating = (playerId: string, match: Match) => {
    // Generate a realistic match rating based on team performance and position
    const player = getPlayerById(playerId);
    if (!player) return 6.0;

    const teamAWon = match.scoreA > match.scoreB;
    const teamBWon = match.scoreB > match.scoreA;
    const isDraw = match.scoreA === match.scoreB;
    const isInTeamA = match.teamA.includes(playerId);
    const isInTeamB = match.teamB.includes(playerId);

    let baseRating = 6.0;

    // Adjust based on team result
    if ((isInTeamA && teamAWon) || (isInTeamB && teamBWon)) {
      baseRating += 0.5; // Winning team bonus
    } else if (isDraw) {
      baseRating += 0.2; // Draw bonus
    }

    // Position-specific adjustments
    switch (player.position) {
      case 'Goalkeeper':
        if ((isInTeamA && match.scoreB === 0) || (isInTeamB && match.scoreA === 0)) {
          baseRating += 1.0; // Clean sheet bonus
        }
        break;
      case 'Forward':
        const teamScore = isInTeamA ? match.scoreA : match.scoreB;
        baseRating += teamScore * 0.3; // Goal contribution
        break;
    }

    // Add some randomness for realism
    const variation = (Math.random() - 0.5) * 1.5;
    const finalRating = Math.max(1, Math.min(10, baseRating + variation));
    
    return Math.round(finalRating * 10) / 10;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">View Matches</h2>
        <Button onClick={onBack} variant="outline">
          Back to Create Match
        </Button>
      </div>

      {matches.filter(match => match.completed).length > 0 ? (
        <div className="space-y-6">
          {matches.filter(match => match.completed).map((match) => (
            <Card key={match.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{match.date}</span>
                  <div className="text-2xl font-bold">
                    {match.scoreA} - {match.scoreB}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-600">Team A</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {match.teamA.map(playerId => {
                        const player = getPlayerById(playerId);
                        const matchRating = generateMatchRating(playerId, match);
                        if (!player) return null;
                        return (
                          <div key={playerId} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-muted-foreground">{player.position}</div>
                            </div>
                            <Badge className={getRatingColor(matchRating)}>
                              {matchRating.toFixed(1)}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-600">Team B</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {match.teamB.map(playerId => {
                        const player = getPlayerById(playerId);
                        const matchRating = generateMatchRating(playerId, match);
                        if (!player) return null;
                        return (
                          <div key={playerId} className="flex justify-between items-center p-2 border rounded">
                            <div>
                              <div className="font-medium">{player.name}</div>
                              <div className="text-sm text-muted-foreground">{player.position}</div>
                            </div>
                            <Badge className={getRatingColor(matchRating)}>
                              {matchRating.toFixed(1)}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No completed matches yet. Create a match to see results here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchView;
