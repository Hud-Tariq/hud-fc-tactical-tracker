import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/football';
import { Icon } from '@/components/ui/icon';
import { Star } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onClick?: (player: Player) => void;
  selectable?: boolean;
  selected?: boolean;
}

const PlayerCard = ({ player, onClick, selectable = false, selected = false }: PlayerCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 85) return 'from-emerald-400 to-green-500';
    if (rating >= 75) return 'from-blue-400 to-cyan-500';
    if (rating >= 65) return 'from-yellow-400 to-orange-400';
    if (rating >= 55) return 'from-orange-400 to-red-400';
    return 'from-red-500 to-pink-500';
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 85) return 'Excellent';
    if (rating >= 75) return 'Very Good';
    if (rating >= 65) return 'Good';
    if (rating >= 55) return 'Average';
    return 'Needs Work';
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
      case 'Goalkeeper': return 'from-yellow-400/20 to-orange-400/20 border-yellow-400/30 text-yellow-300';
      case 'Defender': return 'from-blue-400/20 to-cyan-400/20 border-blue-400/30 text-blue-300';
      case 'Midfielder': return 'from-green-400/20 to-emerald-400/20 border-green-400/30 text-green-300';
      case 'Forward': return 'from-red-400/20 to-pink-400/20 border-red-400/30 text-red-300';
      default: return 'from-gray-400/20 to-gray-500/20 border-gray-400/30 text-gray-300';
    }
  };

  const positionIconName = getPositionIcon(player.position);

  return (
    <Card 
      className={`
        cursor-pointer transition-all duration-300 hover:scale-105 border border-white/10 group
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:from-white/10 hover:to-white/15
        ${selected ? 'ring-2 ring-pink-400/50 shadow-lg shadow-pink-500/25' : ''}
        ${selectable ? 'hover:ring-1 hover:ring-purple-400/50' : ''}
      `}
      onClick={() => onClick?.(player)}
    >
      <CardContent className="p-3 sm:p-4 lg:p-5">
        {/* Header with Position and Rating */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${getPositionColor(player.position)} border backdrop-blur`}>
              <Icon name={positionIconName} size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium bg-gradient-to-r ${getPositionColor(player.position)} border backdrop-blur px-2 sm:px-3 py-1 rounded-full`}
            >
              {player.position}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <Badge className={`bg-gradient-to-r ${getRatingColor(player.rating)} text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg`}>
              {player.rating}
            </Badge>
          </div>
        </div>

        {/* Player Info */}
        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-bold text-base sm:text-lg text-on-dark group-hover:gradient-text-light transition-all duration-300 font-poppins line-clamp-1">
            {player.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-dark-muted">
              Age {player.age}
            </p>
            <p className="text-sm text-on-dark-muted">
              {getRatingLabel(player.rating)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
              <p className="font-bold text-base sm:text-lg text-on-dark">{player.matchesPlayed}</p>
              <p className="text-xs text-on-dark-muted">Matches</p>
            </div>
            <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
              <p className="font-bold text-base sm:text-lg text-on-dark">{player.totalGoals}</p>
              <p className="text-xs text-on-dark-muted">Goals</p>
            </div>
          </div>
        </div>

        {/* Performance Rating */}
        {player.averageMatchRating > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-on-dark-muted">Performance</span>
              <span className="font-bold text-on-dark">{player.averageMatchRating.toFixed(1)}/10</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(player.averageMatchRating / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Additional stats for key positions */}
        {(player.totalAssists > 0 || player.totalSaves > 0) && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs">
              {player.totalAssists > 0 && (
                <div className="text-center">
                  <p className="font-semibold text-on-dark">{player.totalAssists}</p>
                  <p className="text-on-dark-muted">Assists</p>
                </div>
              )}
              {player.totalSaves > 0 && (
                <div className="text-center">
                  <p className="font-semibold text-on-dark">{player.totalSaves}</p>
                  <p className="text-on-dark-muted">Saves</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
