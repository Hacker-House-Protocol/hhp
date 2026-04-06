ALTER TABLE users
  ADD COLUMN IF NOT EXISTS talent_tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS talent_credentials jsonb DEFAULT '[]'::jsonb;
