-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- WORKOUTS TABLE
-- ================================================
-- Stores individual workout sessions
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID, -- References workout_templates if created from template
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration INTEGER, -- Duration in minutes
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(date DESC);

-- ================================================
-- EXERCISES TABLE
-- ================================================
-- Stores exercises within a workout
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  exercise_order INTEGER NOT NULL DEFAULT 0, -- Order within the workout
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_exercises_workout_id ON exercises(workout_id);

-- ================================================
-- SETS TABLE
-- ================================================
-- Stores individual sets for each exercise
CREATE TABLE sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_order INTEGER NOT NULL DEFAULT 0, -- Order within the exercise
  weight NUMERIC(10, 2), -- Weight in lbs or kg
  reps INTEGER,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion (1-10)
  rir INTEGER CHECK (rir >= 0 AND rir <= 10), -- Reps in Reserve (0-10)
  is_warmup BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_sets_exercise_id ON sets(exercise_id);

-- ================================================
-- WORKOUT TEMPLATES TABLE
-- ================================================
-- Stores pre-built workout templates (Push/Pull/Legs, etc.)
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT FALSE, -- System default templates (Push/Pull/Legs)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_templates_user_id ON workout_templates(user_id);

-- ================================================
-- TEMPLATE EXERCISES TABLE
-- ================================================
-- Stores exercises associated with templates
CREATE TABLE template_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  exercise_order INTEGER NOT NULL DEFAULT 0,
  target_sets INTEGER,
  target_reps INTEGER,
  target_weight NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_template_exercises_template_id ON template_exercises(template_id);

-- ================================================
-- USER PREFERENCES TABLE
-- ================================================
-- Stores user settings and preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_unit TEXT DEFAULT 'lbs' CHECK (weight_unit IN ('lbs', 'kg')),
  default_rest_timer INTEGER DEFAULT 90, -- Default rest time in seconds
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================
-- PERSONAL RECORDS TABLE
-- ================================================
-- Tracks personal records for exercises
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  weight NUMERIC(10, 2) NOT NULL,
  reps INTEGER NOT NULL,
  estimated_1rm NUMERIC(10, 2), -- Calculated 1RM
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_prs_user_id ON personal_records(user_id);
CREATE INDEX idx_prs_exercise_name ON personal_records(exercise_name);

-- ================================================
-- BODY WEIGHT TRACKING TABLE (Optional)
-- ================================================
CREATE TABLE body_weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight NUMERIC(10, 2) NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_body_weight_user_id ON body_weight_logs(user_id);
CREATE INDEX idx_body_weight_date ON body_weight_logs(date DESC);

-- ================================================
-- FUNCTIONS
-- ================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sets_updated_at BEFORE UPDATE ON sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON workout_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weight_logs ENABLE ROW LEVEL SECURITY;

-- ================================================
-- RLS POLICIES: WORKOUTS
-- ================================================

CREATE POLICY "Users can view own workouts"
ON workouts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workouts"
ON workouts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
ON workouts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
ON workouts FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- RLS POLICIES: EXERCISES
-- ================================================

CREATE POLICY "Users can view own exercises"
ON exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own exercises"
ON exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own exercises"
ON exercises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own exercises"
ON exercises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workouts
    WHERE workouts.id = exercises.workout_id
    AND workouts.user_id = auth.uid()
  )
);

-- ================================================
-- RLS POLICIES: SETS
-- ================================================

CREATE POLICY "Users can view own sets"
ON sets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM exercises
    JOIN workouts ON workouts.id = exercises.workout_id
    WHERE exercises.id = sets.exercise_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own sets"
ON sets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM exercises
    JOIN workouts ON workouts.id = exercises.workout_id
    WHERE exercises.id = sets.exercise_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own sets"
ON sets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM exercises
    JOIN workouts ON workouts.id = exercises.workout_id
    WHERE exercises.id = sets.exercise_id
    AND workouts.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own sets"
ON sets FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM exercises
    JOIN workouts ON workouts.id = exercises.workout_id
    WHERE exercises.id = sets.exercise_id
    AND workouts.user_id = auth.uid()
  )
);

-- ================================================
-- RLS POLICIES: WORKOUT TEMPLATES
-- ================================================

CREATE POLICY "Users can view own templates"
ON workout_templates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
ON workout_templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
ON workout_templates FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
ON workout_templates FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- RLS POLICIES: TEMPLATE EXERCISES
-- ================================================

CREATE POLICY "Users can view own template exercises"
ON template_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workout_templates
    WHERE workout_templates.id = template_exercises.template_id
    AND workout_templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own template exercises"
ON template_exercises FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workout_templates
    WHERE workout_templates.id = template_exercises.template_id
    AND workout_templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own template exercises"
ON template_exercises FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workout_templates
    WHERE workout_templates.id = template_exercises.template_id
    AND workout_templates.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own template exercises"
ON template_exercises FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workout_templates
    WHERE workout_templates.id = template_exercises.template_id
    AND workout_templates.user_id = auth.uid()
  )
);

-- ================================================
-- RLS POLICIES: USER PREFERENCES
-- ================================================

CREATE POLICY "Users can view own preferences"
ON user_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
ON user_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
ON user_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
ON user_preferences FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- RLS POLICIES: PERSONAL RECORDS
-- ================================================

CREATE POLICY "Users can view own PRs"
ON personal_records FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PRs"
ON personal_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PRs"
ON personal_records FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs"
ON personal_records FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- RLS POLICIES: BODY WEIGHT LOGS
-- ================================================

CREATE POLICY "Users can view own body weight logs"
ON body_weight_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own body weight logs"
ON body_weight_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own body weight logs"
ON body_weight_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own body weight logs"
ON body_weight_logs FOR DELETE
USING (auth.uid() = user_id);
