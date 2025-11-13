-- Add is_confirmed column to sets table to track if user has explicitly confirmed the set
ALTER TABLE sets ADD COLUMN is_confirmed BOOLEAN DEFAULT FALSE;

-- Mark all existing sets with data as confirmed (for backwards compatibility)
UPDATE sets SET is_confirmed = TRUE WHERE (weight > 0 OR reps > 0);

-- Add comment
COMMENT ON COLUMN sets.is_confirmed IS 'Whether the user has explicitly confirmed this set';
