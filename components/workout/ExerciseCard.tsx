"use client";

import { useState } from "react";
import { Trash2, Plus, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetRow } from "./SetRow";
import { addSet, deleteExercise } from "@/lib/actions/workouts";

interface Set {
  id: string;
  set_order: number;
  weight: number;
  reps: number;
  rpe: number | null;
}

interface Exercise {
  id: string;
  exercise_name: string;
  exercise_order: number;
  notes: string | null;
  sets?: Set[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  workoutId: string;
}

export function ExerciseCard({ exercise, workoutId }: ExerciseCardProps) {
  const [isAddingSet, setIsAddingSet] = useState(false);

  const handleAddSet = async () => {
    setIsAddingSet(true);

    // Get the last set's values to use as defaults
    const lastSet = exercise.sets?.[exercise.sets.length - 1];
    const defaultWeight = lastSet?.weight || 0;
    const defaultReps = lastSet?.reps || 0;
    const defaultRpe = lastSet?.rpe || undefined;

    const result = await addSet(
      exercise.id,
      workoutId,
      defaultWeight,
      defaultReps,
      defaultRpe
    );

    if (result.error) {
      console.error("Failed to add set:", result.error);
    }

    setIsAddingSet(false);
  };

  const handleDeleteExercise = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${exercise.exercise_name}? This will delete all sets.`
      )
    ) {
      return;
    }

    const result = await deleteExercise(exercise.id, workoutId);
    if (result.error) {
      console.error("Failed to delete exercise:", result.error);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {exercise.exercise_name}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteExercise}
          className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {exercise.notes && (
        <div className="flex items-start gap-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <StickyNote className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">{exercise.notes}</p>
        </div>
      )}

      {/* Sets Table Header */}
      {exercise.sets && exercise.sets.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 px-2 pb-2">
            <div className="w-10" />
            <div className="flex-1 grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase">
              <div className="text-center">Weight</div>
              <div className="text-center">Reps</div>
              <div className="text-center">RPE</div>
            </div>
            <div className="w-11" />
            <div className="w-11" />
          </div>
        </div>
      )}

      {/* Sets List */}
      <div className="space-y-2">
        {exercise.sets && exercise.sets.length > 0 ? (
          exercise.sets.map((set) => (
            <SetRow key={set.id} set={set} workoutId={workoutId} />
          ))
        ) : (
          <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
            No sets logged yet. Add your first set below.
          </div>
        )}
      </div>

      {/* Add Set Button */}
      <Button
        variant="outline"
        className="w-full mt-3 h-11 text-base"
        onClick={handleAddSet}
        disabled={isAddingSet}
      >
        <Plus className="h-5 w-5 mr-2" />
        {isAddingSet ? "Adding..." : "Add Set"}
      </Button>
    </div>
  );
}
