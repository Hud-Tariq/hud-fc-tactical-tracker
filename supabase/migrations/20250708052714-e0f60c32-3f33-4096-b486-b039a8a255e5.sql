
-- First, we need to add user_id columns to all tables to separate data by user
-- This will allow multiple accounts with their own players and matches

-- Add user_id column to players table
ALTER TABLE public.players 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to matches table  
ALTER TABLE public.matches
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies for players table to be user-specific
DROP POLICY IF EXISTS "Allow all operations on players" ON public.players;

CREATE POLICY "Users can manage their own players" 
ON public.players 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL) 
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for matches table to be user-specific
DROP POLICY IF EXISTS "Allow all operations on matches" ON public.matches;

CREATE POLICY "Users can manage their own matches" 
ON public.matches 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL) 
WITH CHECK (auth.uid() = user_id);

-- Update RLS policies for match_goals to be user-specific (through match relationship)
DROP POLICY IF EXISTS "Allow all operations on match_goals" ON public.match_goals;

CREATE POLICY "Users can manage goals for their own matches" 
ON public.match_goals 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_goals.match_id 
    AND (matches.user_id = auth.uid() OR matches.user_id IS NULL)
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_goals.match_id 
    AND matches.user_id = auth.uid()
  )
);

-- Update RLS policies for match_saves to be user-specific (through match relationship)
DROP POLICY IF EXISTS "Allow all operations on match_saves" ON public.match_saves;

CREATE POLICY "Users can manage saves for their own matches" 
ON public.match_saves 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_saves.match_id 
    AND (matches.user_id = auth.uid() OR matches.user_id IS NULL)
  )
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.matches 
    WHERE matches.id = match_saves.match_id 
    AND matches.user_id = auth.uid()
  )
);

-- Add indexes for better performance with user_id filtering
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);

-- Add is_own_goal column to match_goals if it doesn't exist
ALTER TABLE public.match_goals 
ADD COLUMN IF NOT EXISTS is_own_goal BOOLEAN DEFAULT FALSE;
