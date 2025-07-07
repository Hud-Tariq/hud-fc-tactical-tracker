
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import PlayerCard from './PlayerCard';
import { Player } from '@/types/football';

interface SquadManagementProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id' | 'matchesPlayed' | 'totalGoals' | 'totalAssists' | 'totalSaves' | 'cleanSheets'>) => void;
  onPlayerClick: (player: Player) => void;
}

const SquadManagement = ({ players, onAddPlayer, onPlayerClick }: SquadManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    age: '',
    position: '',
    rating: 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.name && newPlayer.age && newPlayer.position) {
      onAddPlayer({
        name: newPlayer.name,
        age: parseInt(newPlayer.age),
        position: newPlayer.position as any,
        rating: newPlayer.rating
      });
      setNewPlayer({ name: '', age: '', position: '', rating: 50 });
      setIsDialogOpen(false);
    }
  };

  const groupedPlayers = players.reduce((groups, player) => {
    const position = player.position;
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(player);
    return groups;
  }, {} as Record<string, Player[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Squad Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Player</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Player name"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPlayer.age}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Player age"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="Defender">Defender</SelectItem>
                    <SelectItem value="Midfielder">Midfielder</SelectItem>
                    <SelectItem value="Forward">Forward</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rating">Initial Rating: {newPlayer.rating}</Label>
                <Input
                  id="rating"
                  type="range"
                  min="1"
                  max="100"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">Add Player</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
        <Card key={position}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {position}s
              <span className="text-sm font-normal text-muted-foreground">
                {positionPlayers.length} players
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positionPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onClick={() => onPlayerClick(player)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {players.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No players registered yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first player to get started with Hud FC
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SquadManagement;
