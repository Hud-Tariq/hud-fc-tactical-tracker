import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Player, Match } from '@/types/football';
import {
  Calendar,
  Users,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from 'lucide-react';
import { Icon } from '@/components/ui/icon';

interface MatchesPlayedViewProps {
  matches: Match[];
  players: Player[];
}

const MatchesPlayedView = ({ matches, players }: MatchesPlayedViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');

  // Create a player lookup map
  const playerMap = useMemo(() => {
    return players.reduce((map, player) => {
      map[player.id] = player;
      return map;
    }, {} as Record<string, Player>);
  }, [players]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    let filtered = matches.filter(match => match.completed);
    
    if (searchTerm) {
      filtered = filtered.filter(match => {
        const teamANames = match.teamA.map(id => playerMap[id]?.name || '').join(' ');
        const teamBNames = match.teamB.map(id => playerMap[id]?.name || '').join(' ');
        return teamANames.toLowerCase().includes(searchTerm.toLowerCase()) ||
               teamBNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
               match.date.includes(searchTerm);
      });
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        const aTotalScore = a.scoreA + a.scoreB;
        const bTotalScore = b.scoreA + b.scoreB;
        return bTotalScore - aTotalScore;
      }
    });
  }, [matches, searchTerm, sortBy, playerMap]);

  const getMatchResult = (match: Match) => {
    if (match.scoreA > match.scoreB) return 'Team A Victory';
    if (match.scoreB > match.scoreA) return 'Team B Victory';
    return 'Draw';
  };

  const getMatchResultColor = (match: Match) => {
    if (match.scoreA > match.scoreB) return 'text-green-400 bg-green-400/20 border-green-400/30';
    if (match.scoreB > match.scoreA) return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    return 'text-amber-400 bg-amber-400/20 border-amber-400/30';
  };

  const getPlayerStats = (match: Match, playerId: string) => {
    const goals = match.goals?.filter(goal => goal.scorer === playerId).length || 0;
    const assists = match.goals?.filter(goal => goal.assister === playerId).length || 0;
    const saves = match.saves?.[playerId] || 0;
    const rating = match.matchRatings?.[playerId] || 0;
    
    return { goals, assists, saves, rating };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (filteredMatches.length === 0) {
    return (
      <div className="floating-section">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur p-8 rounded-full border border-white/20">
              <Trophy className="w-16 h-16 text-on-dark-subtle" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-on-dark font-poppins">
            No Matches Played Yet
          </h3>
          <p className="text-on-dark-muted text-lg max-w-md mx-auto">
            Start playing matches to see detailed match history and performance analytics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header with Search and Filters */}
      <div className="floating-card p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-dark-subtle w-5 h-5" />
              <Input
                placeholder="Search by player name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-on-dark placeholder:text-on-dark-subtle focus:border-pink-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortBy(sortBy === 'date' ? 'score' : 'date')}
              className="text-on-dark-muted hover:text-on-dark hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Sort by {sortBy === 'date' ? 'Date' : 'Score'}
            </Button>
            <Badge variant="secondary" className="text-on-dark-muted">
              {filteredMatches.length} matches
            </Badge>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4 lg:space-y-6">
        {filteredMatches.map((match, index) => {
          const isExpanded = expandedMatch === match.id;
          const resultColor = getMatchResultColor(match);
          
          return (
            <Card key={match.id} className={`floating-card animate-fade-in animate-stagger-${(index % 3) + 1} overflow-hidden`}>
              {/* Match Header */}
              <CardHeader 
                className="cursor-pointer hover:bg-white/5 transition-all duration-200 pb-4"
                onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-bold text-on-dark font-poppins">
                            {formatDate(match.date)}
                          </h3>
                          <Badge className={`text-xs ${resultColor} border`}>
                            {getMatchResult(match)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-on-dark-muted">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(match.date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Score Display */}
                    <div className="text-center">
                      <div className="text-2xl lg:text-3xl font-bold text-on-dark font-poppins">
                        {match.scoreA} - {match.scoreB}
                      </div>
                      <div className="text-xs text-on-dark-subtle">
                        Final Score
                      </div>
                    </div>

                    {/* Expand Button */}
                    <Button variant="ghost" size="sm" className="text-on-dark-muted hover:text-on-dark">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Expanded Match Details */}
              {isExpanded && (
                <CardContent className="pt-0 space-y-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  {/* Teams Display */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Team A */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-green-400 font-poppins flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Team A ({match.scoreA})
                        </h4>
                        {match.scoreA > match.scoreB && (
                          <Badge className="bg-green-400/20 text-green-300 border-green-400/30">
                            <Trophy className="w-3 h-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {match.teamA.map((playerId) => {
                          const player = playerMap[playerId];
                          const stats = getPlayerStats(match, playerId);
                          
                          if (!player) return null;
                          
                          return (
                            <div key={playerId} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30 flex items-center justify-center">
                                  <span className="text-xs font-bold text-green-300">
                                    {player.position.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-on-dark">{player.name}</div>
                                  <div className="text-xs text-on-dark-muted">{player.position}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-xs">
                                {stats.goals > 0 && (
                                  <div className="flex items-center space-x-1 text-green-400">
                                    <Target className="w-3 h-3" />
                                    <span>{stats.goals}</span>
                                  </div>
                                )}
                                {stats.assists > 0 && (
                                  <div className="flex items-center space-x-1 text-blue-400">
                                    <Zap className="w-3 h-3" />
                                    <span>{stats.assists}</span>
                                  </div>
                                )}
                                {stats.saves > 0 && (
                                  <div className="flex items-center space-x-1 text-amber-400">
                                    <Shield className="w-3 h-3" />
                                    <span>{stats.saves}</span>
                                  </div>
                                )}
                                {stats.rating > 0 && (
                                  <div className="flex items-center space-x-1 text-purple-400">
                                    <Award className="w-3 h-3" />
                                    <span>{stats.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Team B */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-blue-400 font-poppins flex items-center">
                          <Users className="w-5 h-5 mr-2" />
                          Team B ({match.scoreB})
                        </h4>
                        {match.scoreB > match.scoreA && (
                          <Badge className="bg-blue-400/20 text-blue-300 border-blue-400/30">
                            <Trophy className="w-3 h-3 mr-1" />
                            Winner
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {match.teamB.map((playerId) => {
                          const player = playerMap[playerId];
                          const stats = getPlayerStats(match, playerId);
                          
                          if (!player) return null;
                          
                          return (
                            <div key={playerId} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-blue-400/30 flex items-center justify-center">
                                  <span className="text-xs font-bold text-blue-300">
                                    {player.position.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-on-dark">{player.name}</div>
                                  <div className="text-xs text-on-dark-muted">{player.position}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3 text-xs">
                                {stats.goals > 0 && (
                                  <div className="flex items-center space-x-1 text-green-400">
                                    <Target className="w-3 h-3" />
                                    <span>{stats.goals}</span>
                                  </div>
                                )}
                                {stats.assists > 0 && (
                                  <div className="flex items-center space-x-1 text-blue-400">
                                    <Zap className="w-3 h-3" />
                                    <span>{stats.assists}</span>
                                  </div>
                                )}
                                {stats.saves > 0 && (
                                  <div className="flex items-center space-x-1 text-amber-400">
                                    <Shield className="w-3 h-3" />
                                    <span>{stats.saves}</span>
                                  </div>
                                )}
                                {stats.rating > 0 && (
                                  <div className="flex items-center space-x-1 text-purple-400">
                                    <Award className="w-3 h-3" />
                                    <span>{stats.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Match Statistics */}
                  {(match.goals?.length > 0 || Object.keys(match.saves || {}).length > 0) && (
                    <div className="space-y-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      
                      <h4 className="text-lg font-semibold text-on-dark font-poppins flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-pink-400" />
                        Match Events
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Goals */}
                        {match.goals?.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-green-400 flex items-center">
                              <Target className="w-4 h-4 mr-2" />
                              Goals ({match.goals.length})
                            </h5>
                            <div className="space-y-2">
                              {match.goals.map((goal, goalIndex) => {
                                const scorer = playerMap[goal.scorer];
                                const assister = goal.assister ? playerMap[goal.assister] : null;
                                
                                return (
                                  <div key={goalIndex} className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                      <div className="text-sm">
                                        <span className="font-medium text-on-dark">
                                          {scorer?.name || 'Unknown'}
                                        </span>
                                        {assister && (
                                          <span className="text-on-dark-muted">
                                            {' '}(assist: {assister.name})
                                          </span>
                                        )}
                                        {goal.isOwnGoal && (
                                          <Badge className="ml-2 text-xs bg-red-400/20 text-red-300 border-red-400/30">
                                            Own Goal
                                          </Badge>
                                        )}
                                      </div>
                                      <Badge variant="outline" className={`text-xs ${goal.team === 'A' ? 'text-green-400 border-green-400/30' : 'text-blue-400 border-blue-400/30'}`}>
                                        Team {goal.team}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Saves */}
                        {Object.keys(match.saves || {}).length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-amber-400 flex items-center">
                              <Shield className="w-4 h-4 mr-2" />
                              Saves
                            </h5>
                            <div className="space-y-2">
                              {Object.entries(match.saves || {}).map(([playerId, saves]) => {
                                const player = playerMap[playerId];
                                if (!player || saves === 0) return null;
                                
                                return (
                                  <div key={playerId} className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-on-dark">
                                        {player.name}
                                      </span>
                                      <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                                        {saves} saves
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesPlayedView;
