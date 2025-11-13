"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishWorkout } from "@/lib/actions/workouts";

interface FinishWorkoutButtonProps {
  workoutId: string;
  startTime: string;
  duration: number | null;
}

export function FinishWorkoutButton({
  workoutId,
  startTime,
  duration,
}: FinishWorkoutButtonProps) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  // If workout already has a duration, it's been finished
  const isFinished = duration !== null;

  const handleFinish = async () => {
    setIsFinishing(true);
    setHasBeenClicked(true);

    const result = await finishWorkout(workoutId, startTime);

    if (result.error) {
      console.error("Failed to finish workout:", result.error);
      setIsFinishing(false);
      setHasBeenClicked(false);
      return;
    }

    // Navigate back to dashboard
    router.push("/");
  };

  // Show "Saved" message after button is clicked or if workout is already finished
  if (hasBeenClicked || isFinished) {
    return (
      <div className="px-4 py-2 text-brand-mint font-medium">
        ✓ Saved
      </div>
    );
  }

  return (
    <Button
      onClick={handleFinish}
      disabled={isFinishing}
      className="bg-brand-ember hover:bg-brand-ember/90 dark:text-gray-100"
    >
      {isFinishing ? (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 dark:text-gray-100" />
          Finishing...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2 dark:text-gray-100" />
          Finish
        </>
      )}
    </Button>
  );
}
