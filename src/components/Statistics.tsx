import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Player, Match } from '@/types/football';
import { Trophy, Users, Target, TrendingUp, Calendar, Award, Star, Shield, Zap } from 'lucide-react';
import MatchesPlayedView from './MatchesPlayedView';

interface StatisticsProps {
  players: Player[];
  matches: Match[];
  onDeleteMatch?: (matchId: string) => Promise<void>;
}

const Statistics = ({ players, matches, onDeleteMatch }: StatisticsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'matches'>('overview');

  const completedMatches = useMemo(() => matches.filter(match => match.completed), [matches]);

  const topScorers = useMemo(() => {
    const playerGoals: { [playerId: string]: number } = {};
    completedMatches.forEach(match => {
      match.goals.forEach(goal => {
        playerGoals[goal.scorer] = (playerGoals[goal.scorer] || 0) + 1;
      });
    });

    return Object.entries(playerGoals)
      .sort(([, goalsA], [, goalsB]) => goalsB - goalsA)
      .slice(0, 5)
      .map(([playerId, goals]) => {
        const player = players.find(p => p.id === playerId);
        return { player, goals };
      })
      .filter(item => item.player)
      .map(item => ({
        ...item,
        player: {
          ...item.player!,
          averageMatchRating: item.player!.matchesPlayed > 0 ? item.player!.rating / item.player!.matchesPlayed : 0
        }
      }))
  }, [completedMatches, players]);

  const topAssists = useMemo(() => {
    const playerAssists: { [playerId: string]: number } = {};
    completedMatches.forEach(match => {
      match.goals.forEach(goal => {
        if (goal.assister) {
          playerAssists[goal.assister] = (playerAssists[goal.assister] || 0) + 1;
        }
      });
    });

    return Object.entries(playerAssists)
      .sort(([, assistsA], [, assistsB]) => assistsB - assistsA)
      .slice(0, 5)
      .map(([playerId, assists]) => {
        const player = players.find(p => p.id === playerId);
        return { player, assists };
      })
      .filter(item => item.player)
      .map(item => ({
        ...item,
        player: {
          ...item.player!,
          averageMatchRating: item.player!.matchesPlayed > 0 ? item.player!.rating / item.player!.matchesPlayed : 0
        }
      }))
  }, [completedMatches, players]);

  const topSaves = useMemo(() => {
    const playerSaves: { [playerId: string]: number } = {};
    completedMatches.forEach(match => {
      if (match.saves) {
        Object.entries(match.saves).forEach(([playerId, saves]) => {
          playerSaves[playerId] = (playerSaves[playerId] || 0) + saves;
        });
      }
    });

    return Object.entries(playerSaves)
      .sort(([, savesA], [, savesB]) => savesB - savesA)
      .slice(0, 5)
      .map(([playerId, saves]) => {
        const player = players.find(p => p.id === playerId);
        return { player, saves };
      })
      .filter(item => item.player)
      .map(item => ({
        ...item,
        player: {
          ...item.player!,
          averageMatchRating: item.player!.matchesPlayed > 0 ? item.player!.rating / item.player!.matchesPlayed : 0
        }
      }))
  }, [completedMatches, players]);

  const mostExperienced = useMemo(() => {
    return [...players]
      .sort((a, b) => b.matchesPlayed - a.matchesPlayed)
      .slice(0, 5)
      .map(player => ({
        ...player,
        averageMatchRating: player.matchesPlayed > 0 ? player.rating / player.matchesPlayed : 0
      }));
  }, [players]);

  const teamStats = useMemo(() => {
    const teamAverages = completedMatches.reduce((acc, match) => {
      const teamARating = match.teamA.reduce((sum, playerId) => {
        const player = players.find(p => p.id === playerId);
        return sum + (player ? player.rating : 0);
      }, 0) / match.teamA.length;

      const teamBRating = match.teamB.reduce((sum, playerId) => {
        const player = players.find(p => p.id === playerId);
        return sum + (player ? player.rating : 0);
      }, 0) / match.teamB.length;

      return {
        teamA: acc.teamA + teamARating,
        teamB: acc.teamB + teamBRating,
        count: acc.count + 1
      };
    }, { teamA: 0, teamB: 0, count: 0 });

    const overallAverageTeamA = teamAverages.teamA / teamAverages.count;
    const overallAverageTeamB = teamAverages.teamB / teamAverages.count;

    return {
      averageTeamA: overallAverageTeamA || 0,
      averageTeamB: overallAverageTeamB || 0
    };
  }, [completedMatches, players]);

  if (activeTab === 'matches') {
    return (
      <MatchesPlayedView 
        matches={matches} 
        players={players} 
        onDeleteMatch={onDeleteMatch}
      />
    );
  }

  return (
    <div className="grid gap-4 lg:gap-6">
      {/* Tabs */}
      <div className="flex items-center space-x-2 p-2 lg:p-4 bg-white/5 rounded-xl border border-white/10">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'secondary'}
          className="flex-1"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'matches' ? 'default' : 'secondary'}
          className="flex-1"
          onClick={() => setActiveTab('matches')}
        >
          Matches Played
        </Button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Top Scorers */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-400" />
              Top Scorers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topScorers.length > 0 ? (
              topScorers.map(({ player, goals }) => (
                <div key={player.id} className="flex items-center justify-between">
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
                  <Badge variant="secondary" className="text-green-400">
                    {goals} goals
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-on-dark-muted text-sm text-center">No goals recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Top Assists */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Top Assists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAssists.length > 0 ? (
              topAssists.map(({ player, assists }) => (
                <div key={player.id} className="flex items-center justify-between">
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
                  <Badge variant="secondary" className="text-blue-400">
                    {assists} assists
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-on-dark-muted text-sm text-center">No assists recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Top Saves */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Top Saves
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topSaves.length > 0 ? (
              topSaves.map(({ player, saves }) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-400/20 border border-amber-400/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-300">
                        {player.position.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-on-dark">{player.name}</div>
                      <div className="text-xs text-on-dark-muted">{player.position}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-amber-400">
                    {saves} saves
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-on-dark-muted text-sm text-center">No saves recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Most Experienced Players */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Most Experienced
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mostExperienced.length > 0 ? (
              mostExperienced.map((player) => (
                <div key={player.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-purple-400/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-300">
                        {player.position.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-on-dark">{player.name}</div>
                      <div className="text-xs text-on-dark-muted">{player.position}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-purple-400">
                    {player.matchesPlayed} matches
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-on-dark-muted text-sm text-center">No players recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Team Statistics */}
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Users className="w-4 h-4 text-pink-400" />
              Team Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-on-dark">Average Team A Rating:</div>
              <Badge variant="secondary" className="text-pink-400">
                {teamStats.averageTeamA.toFixed(2)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-on-dark">Average Team B Rating:</div>
              <Badge variant="secondary" className="text-pink-400">
                {teamStats.averageTeamB.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
