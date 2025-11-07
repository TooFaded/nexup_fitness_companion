import { Flame } from "lucide-react";

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-brand-charcoal dark:text-brand-mist mb-2 flex items-center gap-2">
        Welcome {userName}!{" "}
        <Flame className="h-8 w-8 text-brand-ember animate-pulse" />
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Track your workouts and reach your fitness goals.
      </p>
    </div>
  );
}
