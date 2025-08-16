import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PlayerCard from './PlayerCard';
import { Player, Match, Goal } from '@/types/football';
import { Calendar, Users, Plus, Minus, Save, Clock } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

interface MatchCreationProps {
  players: Player[];
  onCreateMatch: (match: Omit<Match, 'id'>) => void;
}

const MatchCreation = ({ players, onCreateMatch }: MatchCreationProps) => {
  const [matchDate, setMatchDate] = useState('');
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [saves, setSaves] = useState<Record<string, number>>({});

  const handlePlayerSelect = (player: Player, team: 'A' | 'B') => {
    if (team === 'A' && teamA.length < 5) {
      setTeamA([...teamA, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
    } else if (team === 'B' && teamB.length < 5) {
      setTeamB([...teamB, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
    }
  };

  const handlePlayerRemove = (player: Player, team: 'A' | 'B') => {
    if (team === 'A') {
      setTeamA(teamA.filter(p => p.id !== player.id));
    } else {
      setTeamB(teamB.filter(p => p.id !== player.id));
    }
    setAvailablePlayers([...availablePlayers, player]);
  };

  const addGoal = (team: 'A' | 'B') => {
    setGoals([...goals, { scorer: '', assister: undefined, team, isOwnGoal: false }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | boolean) => {
    const updatedGoals = [...goals];
    if (field === 'assister' && value === 'no-assist') {
      updatedGoals[index] = { ...updatedGoals[index], [field]: undefined };
    } else {
      updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    }
    setGoals(updatedGoals);
  };

  const updateSaves = (playerId: string, saveCount: number) => {
    setSaves(prev => ({
      ...prev,
      [playerId]: saveCount
    }));
  };

  const getTeamPlayers = (team: 'A' | 'B') => {
    return team === 'A' ? teamA : teamB;
  };

  const getOpposingTeamPlayers = (team: 'A' | 'B') => {
    return team === 'A' ? teamB : teamA;
  };

  const calculateScore = (team: 'A' | 'B') => {
    return goals.filter(g => {
      if (g.isOwnGoal) {
        return g.team !== team;
      }
      return g.team === team && g.scorer;
    }).length;
  };

  const handleCreateMatch = () => {
    const minPlayers = 5;
    const maxPlayers = 11;
    const validTeamSizes = teamA.length >= minPlayers && teamA.length <= maxPlayers &&
                          teamB.length >= minPlayers && teamB.length <= maxPlayers;

    if (matchDate && validTeamSizes) {
      const validGoals = goals.filter(g => g.scorer);
      const scoreA = calculateScore('A');
      const scoreB = calculateScore('B');
      
      const match: Omit<Match, 'id'> = {
        date: matchDate,
        teamA: teamA.map(p => p.id),
        teamB: teamB.map(p => p.id),
        scoreA,
        scoreB,
        goals: validGoals,
        saves,
        completed: true
      };
      onCreateMatch(match);
      
      // Reset form
      setMatchDate('');
      setTeamA([]);
      setTeamB([]);
      setAvailablePlayers(players);
      setGoals([]);
      setSaves({});
    }
  };

  const teamAGoals = calculateScore('A');
  const teamBGoals = calculateScore('B');

  return (
    <div className="floating-section">
      {/* Hero Header */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-purple-400/30 mb-4">
          <span className="text-purple-400 text-lg mr-2">⚽</span>
          <span className="text-on-dark-muted font-medium">Match Creation</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Create
          <span className="gradient-text-light ml-3">Match</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl text-on-dark-muted max-w-none sm:max-w-3xl mx-auto px-2 sm:px-0">
          Set up teams, track goals, and create memorable football matches
        </p>
      </div>

      {/* Match Details Card */}
      <div className="floating-card mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-on-dark font-poppins">Match Details</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-on-dark-muted">Match Date</Label>
              <Input
                id="date"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            
            {(teamA.length === 5 && teamB.length === 5) && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="text-center p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30">
                  <h4 className="text-blue-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Team A Score</h4>
                  <div className="text-2xl sm:text-4xl font-bold text-on-dark">{teamAGoals}</div>
                </div>
                <div className="text-center p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-400/30">
                  <h4 className="text-red-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Team B Score</h4>
                  <div className="text-2xl sm:text-4xl font-bold text-on-dark">{teamBGoals}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
        {/* Team A */}
        <div className="floating-card">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 flex items-center justify-center">
                  <span className="text-blue-400 text-lg">👕</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-300 font-poppins">Team A</h3>
              </div>
              <div className="text-on-dark-muted">
                <span className={`${teamA.length < 5 ? 'text-red-400' : teamA.length > 11 ? 'text-red-400' : 'text-green-400'}`}>
                  {teamA.length}
                </span>
                <span className="text-gray-400">/5-11 players</span>
                {teamA.length < 5 && <span className="text-red-400 text-sm block">Min: 5 players</span>}
                {teamA.length > 11 && <span className="text-red-400 text-sm block">Max: 11 players</span>}
              </div>
            </div>
            
            <div className="space-y-4">
              {teamA.map((player) => (
                <div key={player.id} className="relative group">
                  <PlayerCard 
                    player={player} 
                    onClick={() => handlePlayerRemove(player, 'A')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerRemove(player, 'A');
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {teamA.length < 5 && (
                <div className="text-center py-8 border-2 border-dashed border-blue-400/30 rounded-2xl">
                  <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-2" />
                  <p className="text-on-dark-muted">
                    Select {5 - teamA.length} more player{5 - teamA.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team B */}
        <div className="floating-card">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-400/30 flex items-center justify-center">
                  <span className="text-red-400 text-lg">👕</span>
                </div>
                <h3 className="text-2xl font-bold text-red-300 font-poppins">Team B</h3>
              </div>
              <div className="text-on-dark-muted">
                <span className={`${teamB.length < 5 ? 'text-red-400' : teamB.length > 11 ? 'text-red-400' : 'text-green-400'}`}>
                  {teamB.length}
                </span>
                <span className="text-gray-400">/5-11 players</span>
                {teamB.length < 5 && <span className="text-red-400 text-sm block">Min: 5 players</span>}
                {teamB.length > 11 && <span className="text-red-400 text-sm block">Max: 11 players</span>}
              </div>
            </div>
            
            <div className="space-y-4">
              {teamB.map((player) => (
                <div key={player.id} className="relative group">
                  <PlayerCard 
                    player={player} 
                    onClick={() => handlePlayerRemove(player, 'B')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayerRemove(player, 'B');
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {teamB.length < 5 && (
                <div className="text-center py-8 border-2 border-dashed border-red-400/30 rounded-2xl">
                  <Users className="w-12 h-12 text-red-400/50 mx-auto mb-2" />
                  <p className="text-on-dark-muted">
                    Select {5 - teamB.length} more player{5 - teamB.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Available Players */}
      <div className="floating-card mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center justify-center">
              <Icon name="goal" size={20} className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-on-dark font-poppins">Available Players</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {availablePlayers.map((player) => (
              <div key={player.id} className="space-y-2 sm:space-y-3">
                <PlayerCard player={player} selectable />
                <div className="flex space-x-1.5 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayerSelect(player, 'A')}
                    disabled={teamA.length >= 5}
                    className="flex-1 bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Team A
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayerSelect(player, 'B')}
                    disabled={teamB.length >= 5}
                    className="flex-1 bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Team B
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {availablePlayers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-on-dark-subtle mx-auto mb-4" />
              <p className="text-on-dark-muted text-lg">All players have been assigned to teams</p>
            </div>
          )}
        </div>
      </div>

      {/* Goals & Assists Section */}
      {(teamA.length === 5 && teamB.length === 5) && (
        <>
          <div className="floating-card mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 flex items-center justify-center">
                    <Icon name="trophy" size={20} className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-on-dark font-poppins">Goals & Assists</h3>
                </div>
                <div className="text-on-dark-muted text-sm">
                  Team A: {teamAGoals} | Team B: {teamBGoals}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  onClick={() => addGoal('A')}
                  className="bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team A Goal
                </Button>
                <Button
                  onClick={() => addGoal('B')}
                  className="bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/50"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team B Goal
                </Button>
              </div>

              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div key={index} className="floating-card border border-white/10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className={`font-medium ${goal.team === 'A' ? 'text-blue-300' : 'text-red-300'}`}>
                          Goal {index + 1} - Team {goal.team}
                        </h4>
                        <Button
                          onClick={() => removeGoal(index)}
                          variant="destructive"
                          size="sm"
                          className="rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`own-goal-${index}`}
                            checked={goal.isOwnGoal || false}
                            onCheckedChange={(checked) => updateGoal(index, 'isOwnGoal', checked as boolean)}
                            className="border-orange-400/50 data-[state=checked]:bg-orange-500"
                          />
                          <Label htmlFor={`own-goal-${index}`} className="text-orange-300 text-sm">
                            Own Goal
                          </Label>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-on-dark-muted">Scorer *</Label>
                            <Select
                              value={goal.scorer}
                              onValueChange={(value) => updateGoal(index, 'scorer', value)}
                            >
                              <SelectTrigger className="bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-purple-400">
                                <SelectValue placeholder="Select scorer" />
                              </SelectTrigger>
                              <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                                {(goal.isOwnGoal ? getOpposingTeamPlayers(goal.team) : getTeamPlayers(goal.team)).map((player) => (
                                  <SelectItem key={player.id} value={player.id} className="text-on-dark hover:bg-white/10">
                                    {player.name} {goal.isOwnGoal && '(Own Goal)'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-on-dark-muted">Assister (Optional)</Label>
                            <Select
                              value={goal.assister || 'no-assist'}
                              onValueChange={(value) => updateGoal(index, 'assister', value)}
                              disabled={goal.isOwnGoal}
                            >
                              <SelectTrigger className="bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-purple-400">
                                <SelectValue placeholder="Select assister" />
                              </SelectTrigger>
                              <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                                <SelectItem value="no-assist" className="text-on-dark hover:bg-white/10">No assist</SelectItem>
                                {getTeamPlayers(goal.team)
                                  .filter(p => p.id !== goal.scorer)
                                  .map((player) => (
                                    <SelectItem key={player.id} value={player.id} className="text-on-dark hover:bg-white/10">
                                      {player.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saves Section */}
          <div className="floating-card mb-8">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30 flex items-center justify-center">
                  <Icon name="wall-goalkeeper" size={20} className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-on-dark font-poppins">Saves</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-blue-300 mb-4 text-lg">Team A Players</h4>
                  <div className="space-y-4">
                    {teamA.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                        <div>
                          <div className="font-medium text-on-dark">{player.name}</div>
                          <div className="text-sm text-on-dark-muted">{player.position}</div>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            value={saves[player.id] || 0}
                            onChange={(e) => updateSaves(player.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-10 bg-white/10 border border-white/20 rounded-lg text-on-dark text-center focus:border-purple-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-red-300 mb-4 text-lg">Team B Players</h4>
                  <div className="space-y-4">
                    {teamB.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                        <div>
                          <div className="font-medium text-on-dark">{player.name}</div>
                          <div className="text-sm text-on-dark-muted">{player.position}</div>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            value={saves[player.id] || 0}
                            onChange={(e) => updateSaves(player.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-10 bg-white/10 border border-white/20 rounded-lg text-on-dark text-center focus:border-purple-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Create Match Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleCreateMatch}
          disabled={!matchDate || teamA.length !== 5 || teamB.length !== 5}
          size="lg"
          className="px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25"
        >
          <Save className="w-6 h-6 mr-3" />
          Create Match
        </Button>
      </div>
    </div>
  );
};

export default MatchCreation;
