-- Add time_started column to workouts table
ALTER TABLE workouts ADD COLUMN time_started TIMESTAMPTZ;

-- Set existing workouts' time_started to their date (for backwards compatibility)
UPDATE workouts SET time_started = date WHERE time_started IS NULL;

-- Make time_started NOT NULL with default NOW()
ALTER TABLE workouts ALTER COLUMN time_started SET DEFAULT NOW();
ALTER TABLE workouts ALTER COLUMN time_started SET NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN workouts.time_started IS 'Timestamp when the workout was started';
