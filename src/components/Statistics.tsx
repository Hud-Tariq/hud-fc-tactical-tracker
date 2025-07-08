
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/football';
import { Trophy, Target, Zap, Shield, TrendingUp, Users } from 'lucide-react';

interface StatisticsProps {
  players: Player[];
}

const Statistics = ({ players }: StatisticsProps) => {
  // Early return if no players
  if (!players || players.length === 0) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-8 rounded-full">
              <Users className="w-16 h-16 text-orange-600" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            No Statistics Available
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Add some players to your squad to start tracking performance statistics and analytics.
          </p>
        </div>
      </div>
    );
  }

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper':
        return 'bg-amber-100 text-amber-800 border-amber-200';
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
    if (rating >= 85) return 'text-emerald-600';
    if (rating >= 75) return 'text-blue-600';
    if (rating >= 65) return 'text-amber-600';
    if (rating >= 55) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (rating: number) => {
    if (rating >= 90) return 'S+';
    if (rating >= 85) return 'S';
    if (rating >= 80) return 'A';
    if (rating >= 70) return 'B';
    if (rating >= 60) return 'C';
    if (rating >= 50) return 'D';
    return 'F';
  };

  // Safe reduce operations with fallbacks
  const topScorer = players.reduce((prev, current) => 
    (prev.totalGoals > current.totalGoals) ? prev : current, players[0]
  );

  const topAssister = players.reduce((prev, current) => 
    (prev.totalAssists > current.totalAssists) ? prev : current, players[0]
  );

  const mostExperienced = players.reduce((prev, current) => 
    (prev.matchesPlayed > current.matchesPlayed) ? prev : current, players[0]
  );

  const goalkeepers = players.filter(p => p.position === 'Goalkeeper');
  const bestKeeper = goalkeepers.length > 0 
    ? goalkeepers.reduce((prev, current) => {
        const prevCleanSheetRatio = prev.matchesPlayed > 0 ? prev.cleanSheets / prev.matchesPlayed : 0;
        const currentCleanSheetRatio = current.matchesPlayed > 0 ? current.cleanSheets / current.matchesPlayed : 0;
        return prevCleanSheetRatio > currentCleanSheetRatio ? prev : current;
      }, goalkeepers[0])
    : null;

  const totalStats = {
    totalGoals: players.reduce((sum, p) => sum + p.totalGoals, 0),
    totalMatches: Math.max(...players.map(p => p.matchesPlayed), 0),
    totalAssists: players.reduce((sum, p) => sum + p.totalAssists, 0),
    averageRating: players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length) : 0
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-3 rounded-full shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Team Statistics
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Comprehensive performance analytics and insights for your squad
        </p>
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{players.length}</div>
            <div className="text-sm text-blue-600/80">Players</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalStats.totalGoals}</div>
            <div className="text-sm text-green-600/80">Total Goals</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{totalStats.totalMatches}</div>
            <div className="text-sm text-purple-600/80">Matches</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{totalStats.averageRating}</div>
            <div className="text-sm text-amber-600/80">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Top Performers Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center space-x-2 text-base sm:text-lg">
              <Target className="w-5 h-5" />
              <span>Top Scorer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-green-800">{topScorer.name}</div>
            <div className="text-sm text-green-600">
              {topScorer.totalGoals} goals in {topScorer.matchesPlayed} matches
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {topScorer.matchesPlayed > 0 ? (topScorer.totalGoals / topScorer.matchesPlayed).toFixed(2) : '0.00'} goals/match
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(topScorer.rating)}`}>
                {topScorer.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-sky-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 flex items-center space-x-2 text-base sm:text-lg">
              <Zap className="w-5 h-5" />
              <span>Top Assister</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-blue-800">{topAssister.name}</div>
            <div className="text-sm text-blue-600">
              {topAssister.totalAssists} assists in {topAssister.matchesPlayed} matches
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {topAssister.matchesPlayed > 0 ? (topAssister.totalAssists / topAssister.matchesPlayed).toFixed(2) : '0.00'} assists/match
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(topAssister.rating)}`}>
                {topAssister.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-700 flex items-center space-x-2 text-base sm:text-lg">
              <Trophy className="w-5 h-5" />
              <span>Most Experienced</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-purple-800">{mostExperienced.name}</div>
            <div className="text-sm text-purple-600">
              {mostExperienced.matchesPlayed} matches played
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                {mostExperienced.position}
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(mostExperienced.rating)}`}>
                {mostExperienced.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        {bestKeeper && (
          <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-700 flex items-center space-x-2 text-base sm:text-lg">
                <Shield className="w-5 h-5" />
                <span>Best Keeper</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xl sm:text-2xl font-bold text-amber-800">{bestKeeper.name}</div>
              <div className="text-sm text-amber-600">
                {bestKeeper.cleanSheets} clean sheets
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {bestKeeper.matchesPlayed > 0 ? ((bestKeeper.cleanSheets / bestKeeper.matchesPlayed) * 100).toFixed(1) : '0'}% clean sheet ratio
                </Badge>
                <div className={`text-lg font-bold ${getRatingColor(bestKeeper.rating)}`}>
                  {bestKeeper.rating}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* All Players Table */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
          <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Squad Performance Overview</span>
          </CardTitle>
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
                  <Card key={player.id} className="p-4 space-y-3 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            #{index + 1}
                          </div>
                          {index === 0 && <span className="text-xl">👑</span>}
                          {index === 1 && <span className="text-xl">🥈</span>}
                          {index === 2 && <span className="text-xl">🥉</span>}
                        </div>
                        <div className="font-bold text-lg text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-600">Age {player.age}</div>
                        <Badge className={`${getPositionColor(player.position)} text-xs font-medium`}>
                          {player.position}
                        </Badge>
                      </div>
                      <div className="text-right space-y-2">
                        <div className={`text-3xl font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating}
                        </div>
                        <Badge variant="outline" className={`${getRatingColor(player.rating)} border-current text-sm font-bold`}>
                          {getPerformanceGrade(player.rating)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Matches</div>
                        <div className="font-bold text-gray-900">{player.matchesPlayed}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">G+A/Match</div>
                        <div className="font-bold text-blue-600">{goalsAndAssistsPerMatch}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Goals</div>
                        <div className="font-bold text-green-600">{player.totalGoals}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Assists</div>
                        <div className="font-bold text-blue-600">{player.totalAssists}</div>
                      </div>
                      {player.position === 'Goalkeeper' && (
                        <>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Saves</div>
                            <div className="font-bold text-amber-600">{player.totalSaves}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Clean Sheets</div>
                            <div className="font-bold text-purple-600">{cleanSheetRatio}%</div>
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
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-bold text-gray-700">Rank</th>
                  <th className="text-left p-4 font-bold text-gray-700">Player</th>
                  <th className="text-left p-4 font-bold text-gray-700">Position</th>
                  <th className="text-left p-4 font-bold text-gray-700">Rating</th>
                  <th className="text-left p-4 font-bold text-gray-700">Grade</th>
                  <th className="text-left p-4 font-bold text-gray-700">Matches</th>
                  <th className="text-left p-4 font-bold text-gray-700">Goals</th>
                  <th className="text-left p-4 font-bold text-gray-700">Assists</th>
                  <th className="text-left p-4 font-bold text-gray-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {sortedPlayers.map((player, index) => {
                  const goalsAndAssistsPerMatch = player.matchesPlayed > 0 
                    ? ((player.totalGoals + player.totalAssists) / player.matchesPlayed).toFixed(2)
                    : '0.00';

                  return (
                    <tr 
                      key={player.id} 
                      className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-200 ${index < 3 ? 'bg-gradient-to-r from-amber-50/30 to-orange-50/30' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {index + 1}
                          </div>
                          {index === 0 && <span className="text-lg">👑</span>}
                          {index === 1 && <span className="text-lg">🥈</span>}
                          {index === 2 && <span className="text-lg">🥉</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-600">Age {player.age}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getPositionColor(player.position)} font-medium`}>
                          {player.position}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className={`text-2xl font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={`${getRatingColor(player.rating)} border-current font-bold`}>
                          {getPerformanceGrade(player.rating)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{player.matchesPlayed}</div>
                        <div className="text-xs text-gray-500">
                          {player.matchesPlayed * 90} min
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-green-600 font-bold text-lg">{player.totalGoals}</div>
                        <div className="text-xs text-gray-500">
                          {player.matchesPlayed > 0 ? (player.totalGoals / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-blue-600 font-bold text-lg">{player.totalAssists}</div>
                        <div className="text-xs text-gray-500">
                          {player.matchesPlayed > 0 ? (player.totalAssists / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">
                            G+A: <span className="text-purple-600 font-bold">{goalsAndAssistsPerMatch}</span>/match
                          </div>
                          {player.position === 'Goalkeeper' && (
                            <div className="text-xs text-gray-600">
                              <span className="text-amber-600">Saves:</span> {player.totalSaves} | 
                              <span className="text-purple-600 ml-1">CS:</span> {player.cleanSheets}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
