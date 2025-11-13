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
import { Dumbbell, Plus } from "lucide-react";
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
  duration: number;
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
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Recent Sessions
              </h3>
              {workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="block p-4 border border-border rounded-lg hover:bg-accent hover:border-brand-ember cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-brand-ember/10 dark:bg-brand-ember/20 flex items-center justify-center group-hover:bg-brand-ember/20 dark:group-hover:bg-brand-ember/30 transition-colors">
                        <Dumbbell className="h-5 w-5 text-brand-ember" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-charcoal dark:text-gray-100 group-hover:text-brand-ember dark:group-hover:text-brand-ember transition-colors">
                          {workout.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {workout.date} •{" "}
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
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {workout.duration} min
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {workout.exercises}{" "}
                        {workout.exercises === 1 ? "exercise" : "exercises"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
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
