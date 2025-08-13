import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Player, Match } from '@/types/football';
import { TrendingUp, Users, BarChart3, Calendar } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import MatchesPlayedView from './MatchesPlayedView';

interface StatisticsProps {
  players: Player[];
  matches?: Match[];
  onRemoveMatch?: (matchId: string) => void;
}

const Statistics = ({ players, matches = [], onRemoveMatch }: StatisticsProps) => {
  const [activeTab, setActiveTab] = useState<'team-stats' | 'matches'>('team-stats');

  const tabs = [
    {
      id: 'team-stats' as const,
      label: 'Team Statistics',
      icon: BarChart3,
      description: 'Player performance and team analytics'
    },
    {
      id: 'matches' as const,
      label: 'Matches Played',
      icon: Calendar,
      description: 'Detailed match history and results'
    }
  ];

  // Early return if no players for team stats
  if (!players || players.length === 0) {
    return (
      <div className="floating-section">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur p-8 rounded-full border border-white/20">
              <Users className="w-16 h-16 text-on-dark-subtle" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-dark font-poppins">
            No Statistics Available
          </h2>
          <p className="text-on-dark-muted text-lg max-w-md mx-auto">
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
        return 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 border-yellow-400/30';
      case 'Defender':
        return 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-300 border-blue-400/30';
      case 'Midfielder':
        return 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-300 border-green-400/30';
      case 'Forward':
        return 'bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-300 border-red-400/30';
      default:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return 'text-emerald-400';
    if (rating >= 75) return 'text-blue-400';
    if (rating >= 65) return 'text-amber-400';
    if (rating >= 55) return 'text-orange-400';
    return 'text-red-400';
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

  const renderTeamStatistics = () => (
    <div className="space-y-6 lg:space-y-8">
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-8 lg:mb-16">
        {[
          { value: players.length, label: 'Players', color: 'text-blue-400' },
          { value: totalStats.totalGoals, label: 'Total Goals', color: 'text-green-400' },
          { value: totalStats.totalMatches, label: 'Matches', color: 'text-purple-400' },
          { value: totalStats.averageRating, label: 'Avg Rating', color: 'text-pink-400' }
        ].map((stat, index) => (
          <div key={stat.label} className={`floating-card animate-fade-in animate-stagger-${index + 1}`}>
            <div className="p-4 lg:p-8 text-center">
              <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                <TrendingUp className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
              </div>
              <p className="text-2xl lg:text-4xl font-bold text-on-dark mb-1 lg:mb-3">{stat.value}</p>
              <p className="text-on-dark-muted text-xs lg:text-base">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Performers Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-16">
        <Card className="floating-card hover:scale-105 transition-all duration-300 border-l-4 border-l-green-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-400 flex items-center space-x-2 text-base sm:text-lg font-poppins">
              <Icon name="goal" size={20} className="w-5 h-5" />
              <span>Top Scorer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-on-dark">{topScorer.name}</div>
            <div className="text-sm text-green-400">
              {topScorer.totalGoals} goals in {topScorer.matchesPlayed} matches
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-green-400/20 text-green-300 border-green-400/30">
                {topScorer.matchesPlayed > 0 ? (topScorer.totalGoals / topScorer.matchesPlayed).toFixed(2) : '0.00'} goals/match
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(topScorer.rating)}`}>
                {topScorer.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card hover:scale-105 transition-all duration-300 border-l-4 border-l-blue-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-400 flex items-center space-x-2 text-base sm:text-lg font-poppins">
              <Icon name="lightning-forward" size={20} className="w-5 h-5" />
              <span>Top Assister</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-on-dark">{topAssister.name}</div>
            <div className="text-sm text-blue-400">
              {topAssister.totalAssists} assists in {topAssister.matchesPlayed} matches
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-400/20 text-blue-300 border-blue-400/30">
                {topAssister.matchesPlayed > 0 ? (topAssister.totalAssists / topAssister.matchesPlayed).toFixed(2) : '0.00'} assists/match
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(topAssister.rating)}`}>
                {topAssister.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="floating-card hover:scale-105 transition-all duration-300 border-l-4 border-l-purple-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-400 flex items-center space-x-2 text-base sm:text-lg font-poppins">
              <Icon name="trophy" size={20} className="w-5 h-5" />
              <span>Most Experienced</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xl sm:text-2xl font-bold text-on-dark">{mostExperienced.name}</div>
            <div className="text-sm text-purple-400">
              {mostExperienced.matchesPlayed} matches played
            </div>
            <div className="flex items-center justify-between">
              <Badge className="bg-purple-400/20 text-purple-300 border-purple-400/30">
                {mostExperienced.position}
              </Badge>
              <div className={`text-lg font-bold ${getRatingColor(mostExperienced.rating)}`}>
                {mostExperienced.rating}
              </div>
            </div>
          </CardContent>
        </Card>

        {bestKeeper && (
          <Card className="floating-card hover:scale-105 transition-all duration-300 border-l-4 border-l-amber-400">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-400 flex items-center space-x-2 text-base sm:text-lg font-poppins">
              <Icon name="wall-goalkeeper" size={20} className="w-5 h-5" />
              <span>Best Keeper</span>
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xl sm:text-2xl font-bold text-on-dark">{bestKeeper.name}</div>
              <div className="text-sm text-amber-400">
                {bestKeeper.cleanSheets} clean sheets
              </div>
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30">
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
      <Card className="floating-card">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-2xl">
          <CardTitle className="text-xl sm:text-2xl flex items-center space-x-2 font-poppins">
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
                  <Card key={player.id} className="p-4 space-y-3 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/20 text-on-dark'}`}>
                            #{index + 1}
                          </div>
                          {index === 0 && <span className="text-xl">👑</span>}
                          {index === 1 && <span className="text-xl">🥈</span>}
                          {index === 2 && <span className="text-xl">🥉</span>}
                        </div>
                        <div className="font-bold text-lg text-on-dark font-poppins">{player.name}</div>
                        <div className="text-sm text-on-dark-muted">Age {player.age}</div>
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
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                      <div className="space-y-1">
                        <div className="text-xs text-on-dark-subtle uppercase tracking-wide">Matches</div>
                        <div className="font-bold text-on-dark">{player.matchesPlayed}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-on-dark-subtle uppercase tracking-wide">G+A/Match</div>
                        <div className="font-bold text-blue-400">{goalsAndAssistsPerMatch}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-on-dark-subtle uppercase tracking-wide">Goals</div>
                        <div className="font-bold text-green-400">{player.totalGoals}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-on-dark-subtle uppercase tracking-wide">Assists</div>
                        <div className="font-bold text-blue-400">{player.totalAssists}</div>
                      </div>
                      {player.position === 'Goalkeeper' && (
                        <>
                          <div className="space-y-1">
                            <div className="text-xs text-on-dark-subtle uppercase tracking-wide">Saves</div>
                            <div className="font-bold text-amber-400">{player.totalSaves}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-on-dark-subtle uppercase tracking-wide">Clean Sheets</div>
                            <div className="font-bold text-purple-400">{cleanSheetRatio}%</div>
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
              <thead className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur">
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Rank</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Player</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Position</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Rating</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Grade</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Matches</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Goals</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Assists</th>
                  <th className="text-left p-4 font-bold text-on-dark font-poppins">Performance</th>
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
                      className={`border-b border-white/10 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 transition-all duration-200 ${index < 3 ? 'bg-gradient-to-r from-pink-500/10 to-purple-600/10' : ''}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/20 text-on-dark'}`}>
                            {index + 1}
                          </div>
                          {index === 0 && <span className="text-lg">👑</span>}
                          {index === 1 && <span className="text-lg">🥈</span>}
                          {index === 2 && <span className="text-lg">🥉</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-on-dark font-poppins">{player.name}</div>
                        <div className="text-sm text-on-dark-muted">Age {player.age}</div>
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
                        <div className="font-bold text-on-dark">{player.matchesPlayed}</div>
                        <div className="text-xs text-on-dark-subtle">
                          {player.matchesPlayed * 90} min
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-green-400 font-bold text-lg">{player.totalGoals}</div>
                        <div className="text-xs text-on-dark-subtle">
                          {player.matchesPlayed > 0 ? (player.totalGoals / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-blue-400 font-bold text-lg">{player.totalAssists}</div>
                        <div className="text-xs text-on-dark-subtle">
                          {player.matchesPlayed > 0 ? (player.totalAssists / player.matchesPlayed).toFixed(2) : '0.00'}/match
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-on-dark-muted">
                            G+A: <span className="text-purple-400 font-bold">{goalsAndAssistsPerMatch}</span>/match
                          </div>
                          {player.position === 'Goalkeeper' && (
                            <div className="text-xs text-on-dark-subtle">
                              <span className="text-amber-400">Saves:</span> {player.totalSaves} | 
                              <span className="text-purple-400 ml-1">CS:</span> {player.cleanSheets}
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

  return (
    <div className="floating-section">
      {/* Header */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-pink-400/30 mb-4">
          <Icon name="statistics" size={20} className="w-5 h-5 mr-2 text-pink-400" />
          <span className="text-on-dark-muted font-medium">Team Analytics</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Squad
          <span className="gradient-text-light ml-3">Statistics</span>
        </h1>
        <p className="text-lg lg:text-2xl text-on-dark-muted max-w-3xl mx-auto">
          Comprehensive performance analytics and insights for your squad
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 lg:mb-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="lg"
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 h-auto flex-1 justify-start
                ${isActive
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-600/20 text-on-dark border border-pink-400/30 shadow-lg'
                  : 'text-on-dark-muted hover:text-on-dark hover:bg-white/10'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium text-base">{tab.label}</div>
                <div className="text-xs text-on-dark-subtle hidden sm:block">{tab.description}</div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-600/10 animate-pulse"></div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'team-stats' && renderTeamStatistics()}
      {activeTab === 'matches' && <MatchesPlayedView matches={matches} players={players} onRemoveMatch={onRemoveMatch} />}
    </div>
  );
};

export default Statistics;
