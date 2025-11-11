"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateWorkoutParams {
  name: string;
  templateId?: string;
}

export async function createWorkout({ name, templateId }: CreateWorkoutParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Create the workout
  const now = new Date().toISOString();
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      name: name || "Quick Workout",
      template_id: templateId !== "blank" ? templateId : null,
      date: now,
      time_started: now,
    })
    .select()
    .single();

  if (workoutError || !workout) {
    console.error("Error creating workout:", workoutError);
    return { error: "Failed to create workout" };
  }

  // If a template was selected, copy exercises from the template
  if (templateId && templateId !== "blank") {
    const { data: templateExercises, error: templateError } = await supabase
      .from("template_exercises")
      .select("*")
      .eq("template_id", templateId)
      .order("exercise_order");

    if (!templateError && templateExercises && templateExercises.length > 0) {
      // Insert exercises from template
      const exercisesToInsert = templateExercises.map((te) => ({
        workout_id: workout.id,
        exercise_name: te.exercise_name,
        exercise_order: te.exercise_order,
        notes: te.notes,
      }));

      const { error: exercisesError } = await supabase
        .from("exercises")
        .insert(exercisesToInsert);

      if (exercisesError) {
        console.error("Error creating exercises:", exercisesError);
        // Continue anyway - user can add exercises manually
      } else {
        console.log(
          "Successfully created exercises:",
          exercisesToInsert.length
        );
      }
    }
  }

  // Revalidate the dashboard to show updated stats
  revalidatePath("/");
  revalidatePath(`/workout/${workout.id}`);

  return { success: true, workoutId: workout.id };
}

export async function deleteWorkout(workoutId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting workout:", error);
    return { error: "Failed to delete workout" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateWorkoutDuration(
  workoutId: string,
  duration: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("workouts")
    .update({ duration })
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating workout duration:", error);
    return { error: "Failed to update duration" };
  }

  return { success: true };
}

export async function addExercise(
  workoutId: string,
  exerciseName: string,
  notes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the current max order for this workout
  const { data: exercises } = await supabase
    .from("exercises")
    .select("exercise_order")
    .eq("workout_id", workoutId)
    .order("exercise_order", { ascending: false })
    .limit(1);

  const nextOrder =
    exercises && exercises.length > 0 ? exercises[0].exercise_order + 1 : 0;

  const { data: exercise, error } = await supabase
    .from("exercises")
    .insert({
      workout_id: workoutId,
      exercise_name: exerciseName,
      exercise_order: nextOrder,
      notes: notes || null,
    })
    .select()
    .single();

  if (error || !exercise) {
    console.error("Error adding exercise:", error);
    return { error: "Failed to add exercise" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true, exercise };
}

export async function deleteExercise(exerciseId: string, workoutId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("exercises")
    .delete()
    .eq("id", exerciseId);

  if (error) {
    console.error("Error deleting exercise:", error);
    return { error: "Failed to delete exercise" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true };
}

export async function updateExerciseNotes(
  exerciseId: string,
  workoutId: string,
  notes: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("exercises")
    .update({ notes })
    .eq("id", exerciseId);

  if (error) {
    console.error("Error updating exercise notes:", error);
    return { error: "Failed to update notes" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true };
}

export async function addSet(
  exerciseId: string,
  workoutId: string,
  weight: number,
  reps: number,
  rpe?: number
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Get the current max set order for this exercise
  const { data: sets } = await supabase
    .from("sets")
    .select("set_order")
    .eq("exercise_id", exerciseId)
    .order("set_order", { ascending: false })
    .limit(1);

  const nextSetOrder = sets && sets.length > 0 ? sets[0].set_order + 1 : 1;

  const { data: set, error } = await supabase
    .from("sets")
    .insert({
      exercise_id: exerciseId,
      set_order: nextSetOrder,
      weight,
      reps,
      rpe: rpe || null,
    })
    .select()
    .single();

  if (error || !set) {
    console.error("Error adding set:", error);
    return { error: "Failed to add set" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true, set };
}

export async function updateSet(
  setId: string,
  workoutId: string,
  data: { weight?: number; reps?: number; rpe?: number }
) {
  console.log("updateSet called with:", { setId, workoutId, data });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("updateSet: User not authenticated");
    return { error: "Not authenticated" };
  }

  console.log("updateSet: User authenticated:", user.id);

  const { data: updatedData, error } = await supabase
    .from("sets")
    .update(data)
    .eq("id", setId)
    .select();

  if (error) {
    console.error("Error updating set in database:", error);
    return { error: `Failed to update set: ${error.message}` };
  }

  console.log("✅ Set updated successfully:", updatedData);

  revalidatePath(`/workout/${workoutId}`);
  return { success: true, data: updatedData };
}

export async function deleteSet(setId: string, workoutId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("sets").delete().eq("id", setId);

  if (error) {
    console.error("Error deleting set:", error);
    return { error: "Failed to delete set" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true };
}

export async function finishWorkout(workoutId: string, startTime: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Calculate duration in minutes
  const start = new Date(startTime);
  const end = new Date();
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60000);

  const { error } = await supabase
    .from("workouts")
    .update({ duration: durationMinutes })
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error finishing workout:", error);
    return { error: "Failed to finish workout" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateWorkoutName(workoutId: string, name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("workouts")
    .update({ name })
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating workout name:", error);
    return { error: "Failed to update workout name" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true };
}

export async function updateExerciseName(
  exerciseId: string,
  workoutId: string,
  name: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify ownership through workout
  const { data: exercise } = await supabase
    .from("exercises")
    .select("workout_id")
    .eq("id", exerciseId)
    .single();

  if (!exercise) {
    return { error: "Exercise not found" };
  }

  const { data: workout } = await supabase
    .from("workouts")
    .select("user_id")
    .eq("id", exercise.workout_id)
    .single();

  if (!workout || workout.user_id !== user.id) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("exercises")
    .update({ exercise_name: name })
    .eq("id", exerciseId);

  if (error) {
    console.error("Error updating exercise name:", error);
    return { error: "Failed to update exercise name" };
  }

  revalidatePath(`/workout/${workoutId}`);
  return { success: true };
}

export async function getUserExerciseHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { exercises: [] };
  }

  // Get unique exercise names from user's workout history
  const { data, error } = await supabase
    .from("exercises")
    .select("exercise_name, workouts!inner(user_id)")
    .eq("workouts.user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching exercise history:", error);
    return { exercises: [] };
  }

  // Get unique exercise names (remove duplicates)
  const uniqueExercises = Array.from(
    new Set(data.map((e) => e.exercise_name))
  ).slice(0, 20); // Limit to 20 most recent unique exercises

  return { exercises: uniqueExercises };
}
