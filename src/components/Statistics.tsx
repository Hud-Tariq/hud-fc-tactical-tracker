import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/football';
import { Trophy, Target, Zap, Shield } from 'lucide-react';

interface StatisticsProps {
  players: Player[];
}

const Statistics = ({ players }: StatisticsProps) => {
  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Defender':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Midfielder':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Forward':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600';
    if (rating >= 70) return 'text-blue-600';
    if (rating >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (rating: number) => {
    if (rating >= 90) return 'S';
    if (rating >= 80) return 'A';
    if (rating >= 70) return 'B';
    if (rating >= 60) return 'C';
    if (rating >= 50) return 'D';
    return 'F';
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

  const bestKeeper = players
    .filter(p => p.position === 'Goalkeeper')
    .reduce((prev, current) => {
      const prevCleanSheetRatio = prev.matchesPlayed > 0 ? prev.cleanSheets / prev.matchesPlayed : 0;
      const currentCleanSheetRatio = current.matchesPlayed > 0 ? current.cleanSheets / current.matchesPlayed : 0;
      return prevCleanSheetRatio > currentCleanSheetRatio ? prev : current;
    }, players.find(p => p.position === 'Goalkeeper') || players[0]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Player Statistics
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Comprehensive performance analytics for all players
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-600 flex items-center space-x-2 text-base sm:text-lg">
              <Target className="w-5 h-5" />
              <span>Top Scorer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold">{topScorer.name}</div>
            <div className="text-sm text-muted-foreground">
              {topScorer.totalGoals} goals in {topScorer.matchesPlayed} matches
            </div>
            <div className="text-xs text-muted-foreground bg-accent/50 rounded px-2 py-1 inline-block">
              Avg: {topScorer.matchesPlayed > 0 ? (topScorer.totalGoals / topScorer.matchesPlayed).toFixed(2) : '0.00'} goals/match
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-600 flex items-center space-x-2 text-base sm:text-lg">
              <Zap className="w-5 h-5" />
              <span>Top Assister</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold">{topAssister.name}</div>
            <div className="text-sm text-muted-foreground">
              {topAssister.totalAssists} assists in {topAssister.matchesPlayed} matches
            </div>
            <div className="text-xs text-muted-foreground bg-accent/50 rounded px-2 py-1 inline-block">
              Avg: {topAssister.matchesPlayed > 0 ? (topAssister.totalAssists / topAssister.matchesPlayed).toFixed(2) : '0.00'} assists/match
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-600 flex items-center space-x-2 text-base sm:text-lg">
              <Trophy className="w-5 h-5" />
              <span>Most Experienced</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold">{mostExperienced.name}</div>
            <div className="text-sm text-muted-foreground">
              {mostExperienced.matchesPlayed} matches played
            </div>
            <div className="text-xs text-muted-foreground bg-accent/50 rounded px-2 py-1 inline-block">
              Rating: {mostExperienced.rating}/100
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-600 flex items-center space-x-2 text-base sm:text-lg">
              <Shield className="w-5 h-5" />
              <span>Best Keeper</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold">{bestKeeper.name}</div>
            <div className="text-sm text-muted-foreground">
              {bestKeeper.cleanSheets} clean sheets
            </div>
            <div className="text-xs text-muted-foreground bg-accent/50 rounded px-2 py-1 inline-block">
              {bestKeeper.matchesPlayed > 0 ? ((bestKeeper.cleanSheets / bestKeeper.matchesPlayed) * 100).toFixed(1) : '0'}% clean sheet ratio
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Players Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">All Players Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {sortedPlayers.map((player, index) => {
                const goalsAndAssistsPerMatch = player.matchesPlayed > 0 
                  ? ((player.totalGoals + player.totalAssists) / player.matchesPlayed).toFixed(2)
                  : '0.00';
                
                const cleanSheetRatio = player.matchesPlayed > 0 
                  ? ((player.cleanSheets / player.matchesPlayed) * 100).toFixed(1)
                  : '0';

                return (
                  <Card key={player.id} className="p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                          {index === 0 && <span className="text-yellow-500">👑</span>}
                          {index === 1 && <span className="text-gray-400">🥈</span>}
                          {index === 2 && <span className="text-amber-600">🥉</span>}
                        </div>
                        <div className="font-semibold text-lg">{player.name}</div>
                        <div className="text-sm text-muted-foreground">Age {player.age}</div>
                        <Badge className={`${getPositionColor(player.position)} text-xs`}>
                          {player.position}
                        </Badge>
                      </div>
                      <div className="text-right space-y-1">
                        <div className={`text-2xl font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating}
                        </div>
                        <Badge variant="outline" className={`${getRatingColor(player.rating)} border-current text-xs`}>
                          {getPerformanceGrade(player.rating)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Matches</div>
                        <div className="font-semibold">{player.matchesPlayed}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">G+A/Match</div>
                        <div className="font-semibold">{goalsAndAssistsPerMatch}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Goals</div>
                        <div className="font-semibold text-green-600">{player.totalGoals}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Assists</div>
                        <div className="font-semibold text-blue-600">{player.totalAssists}</div>
                      </div>
                      {player.position === 'Goalkeeper' && (
                        <>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Saves</div>
                            <div className="font-semibold text-yellow-600">{player.totalSaves}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">Clean Sheets</div>
                            <div className="font-semibold text-purple-600">{cleanSheetRatio}%</div>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Rank</th>
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Position</th>
                  <th className="text-left p-4 font-semibold">Rating</th>
                  <th className="text-left p-4 font-semibold">Grade</th>
                  <th className="text-left p-4 font-semibold">Matches</th>
                  <th className="text-left p-4 font-semibold">Goals</th>
                  <th className="text-left p-4 font-semibold">Assists</th>
                  <th className="text-left p-4 font-semibold">Saves</th>
                  <th className="text-left p-4 font-semibold">Clean Sheets</th>
                  <th className="text-left p-4 font-semibold">G+A/Match</th>
                  <th className="text-left p-4 font-semibold">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => {
                  const goalsAndAssistsPerMatch = player.matchesPlayed > 0 
                    ? ((player.totalGoals + player.totalAssists) / player.matchesPlayed).toFixed(2)
                    : '0.00';
                  
                  const cleanSheetRatio = player.matchesPlayed > 0 
                    ? ((player.cleanSheets / player.matchesPlayed) * 100).toFixed(1)
                    : '0';

                  const savesPerMatch = player.matchesPlayed > 0 
                    ? (player.totalSaves / player.matchesPlayed).toFixed(1)
                    : '0.0';

                  return (
                    <tr key={player.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          {index + 1}
                          {index === 0 && <span className="ml-1 text-yellow-500">👑</span>}
                          {index === 1 && <span className="ml-1 text-gray-400">🥈</span>}
                          {index === 2 && <span className="ml-1 text-amber-600">🥉</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">Age {player.age}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={getPositionColor(player.position)}>
                          {player.position}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className={`text-lg font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`${getRatingColor(player.rating)} border-current`}>
                          {getPerformanceGrade(player.rating)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{player.matchesPlayed}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.matchesPlayed * 90} min
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-green-600 font-bold">{player.totalGoals}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.matchesPlayed > 0 ? (player.totalGoals / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-blue-600 font-bold">{player.totalAssists}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.matchesPlayed > 0 ? (player.totalAssists / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-yellow-600 font-bold">{player.totalSaves}</div>
                        <div className="text-xs text-muted-foreground">
                          {savesPerMatch}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-purple-600 font-bold">{player.cleanSheets}</div>
                        <div className="text-xs text-muted-foreground">
                          {cleanSheetRatio}% ratio
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{goalsAndAssistsPerMatch}</div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="text-green-600">G:</span> {player.totalGoals}
                            <span className="text-blue-600 ml-2">A:</span> {player.totalAssists}
                          </div>
                          {player.position === 'Goalkeeper' && (
                            <div className="text-xs">
                              <span className="text-yellow-600">Saves:</span> {player.totalSaves}
                              <span className="text-purple-600 ml-1">CS:</span> {player.cleanSheets}
                            </div>
                          )}
                          {(player.position === 'Defender' || player.position === 'Goalkeeper') && (
                            <div className="text-xs text-purple-600">
                              Clean Sheets: {cleanSheetRatio}%
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {players.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No players found</p>
              <p className="text-sm">Add some players to see statistics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
