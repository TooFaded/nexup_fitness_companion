"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search } from "lucide-react";
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
import { addExercise, getUserExerciseHistory } from "@/lib/actions/workouts";

// Comprehensive list of typical gym exercises
const TYPICAL_EXERCISES = [
  // Chest
  "Barbell Bench Press",
  "Incline Barbell Bench Press",
  "Decline Barbell Bench Press",
  "Dumbbell Bench Press",
  "Incline Dumbbell Press",
  "Dumbbell Flyes",
  "Cable Flyes",
  "Push-Ups",
  "Dips",
  
  // Back
  "Deadlift",
  "Barbell Row",
  "Dumbbell Row",
  "T-Bar Row",
  "Lat Pulldown",
  "Pull-Ups",
  "Chin-Ups",
  "Seated Cable Row",
  "Face Pulls",
  "Shrugs",
  
  // Shoulders
  "Overhead Press",
  "Dumbbell Shoulder Press",
  "Arnold Press",
  "Lateral Raises",
  "Front Raises",
  "Rear Delt Flyes",
  "Upright Rows",
  
  // Legs
  "Barbell Squat",
  "Front Squat",
  "Leg Press",
  "Romanian Deadlift",
  "Leg Curl",
  "Leg Extension",
  "Lunges",
  "Bulgarian Split Squat",
  "Calf Raises",
  "Hip Thrusts",
  
  // Arms
  "Barbell Curl",
  "Dumbbell Curl",
  "Hammer Curl",
  "Preacher Curl",
  "Cable Curl",
  "Tricep Pushdown",
  "Skull Crushers",
  "Overhead Tricep Extension",
  "Close Grip Bench Press",
  
  // Core
  "Plank",
  "Ab Wheel Rollout",
  "Hanging Leg Raises",
  "Cable Crunches",
  "Russian Twists",
].sort();

interface AddExerciseDialogProps {
  workoutId: string;
  trigger?: React.ReactNode;
}

export function AddExerciseDialog({ workoutId, trigger }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [notes, setNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      // Fetch user's exercise history when dialog opens
      getUserExerciseHistory().then((result) => {
        setUserHistory(result.exercises);
      });
    }
  }, [open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddExercise = async () => {
    if (!exerciseName.trim()) return;

    setIsAdding(true);
    const result = await addExercise(workoutId, exerciseName.trim(), notes.trim() || undefined);

    if (result.error) {
      console.error("Failed to add exercise:", result.error);
    } else {
      setExerciseName("");
      setSearchTerm("");
      setNotes("");
      setShowDropdown(false);
      setOpen(false);
    }
    setIsAdding(false);
  };

  const handleSelectExercise = (name: string) => {
    setExerciseName(name);
    setSearchTerm(name);
    setShowDropdown(false);
  };

  // Filter exercises based on search term
  const filteredTypicalExercises = TYPICAL_EXERCISES.filter((exercise) =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserHistory = userHistory.filter((exercise) =>
    exercise.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasResults = filteredUserHistory.length > 0 || filteredTypicalExercises.length > 0;

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
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="exercise-name"
                  placeholder="Search or type exercise name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setExerciseName(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && exerciseName.trim()) {
                      handleAddExercise();
                    } else if (e.key === "Escape") {
                      setShowDropdown(false);
                    }
                  }}
                  className="pl-10"
                />
              </div>

              {showDropdown && searchTerm && hasResults && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {/* User's Past Exercises */}
                  {filteredUserHistory.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted">
                        Your History
                      </div>
                      {filteredUserHistory.map((exercise, index) => (
                        <button
                          key={`history-${index}`}
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-foreground transition-colors"
                          onClick={() => handleSelectExercise(exercise)}
                          type="button"
                        >
                          {exercise}
                        </button>
                      ))}
                      
                      {/* Separator */}
                      {filteredTypicalExercises.length > 0 && (
                        <div className="border-t border-border my-1" />
                      )}
                    </div>
                  )}

                  {/* Typical Gym Exercises */}
                  {filteredTypicalExercises.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted">
                        Common Exercises
                      </div>
                      {filteredTypicalExercises.slice(0, 15).map((exercise, index) => (
                        <button
                          key={`typical-${index}`}
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm text-foreground transition-colors"
                          onClick={() => handleSelectExercise(exercise)}
                          type="button"
                        >
                          {exercise}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
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
