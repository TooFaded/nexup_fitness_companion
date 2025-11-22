import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getAllWorkouts } from "@/lib/queries/workouts";
import { Dumbbell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GroupedWorkoutsList } from "@/components/workout/GroupedWorkoutsList";

export default async function AllWorkoutsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  const workouts = await getAllWorkouts();

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader userEmail={user.email || ""} onSignOut={signOut} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Dumbbell className="h-6 w-6 text-brand-ember" />
              All Workouts
            </CardTitle>
            <CardDescription>
              Complete history of your training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {workouts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No workouts yet</p>
                <p className="text-sm mt-2 mb-6">
                  Start your first training session to see it here
                </p>
                <Link href="/">
                  <Button className="bg-brand-ember hover:bg-brand-ember/90">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {workouts.length} workout
                    {workouts.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <GroupedWorkoutsList workouts={workouts} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
