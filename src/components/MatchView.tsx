import React from 'react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Player, Match } from '@/types/football';

interface MatchViewProps {
  matches: Match[];
  players: Player[];
  onBack: () => void;
  onDeleteMatch: (matchId: string) => void;
}

const MatchView = ({ matches, players, onBack, onDeleteMatch }: MatchViewProps) => {
  const getPlayerById = (id: string) => players.find(p => p.id === id);

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600 bg-green-100';
    if (rating >= 7) return 'text-blue-600 bg-blue-100';
    if (rating >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const calculateMatchRating = (playerId: string, match: Match) => {
    const player = getPlayerById(playerId);
    if (!player) return 6.0;

    const isInTeamA = match.teamA.includes(playerId);
    const isInTeamB = match.teamB.includes(playerId);
    
    // Get player's performance in this match
    const playerGoals = match.goals?.filter(g => g.scorer === playerId && !g.isOwnGoal).length || 0;
    const playerAssists = match.goals?.filter(g => g.assister === playerId).length || 0;
    const playerSaves = match.saves?.[playerId] || 0;
    
    // Team performance
    const teamWon = (isInTeamA && match.scoreA > match.scoreB) || (isInTeamB && match.scoreB > match.scoreA);
    const teamLost = (isInTeamA && match.scoreA < match.scoreB) || (isInTeamB && match.scoreB < match.scoreA);
    const cleanSheet = (isInTeamA && match.scoreB === 0) || (isInTeamB && match.scoreA === 0);

    let rating = 6.0; // Base rating

    // Performance bonuses
    rating += playerGoals * 1.5; // Goals are worth 1.5 points each
    rating += playerAssists * 1.0; // Assists are worth 1.0 point each
    rating += playerSaves * 0.1; // Saves are worth 0.1 points each
    
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
        if (playerGoals === 0) rating -= 0.2; // Forwards expected to score
        break;
      case 'Midfielder':
        if (playerAssists === 0) rating -= 0.1; // Midfielders expected to assist
        break;
      case 'Goalkeeper':
        if (playerSaves > 5) rating += 0.5; // Reward excellent goalkeeping
        break;
    }

    // Cap the rating between 1 and 10
    return Math.max(1, Math.min(10, rating));
  };

  const getPlayerMatchStats = (playerId: string, match: Match) => {
    const goals = match.goals?.filter(g => g.scorer === playerId && !g.isOwnGoal).length || 0;
    const assists = match.goals?.filter(g => g.assister === playerId).length || 0;
    const saves = match.saves?.[playerId] || 0;
    const isInTeamA = match.teamA.includes(playerId);
    const cleanSheet = (isInTeamA && match.scoreB === 0) || (!isInTeamA && match.scoreA === 0);
    
    return { goals, assists, saves, cleanSheet };
  };

  const handleDeleteMatch = (matchId: string) => {
    if (window.confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
      onDeleteMatch(matchId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">View Matches</h2>
        <Button onClick={onBack} variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
          Back to Create Match
        </Button>
      </div>

      {matches.filter(match => match.completed).length > 0 ? (
        <div className="space-y-6">
          {matches.filter(match => match.completed).map((match) => (
            <Card key={match.id} className="shadow-lg border-orange-100">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-900">{match.date}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.scoreA} - {match.scoreB}
                    </div>
                    <Button
                      onClick={() => handleDeleteMatch(match.id)}
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-600">Team A</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {match.teamA.map(playerId => {
                        const player = getPlayerById(playerId);
                        const matchRating = calculateMatchRating(playerId, match);
                        const stats = getPlayerMatchStats(playerId, match);
                        if (!player) return null;
                        return (
                          <div key={playerId} className="flex justify-between items-center p-3 border rounded-lg bg-blue-50">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{player.name}</div>
                              <div className="text-sm text-gray-600">{player.position}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                G: {stats.goals} | A: {stats.assists} | S: {stats.saves}
                                {stats.cleanSheet && ' | CS'}
                              </div>
                            </div>
                            <Badge className={getRatingColor(matchRating)}>
                              {matchRating.toFixed(1)}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-600">Team B</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {match.teamB.map(playerId => {
                        const player = getPlayerById(playerId);
                        const matchRating = calculateMatchRating(playerId, match);
                        const stats = getPlayerMatchStats(playerId, match);
                        if (!player) return null;
                        return (
                          <div key={playerId} className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{player.name}</div>
                              <div className="text-sm text-gray-600">{player.position}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                G: {stats.goals} | A: {stats.assists} | S: {stats.saves}
                                {stats.cleanSheet && ' | CS'}
                              </div>
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

                {/* Match Events Summary */}
                {match.goals && match.goals.length > 0 && (
                  <Card className="mt-6 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-700">Match Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {match.goals.map((goal, index) => {
                          const scorer = getPlayerById(goal.scorer);
                          const assister = goal.assister ? getPlayerById(goal.assister) : null;
                          return (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Badge variant={goal.team === 'A' ? 'default' : 'secondary'} className="w-8">
                                {goal.team}
                              </Badge>
                              <span className="font-medium">{scorer?.name}</span>
                              {goal.isOwnGoal && <span className="text-orange-600">(Own Goal)</span>}
                              {assister && !goal.isOwnGoal && (
                                <>
                                  <span className="text-gray-500">assisted by</span>
                                  <span className="font-medium">{assister.name}</span>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-orange-100">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">
              No completed matches yet. Create a match to see results here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchView;
