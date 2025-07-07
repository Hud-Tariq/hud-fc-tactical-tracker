
-- Add columns to match_goals table to better track goals and assists
ALTER TABLE public.match_goals 
ADD COLUMN IF NOT EXISTS is_own_goal BOOLEAN DEFAULT FALSE;

-- Update the match_goals table structure to ensure we have all needed fields
-- (scorer_id, assister_id, team, minute, is_own_goal are already present or being added)

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_match_goals_match_id ON public.match_goals(match_id);
CREATE INDEX IF NOT EXISTS idx_match_goals_scorer ON public.match_goals(scorer_id);
CREATE INDEX IF NOT EXISTS idx_match_goals_assister ON public.match_goals(assister_id);
