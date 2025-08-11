import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Target, TrendingUp, Award, Shield, Zap, Star } from 'lucide-react';
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
    'Goalkeeper': 'from-yellow-400 via-orange-400 to-red-400',
    'Defender': 'from-blue-400 via-cyan-400 to-teal-400', 
    'Midfielder': 'from-green-400 via-emerald-400 to-lime-400',
    'Forward': 'from-red-400 via-pink-400 to-purple-400'
  };

  const positionIcons = {
    'Goalkeeper': Shield,
    'Defender': Users,
    'Midfielder': TrendingUp,
    'Forward': Zap
  };

  return (
    <div className="floating-section">
      {/* Hero Header */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-pink-400/30 mb-4">
          <Users className="w-5 h-5 mr-2 text-pink-400" />
          <span className="text-on-dark-muted font-medium">Squad Management</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Your Elite
          <span className="gradient-text-light ml-3">Squad</span>
        </h1>
        <p className="text-lg lg:text-2xl text-on-dark-muted max-w-3xl mx-auto">
          Manage your team of {players.length} players and build the perfect formation
        </p>
      </div>

      {/* Squad Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-8 lg:mb-16">
        {[
          { icon: Users, label: 'Total Players', value: squadStats.totalPlayers, color: 'text-blue-400' },
          { icon: Target, label: 'Avg Rating', value: squadStats.averageRating, color: 'text-purple-400' },
          { icon: Award, label: 'Total Goals', value: squadStats.totalGoals, color: 'text-green-400' },
          { icon: TrendingUp, label: 'Matches Played', value: squadStats.totalMatches, color: 'text-pink-400' }
        ].map((stat, index) => (
          <div key={stat.label} className={`floating-card animate-fade-in animate-stagger-${index + 1}`}>
            <div className="p-4 lg:p-8 text-center">
              <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color}`} />
              </div>
              <p className="text-2xl lg:text-4xl font-bold text-on-dark mb-1 lg:mb-3">{stat.value}</p>
              <p className="text-on-dark-muted text-xs lg:text-base">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Player Button */}
      <div className="flex justify-center mb-8 lg:mb-16">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="px-6 lg:px-12 py-3 lg:py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-pink-500/25 text-sm lg:text-lg"
            >
              <Plus className="w-4 h-4 lg:w-6 lg:h-6 mr-2" />
              Add New Player
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card-strong border-white/20 text-on-dark rounded-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-on-dark font-poppins">Add New Player</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-on-dark-muted">Player Name</Label>
                <Input
                  id="name"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter player name"
                  className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-on-dark-muted">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    max="45"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Age"
                    className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="text-on-dark-muted">Position</Label>
                  <Select onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                      <SelectItem value="Goalkeeper" className="text-on-dark hover:bg-white/10">Goalkeeper</SelectItem>
                      <SelectItem value="Defender" className="text-on-dark hover:bg-white/10">Defender</SelectItem>
                      <SelectItem value="Midfielder" className="text-on-dark hover:bg-white/10">Midfielder</SelectItem>
                      <SelectItem value="Forward" className="text-on-dark hover:bg-white/10">Forward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="rating" className="text-on-dark-muted">Initial Rating</Label>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold gradient-text-light">{newPlayer.rating}</span>
                  </div>
                </div>
                <Input
                  id="rating"
                  type="range"
                  min="1"
                  max="100"
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-on-dark-subtle">
                  <span>Poor (1)</span>
                  <span>Average (50)</span>
                  <span>Excellent (100)</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Add Player to Squad
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Squad by Position */}
      {players.length === 0 ? (
        <div className="floating-card text-center py-16">
          <div className="space-y-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/20">
              <Users className="w-16 h-16 text-on-dark-subtle" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-on-dark font-poppins">No Players Yet</h3>
              <p className="text-on-dark-muted text-lg max-w-md mx-auto">
                Start building your squad by adding your first player to the team
              </p>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Player
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orderedPositions.map((position, positionIndex) => {
            const PositionIcon = positionIcons[position as keyof typeof positionIcons];
            const colorClass = positionColors[position as keyof typeof positionColors];
            
            return (
              <div key={position} className={`floating-card animate-fade-in animate-stagger-${positionIndex + 1}`}>
                <div className="overflow-hidden rounded-2xl">
                  <div className={`bg-gradient-to-r ${colorClass} p-6`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                        <PositionIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white font-poppins">{position}</h3>
                        <p className="text-white/80">
                          {groupedPlayers[position].length} player{groupedPlayers[position].length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 lg:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                      {groupedPlayers[position].map((player, playerIndex) => (
                        <div key={player.id} className={`animate-fade-in animate-stagger-${playerIndex + 1}`}>
                          <PlayerCard player={player} onClick={() => onPlayerClick(player)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SquadManagement;
