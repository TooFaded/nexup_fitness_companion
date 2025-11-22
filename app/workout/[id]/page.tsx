import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { AddExerciseDialog } from "@/components/workout/AddExerciseDialog";
import { FinishWorkoutButton } from "@/components/workout/FinishWorkoutButton";
import { DeleteWorkoutButton } from "@/components/workout/DeleteWorkoutButton";
import { EditableWorkoutTitle } from "@/components/workout/EditableWorkoutTitle";
import { WorkoutDateTime } from "@/components/workout/WorkoutDateTime";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WorkoutPageProps {
  params: {
    id: string;
  };
}

interface Set {
  id: string;
  set_order: number;
  weight: number;
  reps: number;
  rpe: number | null;
  is_confirmed: boolean;
}

interface Exercise {
  id: string;
  exercise_name: string;
  exercise_order: number;
  notes: string | null;
  sets: Set[];
}

interface Workout {
  id: string;
  name: string;
  date: string;
  time_started: string;
  duration: number | null;
  notes: string | null;
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const supabase = await createClient();

  // Await params in Next.js 15
  const { id } = await Promise.resolve(params);

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (workoutError || !workout) {
    console.error("Workout error:", workoutError);
    redirect("/");
  }

  // Fetch exercises with sets for this workout
  const { data: exercises, error: exercisesError } = await supabase
    .from("exercises")
    .select(
      `
      *,
      sets (
        id,
        set_order,
        weight,
        reps,
        rpe,
        is_confirmed
      )
    `
    )
    .eq("workout_id", id)
    .order("exercise_order");

  console.log("Exercises data:", exercises);
  console.log("Exercises error:", exercisesError);

  const workoutData = workout as Workout;
  const exercisesData = (exercises || []) as Exercise[];

  // Sort sets within each exercise
  exercisesData.forEach((exercise) => {
    if (exercise.sets) {
      exercise.sets.sort((a, b) => a.set_order - b.set_order);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <EditableWorkoutTitle
                  workoutId={workoutData.id}
                  initialName={workoutData.name}
                />
                <WorkoutDateTime
                  date={workoutData.date}
                  timeStarted={workoutData.time_started}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DeleteWorkoutButton
                workoutId={workoutData.id}
                workoutName={workoutData.name}
              />
              <FinishWorkoutButton
                workoutId={workoutData.id}
                startTime={workoutData.time_started}
                duration={workoutData.duration}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Exercises List */}
          {exercisesData.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  No exercises yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add your first exercise to start tracking your workout
                </p>
                <AddExerciseDialog
                  workoutId={workoutData.id}
                  trigger={
                    <Button className="mt-2 bg-brand-ember hover:bg-brand-ember/90 dark:text-gray-100">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  }
                />
              </div>
            </div>
          ) : (
            <>
              {exercisesData.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  workoutId={workoutData.id}
                />
              ))}

              {/* Add Exercise Button */}
              <AddExerciseDialog workoutId={workoutData.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
