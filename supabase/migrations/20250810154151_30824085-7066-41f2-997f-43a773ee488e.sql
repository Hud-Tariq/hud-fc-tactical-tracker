-- First, let's check and clean up any null user_id records
-- We'll delete any players or matches without user_id since they represent a security risk

-- Delete players without user_id (they shouldn't exist in a secure system)
DELETE FROM public.players WHERE user_id IS NULL;

-- Delete matches without user_id (they shouldn't exist in a secure system)  
DELETE FROM public.matches WHERE user_id IS NULL;

-- Now we can safely make user_id NOT NULL and update RLS policies
ALTER TABLE public.players ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.matches ALTER COLUMN user_id SET NOT NULL;

-- Update the RLS policy for players to require authentication
DROP POLICY IF EXISTS "Users can manage their own players" ON public.players;

CREATE POLICY "Authenticated users can manage their own players" 
ON public.players 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the RLS policy for matches to require authentication  
DROP POLICY IF EXISTS "Users can manage their own matches" ON public.matches;

CREATE POLICY "Authenticated users can manage their own matches"
ON public.matches
FOR ALL
TO authenticated  
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Update the RLS policies for match_goals to require authentication
DROP POLICY IF EXISTS "Users can manage goals for their own matches" ON public.match_goals;

CREATE POLICY "Authenticated users can manage goals for their own matches"
ON public.match_goals
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_goals.match_id 
    AND matches.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_goals.match_id 
    AND matches.user_id = auth.uid()
  )
);

-- Update the RLS policies for match_saves to require authentication
DROP POLICY IF EXISTS "Users can manage saves for their own matches" ON public.match_saves;

CREATE POLICY "Authenticated users can manage saves for their own matches"
ON public.match_saves
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_saves.match_id 
    AND matches.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = match_saves.match_id 
    AND matches.user_id = auth.uid()
  )
);