"use client";

import { useState } from "react";
import { Trash2, Check, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSet, deleteSet } from "@/lib/actions/workouts";
import RestTimer from "./RestTimer";

interface Set {
  id: string;
  set_order: number;
  weight: number;
  reps: number;
  rpe: number | null;
}

interface SetRowProps {
  set: Set;
  workoutId: string;
  onDelete?: () => void;
}

export function SetRow({ set, workoutId, onDelete }: SetRowProps) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());
  const [rpe, setRpe] = useState(set.rpe?.toString() || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(
    set.weight > 0 || set.reps > 0
  ); // Set is confirmed if it has data
  const [showTimer, setShowTimer] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const result = await updateSet(set.id, workoutId, {
      weight: parseFloat(weight) || 0,
      reps: parseInt(reps) || 0,
      rpe: rpe ? parseFloat(rpe) : undefined,
    });

    if (result.error) {
      console.error("Failed to update set:", result.error);
    } else {
      setHasChanges(false);
      setIsConfirmed(true);
      // Automatically show timer after confirming a set
      setShowTimer(true);
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    const result = await deleteSet(set.id, workoutId);
    if (result.error) {
      console.error("Failed to delete set:", result.error);
    } else {
      onDelete?.();
    }
  };

  const handleChange = (setter: (value: string) => void, value: string) => {
    setter(value);
    setHasChanges(true);
  };

  return (
    <>
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-ember text-white font-semibold text-sm">
          {set.set_order}
        </div>

        <div className="flex-1 grid grid-cols-3 gap-2">
          <div>
            <Input
              type="number"
              step="0.5"
              placeholder="0"
              value={weight}
              onChange={(e) => handleChange(setWeight, e.target.value)}
              className="text-center h-10 text-base"
            />
            <p className="text-xs text-gray-500 text-center mt-1">lbs</p>
          </div>

          <div>
            <Input
              type="number"
              step="1"
              placeholder="0"
              value={reps}
              onChange={(e) => handleChange(setReps, e.target.value)}
              className="text-center h-10 text-base"
            />
            <p className="text-xs text-gray-500 text-center mt-1">reps</p>
          </div>

          <div>
            <Input
              type="number"
              step="0.5"
              min="1"
              max="10"
              placeholder="-"
              value={rpe}
              onChange={(e) => handleChange(setRpe, e.target.value)}
              className="text-center h-10 text-base"
            />
            <p className="text-xs text-gray-500 text-center mt-1">RPE</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {hasChanges && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="h-11 w-11 text-brand-mint hover:text-brand-mint hover:bg-brand-mint/10"
            >
              <Check className="h-5 w-5" />
            </Button>
          )}

          {!hasChanges && isConfirmed && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowTimer(true)}
              className="h-11 w-11 text-brand-mint hover:text-brand-mint hover:bg-brand-mint/10"
              title="Start rest timer"
            >
              <Timer className="h-5 w-5" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            className="h-11 w-11 text-gray-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}
    </>
  );
}
