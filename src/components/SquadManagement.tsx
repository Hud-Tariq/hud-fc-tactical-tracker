import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Icon, IconName } from '@/components/ui/icon';
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

  const positionIcons: Record<string, IconName> = {
    'Goalkeeper': 'goalkeeper',
    'Defender': 'defender',
    'Midfielder': 'midfielder',
    'Forward': 'attacker'
  };

  return (
    <div className="min-h-screen">
      {/* Mobile-First Hero Section */}
      <div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
        {/* Header Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span className="text-primary font-medium text-sm">Squad Management</span>
          </div>
        </div>

        {/* Title - Mobile Optimized */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-3">
            Your
            <span className="gradient-text-light ml-2">Squad</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-on-dark-muted px-4">
            Manage your team of {players.length} players
          </p>
        </div>

        {/* Mobile-First Stats Grid - 2x2 on mobile, 4 in a row on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6">
          {[
            { icon: Users, label: 'Players', value: squadStats.totalPlayers, color: 'text-blue-400', bgColor: 'from-blue-400/10 to-blue-500/5' },
            { icon: 'statistics', label: 'Avg Rating', value: squadStats.averageRating, color: 'text-purple-400', bgColor: 'from-purple-400/10 to-purple-500/5', isCustom: true },
            { icon: 'goal', label: 'Goals', value: squadStats.totalGoals, color: 'text-green-400', bgColor: 'from-green-400/10 to-green-500/5', isCustom: true },
            { icon: TrendingUp, label: 'Matches', value: squadStats.totalMatches, color: 'text-pink-400', bgColor: 'from-pink-400/10 to-pink-500/5' }
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 text-center animate-fade-in hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl bg-white/10 border border-white/20">
                {stat.isCustom ? (
                  <Icon name={stat.icon as any} size={20} className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                ) : (
                  React.createElement(stat.icon as any, { className: `w-5 h-5 md:w-6 md:h-6 ${stat.color}` })
                )}
              </div>
              <p className="text-2xl md:text-3xl font-bold text-on-dark mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-on-dark-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Add Player Button - Full width on mobile */}
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full md:w-auto md:mx-auto md:flex h-12 md:h-14 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-lg text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Player
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card-strong border-white/20 text-on-dark rounded-2xl mx-4 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold text-on-dark font-poppins">Add New Player</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mt-4 md:mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-on-dark-muted text-sm">Player Name</Label>
                  <Input
                    id="name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter player name"
                    className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-on-dark-muted text-sm">Age</Label>
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
                    <Label htmlFor="position" className="text-on-dark-muted text-sm">Position</Label>
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

                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="rating" className="text-on-dark-muted text-sm">Initial Rating</Label>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-xl md:text-2xl font-bold gradient-text-light">{newPlayer.rating}</span>
                    </div>
                  </div>
                  <Input
                    id="rating"
                    type="range"
                    min="1"
                    max="100"
                    value={newPlayer.rating}
                    onChange={(e) => setNewPlayer(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-on-dark-subtle">
                    <span>Poor</span>
                    <span>Average</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Add Player to Squad
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Squad Content */}
      <div className="px-4 md:px-6 lg:px-8">
        {players.length === 0 ? (
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/20">
                <Users className="w-12 h-12 md:w-16 md:h-16 text-on-dark-subtle" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-on-dark font-poppins">No Players Yet</h3>
                <p className="text-on-dark-muted text-base md:text-lg max-w-sm mx-auto">
                  Start building your squad by adding your first player
                </p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Player
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8 pb-8">
            {orderedPositions.map((position, positionIndex) => {
              const positionIconName = positionIcons[position as keyof typeof positionIcons];
              const colorClass = positionColors[position as keyof typeof positionColors];
              
              return (
                <div 
                  key={position} 
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${positionIndex * 0.1}s` }}
                >
                  {/* Position Header - Mobile Optimized */}
                  <div className={`bg-gradient-to-r ${colorClass} p-4 md:p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                          <Icon name={positionIconName} size={24} className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white font-poppins">{position}</h3>
                          <p className="text-white/80 text-sm">
                            {groupedPlayers[position].length} player{groupedPlayers[position].length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/60" />
                    </div>
                  </div>

                  {/* Players Section - Mobile Stack Layout */}
                  <div className="p-4 md:p-6">
                    {/* Mobile: Single column stack for better readability */}
                    <div className="block md:hidden space-y-3">
                      {groupedPlayers[position].map((player, playerIndex) => (
                        <div 
                          key={player.id} 
                          className="animate-fade-in"
                          style={{ animationDelay: `${(positionIndex + playerIndex) * 0.1}s` }}
                        >
                          <MobilePlayerCard player={player} onClick={() => onPlayerClick(player)} />
                        </div>
                      ))}
                    </div>

                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                      {groupedPlayers[position].map((player, playerIndex) => (
                        <div 
                          key={player.id} 
                          className="animate-fade-in"
                          style={{ animationDelay: `${(positionIndex + playerIndex) * 0.1}s` }}
                        >
                          <PlayerCard player={player} onClick={() => onPlayerClick(player)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile-Optimized Player Card Component
const MobilePlayerCard = ({ player, onClick }: { player: Player; onClick?: (player: Player) => void }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 85) return 'from-emerald-400 to-green-500';
    if (rating >= 75) return 'from-blue-400 to-cyan-500';
    if (rating >= 65) return 'from-yellow-400 to-orange-400';
    if (rating >= 55) return 'from-orange-400 to-red-400';
    return 'from-red-500 to-pink-500';
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case 'Goalkeeper': return 'goalkeeper';
      case 'Defender': return 'defender';
      case 'Midfielder': return 'midfielder';
      case 'Forward': return 'forwards';
      default: return 'defender';
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper': return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30';
      case 'Defender': return 'from-blue-400/20 to-cyan-400/20 border-blue-400/30';
      case 'Midfielder': return 'from-green-400/20 to-emerald-400/20 border-green-400/30';
      case 'Forward': return 'from-red-400/20 to-pink-400/20 border-red-400/30';
      default: return 'from-gray-400/20 to-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <div 
      className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 active:scale-[0.98]"
      onClick={() => onClick?.(player)}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar and Rating */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPositionColor(player.position)} border flex items-center justify-center`}>
            <Icon name={getPositionIcon(player.position)} size={20} className="w-5 h-5 text-white" />
          </div>
          <div className={`absolute -top-1 -right-1 bg-gradient-to-r ${getRatingColor(player.rating)} text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg`}>
            {player.rating}
          </div>
        </div>

        {/* Player Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-on-dark font-poppins truncate mb-1">
            {player.name}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-on-dark-muted">
            <span>Age {player.age}</span>
            <span>•</span>
            <span>{player.position}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-right">
          <div className="flex items-center space-x-3 text-sm">
            <div className="text-center">
              <p className="font-bold text-on-dark">{player.matchesPlayed}</p>
              <p className="text-xs text-on-dark-muted">Matches</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-on-dark">{player.totalGoals}</p>
              <p className="text-xs text-on-dark-muted">Goals</p>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-on-dark-subtle" />
      </div>

      {/* Performance Bar */}
      {player.averageMatchRating > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-on-dark-muted">Performance</span>
            <span className="font-bold text-on-dark">{player.averageMatchRating.toFixed(1)}/10</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(player.averageMatchRating / 10) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SquadManagement;
