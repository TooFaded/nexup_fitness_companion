import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import Link from "next/link";

interface Workout {
  id: string;
  name: string;
  date: string;
  time_started: string;
  duration: number;
  exercises: number;
}

interface RecentWorkoutsProps {
  workouts?: Workout[];
}

export default function RecentWorkouts({ workouts = [] }: RecentWorkoutsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Workouts</CardTitle>
        <CardDescription>Your training history</CardDescription>
      </CardHeader>
      <CardContent>
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No workouts yet</p>
            <p className="text-xs mt-1">
              Start your first session to see it here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workout/${workout.id}`}
                className="block p-3 border border-border rounded-lg hover:bg-accent hover:border-brand-ember cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-brand-charcoal dark:text-gray-100">
                      {workout.name}
                    </h4>
                    <p className="text-xs text-gray-500">
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
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {workout.duration} min
                    </p>
                    <p className="text-xs text-gray-500">
                      {workout.exercises} exercises
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
