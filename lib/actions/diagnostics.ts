"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Diagnostic function to check user's data integrity
 * Call this from a temporary debug page
 */
export async function diagnoseUserAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check workouts
  const { data: workouts, error: workoutsError } = await supabase
    .from("workouts")
    .select("id, name, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Check exercises
  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select(`
      id,
      name,
      workout_id,
      workouts!inner(user_id, name)
    `)
    .eq("workouts.user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Check sets
  const { data: sets, error: setsError } = await supabase
    .from("sets")
    .select(`
      id,
      exercise_id,
      set_order,
      weight,
      reps,
      rpe,
      exercises!inner(
        id,
        name,
        workout_id,
        workouts!inner(user_id)
      )
    `)
    .eq("exercises.workouts.user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Test update permission on a set
  let updateTest = null;
  if (sets && sets.length > 0) {
    const testSet = sets[0];
    const { data: updateData, error: updateError } = await supabase
      .from("sets")
      .update({ weight: testSet.weight }) // Update with same value (no real change)
      .eq("id", testSet.id)
      .select();

    updateTest = {
      success: !updateError,
      error: updateError?.message,
      data: updateData,
    };
  }

  return {
    userId: user.id,
    email: user.email,
    workouts: {
      count: workouts?.length || 0,
      data: workouts,
      error: workoutsError?.message,
    },
    exercises: {
      count: exercises?.length || 0,
      data: exercises,
      error: exercisesError?.message,
    },
    sets: {
      count: sets?.length || 0,
      data: sets,
      error: setsError?.message,
    },
    updateTest,
  };
}

/**
 * Force refresh a workout's data
 */
export async function refreshWorkoutData(workoutId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership
  const { data: workout } = await supabase
    .from("workouts")
    .select("id, user_id")
    .eq("id", workoutId)
    .single();

  if (!workout || workout.user_id !== user.id) {
    return { error: "Workout not found or access denied" };
  }

  // Get fresh data
  const { data: exercises } = await supabase
    .from("exercises")
    .select(`
      id,
      name,
      sets (
        id,
        set_order,
        weight,
        reps,
        rpe
      )
    `)
    .eq("workout_id", workoutId)
    .order("exercise_order");

  return { success: true, exercises };
}
