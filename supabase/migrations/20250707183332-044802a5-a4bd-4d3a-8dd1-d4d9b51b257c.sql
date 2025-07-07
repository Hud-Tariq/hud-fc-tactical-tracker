
-- Create enum for player positions
CREATE TYPE player_position AS ENUM ('Goalkeeper', 'Defender', 'Midfielder', 'Forward');

-- Create players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age > 0 AND age < 100),
  position player_position NOT NULL,
  rating INTEGER NOT NULL DEFAULT 50 CHECK (rating >= 1 AND rating <= 100),
  matches_played INTEGER NOT NULL DEFAULT 0,
  total_goals INTEGER NOT NULL DEFAULT 0,
  total_assists INTEGER NOT NULL DEFAULT 0,
  total_saves INTEGER NOT NULL DEFAULT 0,
  clean_sheets INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  team_a_players UUID[] NOT NULL,
  team_b_players UUID[] NOT NULL,
  score_a INTEGER NOT NULL DEFAULT 0,
  score_b INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create match_goals table to track goals and assists
CREATE TABLE public.match_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  scorer_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  assister_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  team TEXT NOT NULL CHECK (team IN ('A', 'B')),
  minute INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create match_saves table to track goalkeeper saves
CREATE TABLE public.match_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  saves_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_players_position ON public.players(position);
CREATE INDEX idx_players_rating ON public.players(rating DESC);
CREATE INDEX idx_matches_date ON public.matches(date desc);
CREATE INDEX idx_matches_completed ON public.matches(completed);
CREATE INDEX idx_match_goals_match_id ON public.match_goals(match_id);
CREATE INDEX idx_match_goals_scorer_id ON public.match_goals(scorer_id);
CREATE INDEX idx_match_saves_match_id ON public.match_saves(match_id);
CREATE INDEX idx_match_saves_player_id ON public.match_saves(player_id);

-- Enable Row Level Security (RLS) - making tables public for now since no auth is implemented
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_saves ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since no authentication is implemented)
CREATE POLICY "Allow all operations on players" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on match_goals" ON public.match_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on match_saves" ON public.match_saves FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
