
export interface Player {
  id: string;
  name: string;
  age: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  rating: number;
  matchesPlayed: number;
  totalGoals: number;
  totalAssists: number;
  totalSaves: number;
  cleanSheets: number;
}

export interface Goal {
  scorer: string;
  assister?: string;
  team: 'A' | 'B';
}

export interface Match {
  id: string;
  date: string;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  goals: Goal[];
  saves: Record<string, number>;
  completed: boolean;
}

export interface MatchEvent {
  type: 'goal' | 'assist' | 'save' | 'clean_sheet';
  playerId: string;
  value: number;
}
