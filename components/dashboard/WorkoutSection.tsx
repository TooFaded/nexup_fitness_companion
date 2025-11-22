"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Plus, Play } from "lucide-react";
import Link from "next/link";
import { NewWorkoutModal } from "../modals/NewWorkoutModal";

interface Template {
  id: string;
  name: string;
  description: string | null;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  time_started: string;
  duration: number | null;
  exercises: number;
}

interface WorkoutSectionProps {
  templates?: Template[];
  workouts?: Workout[];
}

export default function WorkoutSection({
  templates = [],
  workouts = [],
}: WorkoutSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  // Group workouts by week
  const groupWorkoutsByWeek = (workouts: Workout[]) => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay()); // Start of this week (Sunday)
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const grouped: { [key: string]: Workout[] } = {
      "This Week": [],
      "Last Week": [],
      "Older": [],
    };

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      
      if (workoutDate >= startOfThisWeek) {
        grouped["This Week"].push(workout);
      } else if (workoutDate >= startOfLastWeek) {
        grouped["Last Week"].push(workout);
      } else {
        grouped["Older"].push(workout);
      }
    });

    // Filter out empty sections
    return Object.entries(grouped).filter(([_, workouts]) => workouts.length > 0);
  };

  const groupedWorkouts = groupWorkoutsByWeek(workouts);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-brand-ember" />
                Workouts
              </CardTitle>
              <CardDescription className="mt-1">
                Start a new session or continue your training
              </CardDescription>
            </div>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-brand-ember hover:bg-brand-ember/90 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No workouts yet</p>
              <p className="text-xs mt-1 mb-4">
                Start your first session to see it here
              </p>
              <Button
                onClick={() => setModalOpen(true)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Workout
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedWorkouts.map(([period, periodWorkouts]) => (
                <div key={period} className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {period}
                  </h3>
                  {periodWorkouts.map((workout) => {
                    const isUnfinished = workout.duration === null;
                    
                    return (
                      <div
                        key={workout.id}
                        className="p-4 border border-border rounded-lg hover:bg-accent hover:border-brand-ember transition-all duration-200 group"
                      >
                        <Link href={`/workout/${workout.id}`} className="block">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="h-10 w-10 rounded-lg bg-brand-ember/10 dark:bg-brand-ember/20 flex items-center justify-center group-hover:bg-brand-ember/20 dark:group-hover:bg-brand-ember/30 transition-colors">
                                <Dumbbell className="h-5 w-5 text-brand-ember" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-brand-charcoal dark:text-gray-100 group-hover:text-brand-ember dark:group-hover:text-brand-ember transition-colors">
                                    {workout.name}
                                  </h4>
                                  {isUnfinished && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-brand-ember/10 text-brand-ember rounded-full">
                                      In Progress
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(workout.date).toLocaleDateString()} •{" "}
                                  {new Date(workout.time_started).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "numeric",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                {!isUnfinished && (
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {workout.duration} min
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {workout.exercises}{" "}
                                  {workout.exercises === 1 ? "exercise" : "exercises"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        {isUnfinished && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Link href={`/workout/${workout.id}`}>
                              <Button
                                size="sm"
                                className="w-full bg-brand-ember hover:bg-brand-ember/90 text-white"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Resume Workout
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Show All Workouts Link */}
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href="/workouts"
                  className="inline-flex items-center text-sm text-brand-ember hover:text-brand-ember/80 font-medium transition-colors"
                >
                  Show all workouts →
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <NewWorkoutModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        templates={templates}
      />
    </>
  );
}
