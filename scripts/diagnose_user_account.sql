-- Diagnostic and Fix Script for User Account Issues
-- Run this in Supabase SQL Editor while logged in as the affected user

-- ============================================
-- STEP 1: Diagnostic - Check Current State
-- ============================================

-- Check your user ID
SELECT auth.uid() as my_user_id;

-- Check your workouts
SELECT id, name, date, status, created_at 
FROM workouts 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- Check exercises in your workouts
SELECT e.id, e.name, e.workout_id, w.name as workout_name
FROM exercises e
JOIN workouts w ON w.id = e.workout_id
WHERE w.user_id = auth.uid()
ORDER BY e.created_at DESC
LIMIT 20;

-- Check sets (this is where the problem likely is)
SELECT s.id, s.exercise_id, s.set_order, s.weight, s.reps, s.rpe, s.created_at,
       e.name as exercise_name,
       w.id as workout_id,
       w.user_id
FROM sets s
JOIN exercises e ON e.id = s.exercise_id
JOIN workouts w ON w.id = e.workout_id
WHERE w.user_id = auth.uid()
ORDER BY s.created_at DESC
LIMIT 50;

-- ============================================
-- STEP 2: Check for Orphaned or Broken Sets
-- ============================================

-- Find sets that might have broken references
SELECT s.id, s.exercise_id, s.weight, s.reps
FROM sets s
WHERE NOT EXISTS (
  SELECT 1 FROM exercises e 
  WHERE e.id = s.exercise_id
);

-- ============================================
-- STEP 3: Fix Script (ONLY RUN IF NEEDED)
-- ============================================

-- If you see sets with weight=0 and reps=0, update them to allow changes
-- (This shouldn't normally happen, but could cause issues)

-- DON'T RUN THIS YET - Just diagnostic above first
-- UPDATE sets
-- SET weight = 0, reps = 0
-- WHERE id IN (
--   SELECT s.id 
--   FROM sets s
--   JOIN exercises e ON e.id = s.exercise_id
--   JOIN workouts w ON w.id = e.workout_id
--   WHERE w.user_id = auth.uid()
--   AND s.weight = 0 
--   AND s.reps = 0
-- );

-- ============================================
-- STEP 4: Test Permissions
-- ============================================

-- Test if you can update a set (replace 'set-id-here' with an actual set ID from above)
-- UPDATE sets 
-- SET weight = 100, reps = 10
-- WHERE id = 'set-id-here'
-- RETURNING *;

-- ============================================
-- STEP 5: Check RLS Policies
-- ============================================

-- Verify RLS is working correctly for your user
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('workouts', 'exercises', 'sets')
ORDER BY tablename, policyname;
