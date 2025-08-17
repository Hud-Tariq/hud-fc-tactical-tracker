import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, TrendingUp, Star, ChevronRight, Share, MoreHorizontal, Filter, Search, ArrowLeft, ArrowRight } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isPlayerDetailOpen, setIsPlayerDetailOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
    'Goalkeeper': { bg: 'from-yellow-400 to-orange-500', accent: 'yellow-400' },
    'Defender': { bg: 'from-blue-400 to-cyan-500', accent: 'blue-400' }, 
    'Midfielder': { bg: 'from-green-400 to-emerald-500', accent: 'green-400' },
    'Forward': { bg: 'from-red-400 to-pink-500', accent: 'red-400' }
  };

  const positionIcons: Record<string, IconName> = {
    'Goalkeeper': 'goalkeeper',
    'Defender': 'defender',
    'Midfielder': 'midfielder',
    'Forward': 'attacker'
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailOpen(true);
    onPlayerClick(player);
  };

  // Filter players based on search and position
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'all' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  // Update grouped players to use filtered players
  const filteredGroupedPlayers = filteredPlayers.reduce((groups, player) => {
    const position = player.position;
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(player);
    return groups;
  }, {} as Record<string, Player[]>);

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    }
  };

  // Desktop Layout (unchanged)
  const DesktopLayout = () => (
    <div className="floating-section">
      {/* Desktop content remains the same as original */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-pink-400/30 mb-4">
          <Users className="w-5 h-5 mr-2 text-pink-400" />
          <span className="text-on-dark-muted font-medium">Squad Management</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Your
          <span className="gradient-text-light ml-3">Squad</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl text-on-dark-muted max-w-none sm:max-w-3xl mx-auto px-2 sm:px-0">
          Manage your team of {players.length} players and build the perfect formation
        </p>
      </div>

      {/* Desktop stats and content remain the same */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mb-6 sm:mb-8 lg:mb-16">
        {[
          { icon: Users, label: 'Total Players', value: squadStats.totalPlayers, color: 'text-blue-400', isCustom: false },
          { icon: 'statistics', label: 'Avg Rating', value: squadStats.averageRating, color: 'text-purple-400', isCustom: true },
          { icon: 'goal', label: 'Total Goals', value: squadStats.totalGoals, color: 'text-green-400', isCustom: true },
          { icon: TrendingUp, label: 'Matches Played', value: squadStats.totalMatches, color: 'text-pink-400', isCustom: false }
        ].map((stat, index) => (
          <div key={stat.label} className={`floating-card animate-fade-in animate-stagger-${index + 1}`}>
            <div className="p-3 sm:p-4 lg:p-8 text-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 lg:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                {stat.isCustom ? (
                  <Icon name={stat.icon as any} size={24} className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color}`} />
                ) : (
                  React.createElement(stat.icon as any, { className: `w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${stat.color}` })
                )}
              </div>
              <p className="text-xl sm:text-2xl lg:text-4xl font-bold text-on-dark mb-1 lg:mb-3">{stat.value}</p>
              <p className="text-on-dark-muted text-xs sm:text-sm lg:text-base">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-6 sm:mb-8 lg:mb-16">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="px-4 sm:px-6 lg:px-12 py-2.5 sm:py-3 lg:py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-pink-500/25 text-sm lg:text-lg"
            >
              <Plus className="w-4 h-4 lg:w-6 lg:h-6 mr-2" />
              Add New Player
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card-strong border-white/20 text-on-dark rounded-2xl max-w-md">
            <DesktopAddPlayerForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop player list */}
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
            const positionIconName = positionIcons[position as keyof typeof positionIcons];
            const colorClass = positionColors[position as keyof typeof positionColors]?.bg || 'from-gray-400 to-gray-500';
            
            return (
              <div key={position} className={`floating-card animate-fade-in animate-stagger-${positionIndex + 1}`}>
                <div className="overflow-hidden rounded-2xl">
                  <div className={`bg-gradient-to-r ${colorClass} p-6`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                        <Icon name={positionIconName} size={28} className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white font-poppins">{position}</h3>
                        <p className="text-white/80">
                          {groupedPlayers[position].length} player{groupedPlayers[position].length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 lg:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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

  const DesktopAddPlayerForm = () => (
    <>
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
    </>
  );

  // Mobile Layout - Completely Different Design
  const MobileLayout = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
      {/* Mobile Status Bar */}
      <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
      
      {/* Mobile Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white font-poppins">Squad</h1>
            <p className="text-white/60 text-sm">
              {searchQuery || positionFilter !== 'all'
                ? `${filteredPlayers.length} of ${players.length} players`
                : `${players.length} players`
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFilterOpen ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search players by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-4 p-4 bg-white/10 rounded-xl border border-white/20 animate-in slide-in-from-top-2 duration-300">
            <h3 className="text-white font-medium mb-3">Filter by Position</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPositionFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  positionFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                All ({players.length})
              </button>
              {positionOrder.map(position => {
                const count = groupedPlayers[position]?.length || 0;
                if (count === 0) return null;
                return (
                  <button
                    key={position}
                    onClick={() => setPositionFilter(position)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      positionFilter === position
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {position} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Quick Stats */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { label: 'Players', value: squadStats.totalPlayers, icon: Users, color: 'bg-blue-500' },
            { label: 'Rating', value: squadStats.averageRating, icon: Star, color: 'bg-purple-500' },
            { label: 'Goals', value: squadStats.totalGoals, icon: 'goal', color: 'bg-green-500', isCustom: true },
            { label: 'Matches', value: squadStats.totalMatches, icon: TrendingUp, color: 'bg-pink-500' }
          ].map((stat, index) => (
            <div key={stat.label} className={`flex-shrink-0 ${stat.color} rounded-xl p-3 min-w-[80px]`}>
              <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mb-2">
                {stat.isCustom ? (
                  <Icon name={stat.icon as any} size={16} className="w-4 h-4 text-white" />
                ) : (
                  React.createElement(stat.icon as any, { className: "w-4 h-4 text-white" })
                )}
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-white/80 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mobile Position Stories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Positions</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {orderedPositions.map((position) => {
              const positionColor = positionColors[position as keyof typeof positionColors];
              const positionIconName = positionIcons[position as keyof typeof positionIcons];
              const isSelected = selectedPosition === position;
              
              return (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(selectedPosition === position ? null : position)}
                  className={`flex-shrink-0 relative ${isSelected ? 'ring-2 ring-white' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${positionColor?.bg} flex items-center justify-center border-2 ${isSelected ? 'border-white' : 'border-white/20'}`}>
                    <Icon name={positionIconName} size={20} className="w-5 h-5 text-white" />
                  </div>
                  <div className="mt-1 text-center">
                    <p className="text-white text-xs font-medium">{position.slice(0, 3)}</p>
                    <p className="text-white/60 text-xs">{groupedPlayers[position]?.length || 0}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Player Cards - TikTok Style */}
      <div className="flex-1">
        {filteredPlayers.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <Users className="w-12 h-12 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Players Yet</h3>
            <p className="text-white/60 mb-6">Tap the + button to add your first player</p>
          </div>
        ) : (
          <div className="px-4 space-y-4">
            {(selectedPosition ? groupedPlayers[selectedPosition] || [] : players).map((player, index) => (
              <MobileTikTokPlayerCard 
                key={player.id} 
                player={player} 
                onClick={() => handlePlayerSelect(player)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>


      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-4 w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-xl shadow-primary/30 z-50 hover:scale-110 transition-all duration-300 border-2 border-white/20"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* Mobile Add Player Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white rounded-t-3xl rounded-b-none fixed bottom-0 left-0 right-0 max-w-none w-full z-[100] data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full max-h-[90vh] overflow-y-auto transform translate-x-0 translate-y-0">
          <MobileAddPlayerForm />
        </DialogContent>
      </Dialog>

      {/* Mobile Player Detail Modal */}
      <Dialog open={isPlayerDetailOpen} onOpenChange={setIsPlayerDetailOpen}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/20 text-white rounded-3xl fixed left-4 right-4 top-1/2 -translate-y-1/2 max-w-none w-auto z-[100] data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-h-[80vh] overflow-y-auto transform translate-x-0">
          {selectedPlayer && <MobilePlayerDetail player={selectedPlayer} />}
        </DialogContent>
      </Dialog>
    </div>
  );

  const MobileAddPlayerForm = () => (
    <div className="p-6">
      <DialogHeader>
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-2xl font-bold text-white">Add Player</DialogTitle>
          <button onClick={() => setIsDialogOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white rotate-45" />
          </button>
        </div>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-white/80 text-sm mb-2 block">Player Name</Label>
          <Input
            value={newPlayer.name}
            onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter player name"
            className="h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white/80 text-sm mb-2 block">Age</Label>
            <Input
              type="number"
              min="16"
              max="45"
              value={newPlayer.age}
              onChange={(e) => setNewPlayer(prev => ({ ...prev, age: e.target.value }))}
              placeholder="Age"
              className="h-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50"
            />
          </div>

          <div>
            <Label className="text-white/80 text-sm mb-2 block">Position</Label>
            <Select onValueChange={(value) => setNewPlayer(prev => ({ ...prev, position: value }))}>
              <SelectTrigger className="h-12 bg-white/10 border border-white/20 rounded-xl text-white">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20 rounded-xl">
                <SelectItem value="Goalkeeper" className="text-white hover:bg-white/10">Goalkeeper</SelectItem>
                <SelectItem value="Defender" className="text-white hover:bg-white/10">Defender</SelectItem>
                <SelectItem value="Midfielder" className="text-white hover:bg-white/10">Midfielder</SelectItem>
                <SelectItem value="Forward" className="text-white hover:bg-white/10">Forward</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <Label className="text-white/80 text-sm">Rating</Label>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-xl font-bold text-white">{newPlayer.rating}</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={newPlayer.rating}
            onChange={(e) => setNewPlayer(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl mt-6"
        >
          Add Player
        </Button>
      </form>
    </div>
  );

  const MobileTikTokPlayerCard = ({ player, onClick, index }: { player: Player; onClick: () => void; index: number }) => {
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

    return (
      <div 
        className="relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        onClick={onClick}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        
        <div className="relative p-4">
          <div className="flex items-center space-x-4">
            {/* Player Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white/20 flex items-center justify-center">
                <Icon name={getPositionIcon(player.position)} size={24} className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${getRatingColor(player.rating)} px-2 py-1 rounded-full`}>
                <span className="text-white text-xs font-bold">{player.rating}</span>
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{player.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-white/60 mb-2">
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.age} years</span>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="goal" size={14} className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white font-medium">{player.totalGoals}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="lightning-forward" size={14} className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-white font-medium">{player.matchesPlayed}</span>
                </div>
                {player.averageMatchRating > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-white font-medium">{player.averageMatchRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center">
              <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors duration-200">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Performance Bar */}
          {player.averageMatchRating > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/60">Performance</span>
                <span className="text-white font-medium">{player.averageMatchRating.toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(player.averageMatchRating / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MobilePlayerDetail = ({ player }: { player: Player }) => (
    <div className="p-6">
      <DialogHeader>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setIsPlayerDetailOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <DialogTitle className="text-xl font-bold text-white">{player.name}</DialogTitle>
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Share className="w-5 h-5 text-white" />
          </button>
        </div>
      </DialogHeader>

      <div className="text-center mb-6">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-white/20 flex items-center justify-center mb-4">
          <Icon name={positionIcons[player.position as keyof typeof positionIcons]} size={32} className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{player.name}</h3>
        <p className="text-white/60">{player.position} • {player.age} years old</p>
      </div>

      {/* Detailed stats */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{player.rating}</p>
            <p className="text-white/60 text-sm">Overall Rating</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{player.averageMatchRating.toFixed(1)}</p>
            <p className="text-white/60 text-sm">Avg Performance</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{player.matchesPlayed}</p>
            <p className="text-white/60 text-xs">Matches</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{player.totalGoals}</p>
            <p className="text-white/60 text-xs">Goals</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-white">{player.totalAssists}</p>
            <p className="text-white/60 text-xs">Assists</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Show different layouts based on screen size */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </>
  );
};

export default SquadManagement;
