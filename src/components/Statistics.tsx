
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/football';

interface StatisticsProps {
  players: Player[];
}

const Statistics = ({ players }: StatisticsProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-yellow-100 text-yellow-800';
      case 'Defender':
        return 'bg-blue-100 text-blue-800';
      case 'Midfielder':
        return 'bg-green-100 text-green-800';
      case 'Forward':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600';
    if (rating >= 70) return 'text-blue-600';
    if (rating >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const topScorer = players.reduce((prev, current) => 
    (prev.totalGoals > current.totalGoals) ? prev : current
  );

  const topAssister = players.reduce((prev, current) => 
    (prev.totalAssists > current.totalAssists) ? prev : current
  );

  const mostExperienced = players.reduce((prev, current) => 
    (prev.matchesPlayed > current.matchesPlayed) ? prev : current
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Player Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Top Scorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topScorer.name}</div>
            <div className="text-sm text-muted-foreground">
              {topScorer.totalGoals} goals in {topScorer.matchesPlayed} matches
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Top Assister</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topAssister.name}</div>
            <div className="text-sm text-muted-foreground">
              {topAssister.totalAssists} assists in {topAssister.matchesPlayed} matches
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">Most Experienced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostExperienced.name}</div>
            <div className="text-sm text-muted-foreground">
              {mostExperienced.matchesPlayed} matches played
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Players Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Position</th>
                  <th className="text-left p-2">Rating</th>
                  <th className="text-left p-2">Matches</th>
                  <th className="text-left p-2">Goals</th>
                  <th className="text-left p-2">Assists</th>
                  <th className="text-left p-2">Saves</th>
                  <th className="text-left p-2">Clean Sheets</th>
                  <th className="text-left p-2">G/A per Match</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => {
                  const goalsAndAssistsPerMatch = player.matchesPlayed > 0 
                    ? ((player.totalGoals + player.totalAssists) / player.matchesPlayed).toFixed(2)
                    : '0.00';

                  return (
                    <tr key={player.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          {index + 1}
                          {index === 0 && <span className="ml-1 text-yellow-500">👑</span>}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">Age {player.age}</div>
                      </td>
                      <td className="p-2">
                        <Badge className={getPositionColor(player.position)}>
                          {player.position}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className={`text-lg font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{player.matchesPlayed}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.matchesPlayed * 60} min
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-green-600 font-bold">{player.totalGoals}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-blue-600 font-bold">{player.totalAssists}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-yellow-600 font-bold">{player.totalSaves}</div>
                      </td>
                      <td className="p-2">
                        <div className="text-purple-600 font-bold">{player.cleanSheets}</div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{goalsAndAssistsPerMatch}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {players.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No players found. Add some players to see statistics.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
