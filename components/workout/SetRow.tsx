"use client";

import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateSet, deleteSet } from "@/lib/actions/workouts";

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

  const handleChange = (
    setter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    setHasChanges(true);
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-ember text-white font-semibold text-sm">
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
            className="text-center h-9"
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
            className="text-center h-9"
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
            className="text-center h-9"
          />
          <p className="text-xs text-gray-500 text-center mt-1">RPE</p>
        </div>
      </div>

      {hasChanges && (
        <Button
          size="icon"
          variant="ghost"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="h-9 w-9 text-brand-mint hover:text-brand-mint"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDelete}
        className="h-9 w-9 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
