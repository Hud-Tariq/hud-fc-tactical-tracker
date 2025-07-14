import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Target, TrendingUp, Award } from 'lucide-react';
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
        rating: newPlayer.rating,
        averageMatchRating: 0,
        matchRatings: []
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

  const positionOrder = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  const orderedPositions = positionOrder.filter(position => groupedPlayers[position]);

  // Squad statistics
  const squadStats = {
    totalPlayers: players.length,
    averageRating: players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length) : 0,
    totalGoals: players.reduce((sum, p) => sum + p.totalGoals, 0),
    totalMatches: players.reduce((sum, p) => sum + p.matchesPlayed, 0)
  };

  const positionColors = {
    'Goalkeeper': 'from-yellow-500 to-orange-500',
    'Defender': 'from-blue-500 to-indigo-500', 
    'Midfielder': 'from-green-500 to-emerald-500',
    'Forward': 'from-red-500 to-pink-500'
  };

  const positionIcons = {
    'Goalkeeper': Target,
    'Defender': Users,
    'Midfielder': TrendingUp,
    'Forward': Award
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-display">Squad Management</h1>
          <p className="text-muted-foreground text-lg">
            Manage your team of {players.length} players
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 hover-lift">
              <Plus className="w-5 h-5" />
              Add New Player
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-title">Add New Player</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Player Name</Label>
                <Input
                  id="name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter player name"
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    max="45"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium">Position</Label>
                  <Select onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="Defender">Defender</SelectItem>
                      <SelectItem value="Midfielder">Midfielder</SelectItem>
                      <SelectItem value="Forward">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rating" className="text-sm font-medium">Initial Rating</Label>
                  <span className="text-2xl font-bold text-primary">{newPlayer.rating}</span>
                </div>
                <Input
                  id="rating"
                  type="range"
                  min="1"
                  max="100"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor (1)</span>
                  <span>Average (50)</span>
                  <span>Excellent (100)</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" size="lg">
                Add Player to Squad
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Squad Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <p className="text-2xl font-bold">{squadStats.totalPlayers}</p>
            <p className="text-caption">Total Players</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-lg">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <p className="text-2xl font-bold">{squadStats.averageRating}</p>
            <p className="text-caption">Avg Rating</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-success/10 rounded-lg">
              <Award className="w-6 h-6 text-success" />
            </div>
            <p className="text-2xl font-bold">{squadStats.totalGoals}</p>
            <p className="text-caption">Total Goals</p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-2xl font-bold">{squadStats.totalMatches}</p>
            <p className="text-caption">Matches Played</p>
          </CardContent>
        </Card>
      </div>

      {/* Squad by Position */}
      {players.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Users className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-title">No Players Yet</h3>
                <p className="text-muted-foreground">
                  Start building your squad by adding your first player
                </p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Player
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orderedPositions.map((position) => {
            const PositionIcon = positionIcons[position as keyof typeof positionIcons];
            const colorClass = positionColors[position as keyof typeof positionColors];
            
            return (
              <Card key={position} className="overflow-hidden hover-lift">
                <CardHeader className={`bg-gradient-to-r ${colorClass} text-white`}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <PositionIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xl">{position}</span>
                      <span className="text-white/80 text-sm ml-2">
                        ({groupedPlayers[position].length} player{groupedPlayers[position].length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {groupedPlayers[position].map((player) => (
                      <PlayerCard key={player.id} player={player} onClick={() => onPlayerClick(player)} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SquadManagement;