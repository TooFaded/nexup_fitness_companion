import { createClient } from "@/lib/supabase/server";

// ================================================
// WORKOUTS QUERIES
// ================================================

export async function getRecentWorkouts(limit: number = 10) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("workouts")
    .select(`
      id,
      name,
      date,
      duration,
      exercises (
        id
      )
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching workouts:", error);
    return [];
  }

  return data.map((workout) => ({
    id: workout.id,
    name: workout.name,
    date: new Date(workout.date).toLocaleDateString(),
    duration: workout.duration || 0,
    exercises: workout.exercises?.length || 0,
  }));
}

export async function getWorkoutById(workoutId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("workouts")
    .select(`
      *,
      exercises (
        *,
        sets (*)
      )
    `)
    .eq("id", workoutId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching workout:", error);
    return null;
  }

  return data;
}

// ================================================
// WORKOUT STATS QUERIES
// ================================================

export async function getWorkoutsThisWeek() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("date", weekStart.toISOString());

  if (error) {
    console.error("Error counting workouts:", error);
    return 0;
  }

  return count || 0;
}

export async function getTotalVolumeThisWeek() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const { data: workouts, error: workoutsError } = await supabase
    .from("workouts")
    .select("id")
    .eq("user_id", user.id)
    .gte("date", weekStart.toISOString());

  if (workoutsError || !workouts) {
    console.error("Error fetching workouts for volume:", workoutsError);
    return 0;
  }

  if (workouts.length === 0) return 0;

  const workoutIds = workouts.map((w) => w.id);

  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select("id")
    .in("workout_id", workoutIds);

  if (exercisesError || !exercises) {
    console.error("Error fetching exercises:", exercisesError);
    return 0;
  }

  if (exercises.length === 0) return 0;

  const exerciseIds = exercises.map((e) => e.id);

  const { data: sets, error: setsError } = await supabase
    .from("sets")
    .select("weight, reps")
    .in("exercise_id", exerciseIds)
    .eq("is_warmup", false);

  if (setsError || !sets) {
    console.error("Error fetching sets:", setsError);
    return 0;
  }

  const totalVolume = sets.reduce((total, set) => {
    const weight = set.weight || 0;
    const reps = set.reps || 0;
    return total + weight * reps;
  }, 0);

  return Math.round(totalVolume);
}

export async function getAverageDuration() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  weekStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("workouts")
    .select("duration")
    .eq("user_id", user.id)
    .gte("date", weekStart.toISOString())
    .not("duration", "is", null);

  if (error || !data || data.length === 0) {
    return 0;
  }

  const totalDuration = data.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  return Math.round(totalDuration / data.length);
}

export async function getCurrentStreak() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const { data: workouts, error } = await supabase
    .from("workouts")
    .select("date")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error || !workouts || workouts.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of workouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else if (diffDays === streak + 1) {
      currentDate = workoutDate;
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ================================================
// TEMPLATES QUERIES
// ================================================

export async function getUserTemplates() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("workout_templates")
    .select(`
      *,
      template_exercises (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("name");

  if (error) {
    console.error("Error fetching templates:", error);
    return [];
  }

  return data;
}

export async function getTemplateById(templateId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("workout_templates")
    .select(`
      *,
      template_exercises (
        *
      )
    `)
    .eq("id", templateId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching template:", error);
    return null;
  }

  return data;
}

// ================================================
// PERSONAL RECORDS QUERIES
// ================================================

export async function getPersonalRecords(exerciseName?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from("personal_records")
    .select("*")
    .eq("user_id", user.id)
    .order("achieved_at", { ascending: false });

  if (exerciseName) {
    query = query.eq("exercise_name", exerciseName);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching PRs:", error);
    return [];
  }

  return data;
}
