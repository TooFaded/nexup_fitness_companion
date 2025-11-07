import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import QuickStats from "@/components/dashboard/QuickStats";
import StartWorkoutCard from "@/components/dashboard/StartWorkoutCard";
import QuickTemplates from "@/components/dashboard/QuickTemplates";
import RecentWorkouts from "@/components/dashboard/RecentWorkouts";
import TrainingTools from "@/components/dashboard/TrainingTools";
import {
  getWorkoutsThisWeek,
  getTotalVolumeThisWeek,
  getAverageDuration,
  getCurrentStreak,
  getRecentWorkouts,
  getUserTemplates,
} from "@/lib/queries/workouts";

export default async function Home() {
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

  const userName = user.email?.substring(0, 6) || "User";

  // Fetch dashboard data
  const [
    workoutsThisWeek,
    totalVolume,
    avgDuration,
    currentStreak,
    recentWorkouts,
    templates,
  ] = await Promise.all([
    getWorkoutsThisWeek(),
    getTotalVolumeThisWeek(),
    getAverageDuration(),
    getCurrentStreak(),
    getRecentWorkouts(5),
    getUserTemplates(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader userEmail={user.email || ""} onSignOut={signOut} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection userName={userName} />

        <QuickStats
          workoutsThisWeek={workoutsThisWeek}
          totalVolume={totalVolume}
          avgDuration={avgDuration}
          currentStreak={currentStreak}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StartWorkoutCard templates={templates} />
          <QuickTemplates templates={templates} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentWorkouts workouts={recentWorkouts} />
          <TrainingTools />
        </div>
      </div>
    </main>
  );
}
