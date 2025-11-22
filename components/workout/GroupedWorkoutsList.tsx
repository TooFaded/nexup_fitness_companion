"use client";

import { Dumbbell, Calendar, Clock, Play } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Workout {
  id: string;
  name: string;
  date: string;
  time_started: string;
  duration: number | null;
  exercises: number;
}

interface GroupedWorkoutsListProps {
  workouts: Workout[];
}

export function GroupedWorkoutsList({ workouts }: GroupedWorkoutsListProps) {
  // Group workouts by time periods
  const groupWorkoutsByPeriod = (workouts: Workout[]) => {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfTwoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const grouped: { [key: string]: Workout[] } = {};

    workouts.forEach((workout) => {
      const workoutDate = new Date(workout.date);
      let period: string;

      if (workoutDate >= startOfThisWeek) {
        period = "This Week";
      } else if (workoutDate >= startOfLastWeek) {
        period = "Last Week";
      } else if (workoutDate >= startOfThisMonth) {
        period = "Earlier This Month";
      } else if (workoutDate >= startOfLastMonth) {
        period = workoutDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      } else if (workoutDate >= startOfTwoMonthsAgo) {
        period = workoutDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      } else {
        period = workoutDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      }

      if (!grouped[period]) {
        grouped[period] = [];
      }
      grouped[period].push(workout);
    });

    // Sort periods chronologically
    const sortedPeriods = Object.keys(grouped).sort((a, b) => {
      const periodOrder = [
        "This Week",
        "Last Week",
        "Earlier This Month",
      ];

      const aIndex = periodOrder.indexOf(a);
      const bIndex = periodOrder.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // For month/year entries, sort by date (most recent first)
      const aDate = new Date(a + " 1");
      const bDate = new Date(b + " 1");
      return bDate.getTime() - aDate.getTime();
    });

    return sortedPeriods.map((period) => ({
      period,
      workouts: grouped[period],
    }));
  };

  const groupedWorkouts = groupWorkoutsByPeriod(workouts);

  return (
    <div className="space-y-8">
      {groupedWorkouts.map(({ period, workouts }) => (
        <div key={period} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {period}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({workouts.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout) => {
              const isUnfinished = workout.duration === null;
              
              return (
                <Card key={workout.id} className="hover:border-brand-ember transition-all duration-200 group h-full">
                  <CardContent className="p-5">
                    <Link href={`/workout/${workout.id}`} className="block">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-12 w-12 rounded-lg bg-brand-ember/10 dark:bg-brand-ember/20 flex items-center justify-center group-hover:bg-brand-ember/20 dark:group-hover:bg-brand-ember/30 transition-colors flex-shrink-0">
                          <Dumbbell className="h-6 w-6 text-brand-ember" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-brand-charcoal dark:text-gray-100 group-hover:text-brand-ember dark:group-hover:text-brand-ember transition-colors truncate">
                              {workout.name}
                            </h3>
                            {isUnfinished && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-brand-ember/10 text-brand-ember rounded-full whitespace-nowrap">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {workout.exercises}{" "}
                            {workout.exercises === 1 ? "exercise" : "exercises"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(workout.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(workout.time_started).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                            {!isUnfinished && ` • ${workout.duration} min`}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {isUnfinished && (
                      <div className="mt-4 pt-4 border-t border-border">
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
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
