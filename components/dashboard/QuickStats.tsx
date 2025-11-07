import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, TrendingUp, Timer, Calendar } from "lucide-react";

interface QuickStatsProps {
  workoutsThisWeek?: number;
  totalVolume?: number;
  avgDuration?: number;
  currentStreak?: number;
}

export default function QuickStats({
  workoutsThisWeek = 0,
  totalVolume = 0,
  avgDuration = 0,
  currentStreak = 0,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-brand-ember" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {workoutsThisWeek}
              </p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-mint" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {totalVolume} lbs
              </p>
              <p className="text-xs text-muted-foreground">This week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-brand-ember" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {avgDuration} min
              </p>
              <p className="text-xs text-muted-foreground">Per session</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-mint" />
            <div>
              <p className="text-2xl font-bold text-foreground">
                {currentStreak} days
              </p>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
