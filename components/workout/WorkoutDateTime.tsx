"use client";

interface WorkoutDateTimeProps {
  date: string;
  timeStarted: string;
}

export function WorkoutDateTime({ date, timeStarted }: WorkoutDateTimeProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}{" "}
      •{" "}
      {new Date(timeStarted).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })}
    </p>
  );
}
