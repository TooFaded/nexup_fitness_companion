-- ================================================
-- SEED DEFAULT WORKOUT TEMPLATES
-- ================================================
-- This file creates default workout templates for all users
-- These are the Push/Pull/Legs templates shown in the dashboard

-- Note: These templates will be created with a special system user_id
-- You'll need to modify this to work with your auth setup
-- For now, we'll create them per-user when they sign up

-- ================================================
-- SEED FUNCTION TO CREATE DEFAULT TEMPLATES FOR NEW USERS
-- ================================================

-- Function to create default templates for a new user
CREATE OR REPLACE FUNCTION create_default_templates_for_user(new_user_id UUID)
RETURNS VOID AS $$
DECLARE
  push_template_id UUID;
  pull_template_id UUID;
  legs_template_id UUID;
BEGIN
  -- Create Push Day Template
  INSERT INTO workout_templates (user_id, name, description, is_default)
  VALUES (new_user_id, 'Push Day', 'Chest, shoulders, and triceps workout', TRUE)
  RETURNING id INTO push_template_id;

  -- Add exercises to Push Day
  INSERT INTO template_exercises (template_id, exercise_name, exercise_order, target_sets, target_reps)
  VALUES
    (push_template_id, 'Bench Press', 1, 4, 8),
    (push_template_id, 'Overhead Press', 2, 3, 10),
    (push_template_id, 'Incline Dumbbell Press', 3, 3, 10),
    (push_template_id, 'Lateral Raises', 4, 3, 12),
    (push_template_id, 'Tricep Pushdowns', 5, 3, 12),
    (push_template_id, 'Overhead Tricep Extension', 6, 3, 12);

  -- Create Pull Day Template
  INSERT INTO workout_templates (user_id, name, description, is_default)
  VALUES (new_user_id, 'Pull Day', 'Back and biceps workout', TRUE)
  RETURNING id INTO pull_template_id;

  -- Add exercises to Pull Day
  INSERT INTO template_exercises (template_id, exercise_name, exercise_order, target_sets, target_reps)
  VALUES
    (pull_template_id, 'Deadlift', 1, 4, 6),
    (pull_template_id, 'Pull-ups', 2, 3, 8),
    (pull_template_id, 'Barbell Rows', 3, 4, 8),
    (pull_template_id, 'Face Pulls', 4, 3, 15),
    (pull_template_id, 'Barbell Curls', 5, 3, 10),
    (pull_template_id, 'Hammer Curls', 6, 3, 12);

  -- Create Leg Day Template
  INSERT INTO workout_templates (user_id, name, description, is_default)
  VALUES (new_user_id, 'Leg Day', 'Quads, hamstrings, and calves workout', TRUE)
  RETURNING id INTO legs_template_id;

  -- Add exercises to Leg Day
  INSERT INTO template_exercises (template_id, exercise_name, exercise_order, target_sets, target_reps)
  VALUES
    (legs_template_id, 'Squat', 1, 4, 8),
    (legs_template_id, 'Romanian Deadlift', 2, 3, 10),
    (legs_template_id, 'Leg Press', 3, 3, 12),
    (legs_template_id, 'Leg Curls', 4, 3, 12),
    (legs_template_id, 'Leg Extensions', 5, 3, 12),
    (legs_template_id, 'Calf Raises', 6, 4, 15);

  -- Create default user preferences
  INSERT INTO user_preferences (user_id, weight_unit, default_rest_timer, theme)
  VALUES (new_user_id, 'lbs', 90, 'light')
  ON CONFLICT (user_id) DO NOTHING;

END;
$$ LANGUAGE plpgsql;

-- ================================================
-- TRIGGER TO AUTO-CREATE TEMPLATES ON USER SIGNUP
-- ================================================

-- Function to be called when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default templates for the new user
  PERFORM create_default_templates_for_user(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table (runs after user signup)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
