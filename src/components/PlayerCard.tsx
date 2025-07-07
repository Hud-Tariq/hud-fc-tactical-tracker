
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Player } from '@/types/football';

interface PlayerCardProps {
  player: Player;
  onClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

const PlayerCard = ({ player, onClick, selectable = false, selected = false }: PlayerCardProps) => {
  const getPositionColor = (position: string) => {
    switch (position) {
      case 'Goalkeeper': return 'bg-yellow-500';
      case 'Defender': return 'bg-red-500';
      case 'Midfielder': return 'bg-teal-600';
      case 'Forward': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-teal-600';
    if (rating >= 70) return 'text-blue-500';
    if (rating >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selected ? 'ring-2 ring-teal-600' : ''
      } ${selectable ? 'hover:ring-1 hover:ring-teal-300' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{player.name}</h3>
          <div className={`text-2xl font-bold ${getRatingColor(player.rating)}`}>
            {player.rating}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Badge className={`${getPositionColor(player.position)} text-white`}>
              {player.position}
            </Badge>
            <p className="text-sm text-muted-foreground">Age: {player.age}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Matches: {player.matchesPlayed}</p>
            <p>Goals: {player.totalGoals}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
