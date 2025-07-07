
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PlayerCard from './PlayerCard';
import { Player, Match, Goal } from '@/types/football';

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
    setGoals([...goals, { scorer: '', assister: '', team, isOwnGoal: false }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | boolean) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
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
        return g.team !== team; // Own goals count for the opposing team
      }
      return g.team === team && g.scorer;
    }).length;
  };

  const handleCreateMatch = () => {
    if (matchDate && teamA.length === 5 && teamB.length === 5) {
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Match</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Match Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Match Date</Label>
              <Input
                id="date"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Team A Score</Label>
                <div className="text-2xl font-bold text-blue-600">{teamAGoals}</div>
              </div>
              <div>
                <Label>Team B Score</Label>
                <div className="text-2xl font-bold text-red-600">{teamBGoals}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Team A ({teamA.length}/5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamA.map((player) => (
              <div key={player.id} className="relative">
                <PlayerCard 
                  player={player} 
                  onClick={() => handlePlayerRemove(player, 'A')}
                />
              </div>
            ))}
            {teamA.length < 5 && (
              <p className="text-sm text-muted-foreground">
                Select {5 - teamA.length} more player{5 - teamA.length !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Team B ({teamB.length}/5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamB.map((player) => (
              <div key={player.id} className="relative">
                <PlayerCard 
                  player={player} 
                  onClick={() => handlePlayerRemove(player, 'B')}
                />
              </div>
            ))}
            {teamB.length < 5 && (
              <p className="text-sm text-muted-foreground">
                Select {5 - teamB.length} more player{5 - teamB.length !== 1 ? 's' : ''}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlayers.map((player) => (
              <div key={player.id} className="space-y-2">
                <PlayerCard player={player} selectable />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayerSelect(player, 'A')}
                    disabled={teamA.length >= 5}
                    className="flex-1 text-blue-600 hover:bg-blue-50"
                  >
                    Team A
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePlayerSelect(player, 'B')}
                    disabled={teamB.length >= 5}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    Team B
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {availablePlayers.length === 0 && (
            <p className="text-center text-muted-foreground">All players have been assigned to teams</p>
          )}
        </CardContent>
      </Card>

      {(teamA.length === 5 && teamB.length === 5) && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Goals & Assists
                <div className="text-sm text-muted-foreground">
                  Team A: {teamAGoals} | Team B: {teamBGoals}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={() => addGoal('A')}
                  variant="outline"
                  className="text-blue-600 hover:bg-blue-50"
                >
                  Add Team A Goal
                </Button>
                <Button
                  onClick={() => addGoal('B')}
                  variant="outline"
                  className="text-red-600 hover:bg-red-50"
                >
                  Add Team B Goal
                </Button>
              </div>

              {goals.map((goal, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`font-medium ${goal.team === 'A' ? 'text-blue-600' : 'text-red-600'}`}>
                      Goal {index + 1} - Team {goal.team}
                    </h4>
                    <Button
                      onClick={() => removeGoal(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`own-goal-${index}`}
                        checked={goal.isOwnGoal || false}
                        onCheckedChange={(checked) => updateGoal(index, 'isOwnGoal', checked as boolean)}
                      />
                      <Label htmlFor={`own-goal-${index}`} className="text-sm text-orange-600">
                        Own Goal
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Scorer *</Label>
                        <Select
                          value={goal.scorer}
                          onValueChange={(value) => updateGoal(index, 'scorer', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scorer" />
                          </SelectTrigger>
                          <SelectContent>
                            {(goal.isOwnGoal ? getOpposingTeamPlayers(goal.team) : getTeamPlayers(goal.team)).map((player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name} {goal.isOwnGoal && '(Own Goal)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Assister (Optional)</Label>
                        <Select
                          value={goal.assister || ''}
                          onValueChange={(value) => updateGoal(index, 'assister', value)}
                          disabled={goal.isOwnGoal}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select assister" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No assist</SelectItem>
                            {getTeamPlayers(goal.team)
                              .filter(p => p.id !== goal.scorer)
                              .map((player) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-600 mb-3">Team A Players</h4>
                  <div className="space-y-3">
                    {teamA.map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.position}</div>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            value={saves[player.id] || 0}
                            onChange={(e) => updateSaves(player.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-3">Team B Players</h4>
                  <div className="space-y-3">
                    {teamB.map((player) => (
                      <div key={player.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">{player.position}</div>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            value={saves[player.id] || 0}
                            onChange={(e) => updateSaves(player.id, parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleCreateMatch}
          disabled={!matchDate || teamA.length !== 5 || teamB.length !== 5}
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Create Match
        </Button>
      </div>
    </div>
  );
};

export default MatchCreation;
