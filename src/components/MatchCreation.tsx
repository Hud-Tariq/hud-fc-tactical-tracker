
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlayerCard from './PlayerCard';
import { Player, Match } from '@/types/football';

interface MatchCreationProps {
  players: Player[];
  onCreateMatch: (match: Omit<Match, 'id'>) => void;
}

const MatchCreation = ({ players, onCreateMatch }: MatchCreationProps) => {
  const [matchDate, setMatchDate] = useState('');
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

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

  const handleCreateMatch = () => {
    if (matchDate && teamA.length === 5 && teamB.length === 5) {
      const match: Omit<Match, 'id'> = {
        date: matchDate,
        teamA: teamA.map(p => p.id),
        teamB: teamB.map(p => p.id),
        scoreA: teamAScore,
        scoreB: teamBScore,
        goals: [],
        saves: {},
        completed: true // Mark as completed since we're entering final scores
      };
      onCreateMatch(match);
      // Reset form
      setMatchDate('');
      setTeamA([]);
      setTeamB([]);
      setAvailablePlayers(players);
      setTeamAScore(0);
      setTeamBScore(0);
    }
  };

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
                <Label htmlFor="teamAScore">Team A Score</Label>
                <Input
                  id="teamAScore"
                  type="number"
                  min="0"
                  value={teamAScore}
                  onChange={(e) => setTeamAScore(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="teamBScore">Team B Score</Label>
                <Input
                  id="teamBScore"
                  type="number"
                  min="0"
                  value={teamBScore}
                  onChange={(e) => setTeamBScore(Number(e.target.value))}
                />
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
