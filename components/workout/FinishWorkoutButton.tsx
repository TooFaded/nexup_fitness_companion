"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { finishWorkout } from "@/lib/actions/workouts";

interface FinishWorkoutButtonProps {
  workoutId: string;
  startTime: string;
}

export function FinishWorkoutButton({
  workoutId,
  startTime,
}: FinishWorkoutButtonProps) {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    
    const result = await finishWorkout(workoutId, startTime);

    if (result.error) {
      console.error("Failed to finish workout:", result.error);
      setIsFinishing(false);
      return;
    }

    // Navigate back to dashboard
    router.push("/");
  };

  return (
    <Button
      onClick={handleFinish}
      disabled={isFinishing}
      className="bg-brand-ember hover:bg-brand-ember/90"
    >
      {isFinishing ? (
        <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Finishing...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Finish
        </>
      )}
    </Button>
  );
}
