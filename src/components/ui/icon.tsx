import React from 'react';
import { cn } from '@/lib/utils';

export type IconName =
  | 'attacker'
  | 'create-match'
  | 'defender'
  | 'forwards'
  | 'goal'
  | 'goalkeeper'
  | 'lightning-forward'
  | 'midfielder'
  | 'midfielder-brain'
  | 'shield-defender'
  | 'squad'
  | 'statistics'
  | 'team-tournament'
  | 'tournament-everywhere'
  | 'trophy'
  | 'wall-goalkeeper';

const iconPaths: Record<IconName, string> = {
  'attacker': '/src/assets/icons/attacker.svg',
  'create-match': '/src/assets/icons/creatematch_topnavbar.svg',
  'defender': '/src/assets/icons/defender.svg',
  'forwards': '/src/assets/icons/forwards.svg',
  'goal': '/src/assets/icons/goal.svg',
  'goalkeeper': '/src/assets/icons/goalkeeper.svg',
  'lightning-forward': '/src/assets/icons/lightning_forward.svg',
  'midfielder': '/src/assets/icons/midfielder_brain.svg',
  'statistics': '/src/assets/icons/statistics.svg',
  'wall-goalkeeper': '/src/assets/icons/wall_goalie.svg',
  'shield-defender': '/src/assets/icons/shield_defender.svg',
  'squad': '/src/assets/icons/squad_topnavbar.svg',
  'statistics': '/src/assets/icons/statistics.svg',
  'team-tournament': '/src/assets/icons/team_tournament.svg',
  'tournament-everywhere': '/src/assets/icons/tournament_everywhere.svg',
  'trophy': '/src/assets/icons/trophy.svg',
  'wall-goalie': '/src/assets/icons/wall_goalie.svg',
};

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  alt?: string;
}

export function Icon({ name, size = 24, className, alt }: IconProps) {
  return (
    <img
      src={iconPaths[name]}
      alt={alt || name}
      width={size}
      height={size}
      className={cn("inline-block", className)}
    />
  );
}

// Icon mapping for replacing lucide-react icons
export const IconMap = {
  Trophy: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="trophy" size={size} className={className} />
  ),
  Shield: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="defender" size={size} className={className} />
  ),
  Zap: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="midfielder" size={size} className={className} />
  ),
  Goal: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="goal" size={size} className={className} />
  ),
  Target: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="goal" size={size} className={className} />
  ),
  BarChart3: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="statistics" size={size} className={className} />
  ),
  Award: ({ size, className }: { size?: number; className?: string }) => (
    <Icon name="trophy" size={size} className={className} />
  ),
} as const;
