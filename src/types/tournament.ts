import { Tables } from '../integrations/supabase/types';

export type Tournament = Tables<'tournaments'>;
export type TournamentTeam = Tables<'tournament_teams'>;
export type TournamentPlayer = Tables<'tournament_players'>;
export type TournamentMatch = Tables<'tournament_matches'>;
export type TournamentStage = Tables<'tournament_stages'>;
export type TournamentBracket = Tables<'tournament_brackets'>;
export type TournamentGoal = Tables<'tournament_match_goals'>;
export type TournamentSave = Tables<'tournament_match_saves'>;
export type TournamentSettings = Tables<'tournament_settings'>;
export type TournamentStandings = Tables<'tournament_standings'>;
export type Team = Tables<'teams'>;

export interface TournamentWithTeams extends Tournament {
  tournament_teams: (TournamentTeam & {
    teams: Team;
    tournament_players: TournamentPlayer[];
  })[];
  tournament_stages: TournamentStage[];
}

export interface TournamentMatchWithDetails extends TournamentMatch {
  team_a: TournamentTeam & { teams: Team };
  team_b: TournamentTeam & { teams: Team };
  tournament_match_goals: TournamentGoal[];
  tournament_match_saves: TournamentSave[];
  tournament_stages?: TournamentStage;
}

export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'league' | 'group_stage';
export type TournamentStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentVisibility = 'public' | 'private' | 'invite_only';
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';
export type PlayerRole = 'player' | 'coach' | 'captain' | 'substitute';
export type StageType = 'group' | 'knockout' | 'league';
export type GoalType = 'regular' | 'penalty' | 'free_kick' | 'corner' | 'own_goal';

export interface CreateTournamentRequest {
  name: string;
  description?: string;
  format: TournamentFormat;
  start_date?: string;
  end_date?: string;
  max_teams?: number;
  min_teams?: number;
  entry_fee?: number;
  prize_pool?: number;
  visibility: TournamentVisibility;
  rules_text?: string;
  match_duration?: number;
  extra_time_enabled?: boolean;
  penalty_shootouts_enabled?: boolean;
}

export interface TournamentFilters {
  status?: TournamentStatus;
  format?: TournamentFormat;
  visibility?: TournamentVisibility;
  created_by?: string;
}
