-- Enhanced Tournament Schema with improvements
-- Based on your excellent foundation

-- Core Tournaments (your original + enhancements)
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    format TEXT NOT NULL DEFAULT 'single_elimination', -- league, knockout, double_elim
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    max_teams INTEGER DEFAULT 16,
    min_teams INTEGER DEFAULT 2, -- Added: minimum teams needed
    entry_fee DECIMAL(10,2) DEFAULT 0, -- Added: for paid tournaments
    prize_pool DECIMAL(10,2) DEFAULT 0, -- Added: prize money
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')), -- Added: tournament lifecycle
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'invite_only')), -- Added: privacy control
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    -- Added: Additional customization options
    rules_text TEXT, -- Custom rules for the tournament
    match_duration INTEGER DEFAULT 90, -- Match duration in minutes
    extra_time_enabled BOOLEAN DEFAULT false,
    penalty_shootouts_enabled BOOLEAN DEFAULT true
);

-- Stages/Rounds (enhanced)
CREATE TABLE public.tournament_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    stage_type TEXT DEFAULT 'knockout' CHECK (stage_type IN ('group', 'knockout', 'league')), -- Added: stage type
    teams_advance INTEGER, -- Added: how many teams advance from this stage
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tournament_id, stage_order) -- Added: prevent duplicate stage orders
);

-- Teams master table (enhanced)
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT, -- Added: abbreviation (e.g., "MUN" for Manchester United)
    logo_url TEXT, -- Added: team logo
    home_color TEXT, -- Added: home kit color
    away_color TEXT, -- Added: away kit color
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    is_active BOOLEAN DEFAULT true -- Added: soft delete for teams
);

-- Teams participating in a tournament (enhanced)
CREATE TABLE public.tournament_teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    seed_number INTEGER, -- Added: seeding for tournaments
    group_name TEXT, -- Added: for group stage tournaments (Group A, B, etc.)
    points INTEGER DEFAULT 0, -- Added: for league-style tournaments
    goals_for INTEGER DEFAULT 0, -- Added: tournament stats
    goals_against INTEGER DEFAULT 0, -- Added: tournament stats
    matches_played INTEGER DEFAULT 0, -- Added: tournament stats
    matches_won INTEGER DEFAULT 0, -- Added: tournament stats
    matches_drawn INTEGER DEFAULT 0, -- Added: tournament stats
    matches_lost INTEGER DEFAULT 0, -- Added: tournament stats
    joined_at TIMESTAMPTZ DEFAULT now(),
    registration_status TEXT DEFAULT 'pending' CHECK (registration_status IN ('pending', 'approved', 'rejected')), -- Added: approval process
    UNIQUE(tournament_id, team_id)
);

-- Tournament roster (enhanced)
CREATE TABLE public.tournament_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_team_id UUID NOT NULL REFERENCES public.tournament_teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    jersey_number INTEGER, -- Added: player number for the tournament
    role TEXT DEFAULT 'player' CHECK (role IN ('player', 'coach', 'captain', 'substitute')), -- Enhanced: added captain
    is_eligible BOOLEAN DEFAULT true, -- Added: player eligibility (suspensions, etc.)
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tournament_team_id, user_id),
    UNIQUE(tournament_team_id, jersey_number) -- Added: unique jersey numbers per team
);

-- Matches (enhanced)
CREATE TABLE public.tournament_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage_id UUID REFERENCES public.tournament_stages(id) ON DELETE CASCADE,
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_a_id UUID NOT NULL REFERENCES public.tournament_teams(id),
    team_b_id UUID NOT NULL REFERENCES public.tournament_teams(id),
    score_a INTEGER DEFAULT 0,
    score_b INTEGER DEFAULT 0,
    score_a_penalties INTEGER, -- Added: penalty shootout scores
    score_b_penalties INTEGER, -- Added: penalty shootout scores
    extra_time_score_a INTEGER, -- Added: extra time scores
    extra_time_score_b INTEGER, -- Added: extra time scores
    scheduled_at TIMESTAMPTZ,
    kickoff_at TIMESTAMPTZ, -- Added: actual kickoff time
    finished_at TIMESTAMPTZ, -- Added: when match actually ended
    venue TEXT, -- Added: match location
    referee TEXT, -- Added: referee name
    weather_conditions TEXT, -- Added: weather info
    attendance INTEGER, -- Added: spectator count
    match_status TEXT DEFAULT 'scheduled' CHECK (match_status IN ('scheduled', 'live', 'completed', 'postponed', 'cancelled')), -- Added: match lifecycle
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CHECK (team_a_id != team_b_id) -- Added: teams can't play themselves
);

-- Match participants (your original - perfect as is)
CREATE TABLE public.tournament_match_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.tournament_players(id) ON DELETE CASCADE,
    team_side CHAR(1) CHECK (team_side IN ('A', 'B')),
    position_played TEXT, -- Added: position played in this match
    minutes_played INTEGER DEFAULT 90, -- Added: actual minutes played
    yellow_cards INTEGER DEFAULT 0, -- Added: disciplinary actions
    red_cards INTEGER DEFAULT 0, -- Added: disciplinary actions
    UNIQUE(match_id, player_id)
);

-- Goals (enhanced)
CREATE TABLE public.tournament_match_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
    scorer_id UUID NOT NULL REFERENCES public.tournament_players(id),
    assister_id UUID REFERENCES public.tournament_players(id),
    team_side CHAR(1) CHECK (team_side IN ('A', 'B')),
    is_own_goal BOOLEAN DEFAULT false,
    is_penalty BOOLEAN DEFAULT false, -- Added: penalty goals
    is_free_kick BOOLEAN DEFAULT false, -- Added: free kick goals
    minute INTEGER,
    extra_time_minute INTEGER, -- Added: for extra time goals
    goal_type TEXT DEFAULT 'regular' CHECK (goal_type IN ('regular', 'penalty', 'free_kick', 'corner', 'own_goal')), -- Added: goal classification
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Saves (your original - good as is)
CREATE TABLE public.tournament_match_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES public.tournament_matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.tournament_players(id),
    saves_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Added: Tournament Brackets (for knockout tournaments)
CREATE TABLE public.tournament_brackets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.tournament_stages(id) ON DELETE CASCADE,
    bracket_position INTEGER NOT NULL, -- Position in the bracket
    parent_bracket_id UUID REFERENCES public.tournament_brackets(id), -- For hierarchical brackets
    winner_advances_to UUID REFERENCES public.tournament_brackets(id), -- Where winner goes
    team_a_id UUID REFERENCES public.tournament_teams(id),
    team_b_id UUID REFERENCES public.tournament_teams(id),
    winner_team_id UUID REFERENCES public.tournament_teams(id),
    match_id UUID REFERENCES public.tournament_matches(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Added: Tournament Settings (for maximum flexibility)
CREATE TABLE public.tournament_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    setting_key TEXT NOT NULL,
    setting_value TEXT NOT NULL,
    data_type TEXT DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tournament_id, setting_key)
);

-- Indexes for performance
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_created_by ON public.tournaments(created_by);
CREATE INDEX idx_tournament_matches_tournament_id ON public.tournament_matches(tournament_id);
CREATE INDEX idx_tournament_matches_scheduled_at ON public.tournament_matches(scheduled_at);
CREATE INDEX idx_tournament_teams_tournament_id ON public.tournament_teams(tournament_id);
CREATE INDEX idx_tournament_goals_match_id ON public.tournament_match_goals(match_id);
CREATE INDEX idx_tournament_goals_scorer_id ON public.tournament_match_goals(scorer_id);

-- Your original triggers (perfect)
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournament_matches_updated_at BEFORE UPDATE ON public.tournament_matches 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Additional useful views
CREATE VIEW public.tournament_standings AS
SELECT 
    tt.tournament_id,
    tt.team_id,
    t.name as team_name,
    tt.points,
    tt.matches_played,
    tt.matches_won,
    tt.matches_drawn,
    tt.matches_lost,
    tt.goals_for,
    tt.goals_against,
    (tt.goals_for - tt.goals_against) as goal_difference
FROM public.tournament_teams tt
JOIN public.teams t ON tt.team_id = t.id
ORDER BY tt.tournament_id, tt.points DESC, (tt.goals_for - tt.goals_against) DESC;
