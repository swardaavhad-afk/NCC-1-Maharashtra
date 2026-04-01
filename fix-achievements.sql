-- Fix missing columns for achievements table in Supabase
ALTER TABLE achievements 
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_special BOOLEAN DEFAULT FALSE;

-- Now, mark all existing dummy achievements as approved so they show up on the website!
UPDATE achievements SET is_approved = TRUE, is_special = TRUE;
