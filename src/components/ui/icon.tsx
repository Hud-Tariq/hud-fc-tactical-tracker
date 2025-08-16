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
  'attacker': '/assets/icons/attacker.svg',
  'create-match': '/assets/icons/creatematch_topnavbar.svg',
  'defender': '/assets/icons/defender.svg',
  'forwards': '/assets/icons/forwards.svg',
  'goal': '/assets/icons/goal.svg',
  'goalkeeper': '/assets/icons/goalkeeper.svg',
  'lightning-forward': '/assets/icons/lightning_forward.svg',
  'midfielder': '/assets/icons/midfielder_brain.svg',
  'midfielder-brain': '/assets/icons/midfielder_brain.svg',
  'shield-defender': '/assets/icons/shield_defender.svg',
  'squad': '/assets/icons/squad_topnavbar.svg',
  'statistics': '/assets/icons/statistics.svg',
  'team-tournament': '/assets/icons/team_tournament.svg',
  'tournament-everywhere': '/assets/icons/tournament_everywhere.svg',
  'trophy': '/assets/icons/trophy.svg',
  'wall-goalkeeper': '/assets/icons/wall_goalie.svg',
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
