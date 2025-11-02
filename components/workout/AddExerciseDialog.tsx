"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExercise } from "@/lib/actions/workouts";

interface AddExerciseDialogProps {
  workoutId: string;
  trigger?: React.ReactNode;
}

export function AddExerciseDialog({ workoutId, trigger }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) return;

    setIsAdding(true);
    const result = await addExercise(workoutId, exerciseName.trim(), notes.trim() || undefined);

    if (result.error) {
      console.error("Failed to add exercise:", result.error);
    } else {
      setExerciseName("");
      setNotes("");
      setOpen(false);
    }
    setIsAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full border-dashed border-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your workout
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Bench Press"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && exerciseName.trim()) {
                  handleAddExercise();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="e.g., Focus on form"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddExercise}
            className="flex-1 bg-brand-ember hover:bg-brand-ember/90"
            disabled={!exerciseName.trim() || isAdding}
          >
            {isAdding ? "Adding..." : "Add Exercise"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
