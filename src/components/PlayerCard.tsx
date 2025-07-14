
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Player } from '@/types/football';
import { Target, Users, TrendingUp, Award } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onClick?: (player: Player) => void;
  selectable?: boolean;
  selected?: boolean;
}

const PlayerCard = ({ player, onClick, selectable = false, selected = false }: PlayerCardProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 85) return 'bg-emerald-500 text-white';
    if (rating >= 75) return 'bg-blue-500 text-white';
    if (rating >= 65) return 'bg-yellow-500 text-black';
    if (rating >= 55) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
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
      case 'Goalkeeper': return Target;
      case 'Defender': return Users;
      case 'Midfielder': return TrendingUp;
      case 'Forward': return Award;
      default: return Users;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Defender': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Midfielder': return 'bg-green-100 text-green-800 border-green-200';
      case 'Forward': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const PositionIcon = getPositionIcon(player.position);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border hover:border-primary/20 group ${
        selected ? 'ring-2 ring-primary shadow-lg' : ''
      } ${selectable ? 'hover:ring-1 hover:ring-primary/50' : ''}`}
      onClick={() => onClick?.(player)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPositionColor(player.position).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
              <PositionIcon className="w-4 h-4" />
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs font-medium ${getPositionColor(player.position)}`}
            >
              {player.position}
            </Badge>
          </div>
          <Badge className={`${getRatingColor(player.rating)} text-xs font-bold px-2`}>
            {player.rating}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
            {player.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Age {player.age} • {getRatingLabel(player.rating)}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="text-center">
              <p className="font-semibold text-foreground">{player.matchesPlayed}</p>
              <p className="text-muted-foreground">Matches</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{player.totalGoals}</p>
              <p className="text-muted-foreground">Goals</p>
            </div>
          </div>
        </div>

        {player.averageMatchRating > 0 && (
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Avg Performance</span>
              <span className="font-semibold">{player.averageMatchRating.toFixed(1)}/10</span>
            </div>
            <div className="mt-1 w-full bg-muted rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(player.averageMatchRating / 10) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
