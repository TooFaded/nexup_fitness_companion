"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  defaultSeconds?: number;
  onClose: () => void;
}

export function RestTimer({ defaultSeconds = 90, onClose }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  // Send notification when timer completes
  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Rest Timer Complete! 💪", {
        body: "Time to get back to your workout!",
        icon: "/nexup_logo.svg",
        badge: "/nexup_logo.svg",
        tag: "rest-timer",
        requireInteraction: false,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    }
  };

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          // Play audio alert
          try {
            const audio = new Audio(
              "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8ti="
            );
            audio.play().catch(() => {});
          } catch (error) {
            console.log("Audio playback not supported");
          }

          // Send notification
          sendNotification();

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setSeconds(defaultSeconds);
    setIsRunning(true);
  };

  const adjustTime = (amount: number) => {
    setSeconds((prev) => Math.max(0, prev + amount));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const progress = ((defaultSeconds - seconds) / defaultSeconds) * 100;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Rest Timer</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Notification Status & Enable Button */}
        {notificationPermission === "default" && (
          <Button
            onClick={requestNotificationPermission}
            variant="outline"
            size="sm"
            className="w-full mb-4 text-xs"
          >
            🔔 Enable Notifications
          </Button>
        )}
        {notificationPermission === "granted" && (
          <p className="text-xs text-brand-mint text-center mb-4">
            🔔 Notifications enabled
          </p>
        )}
        {notificationPermission === "denied" && (
          <p className="text-xs text-muted-foreground text-center mb-4">
            Notifications blocked (enable in browser settings)
          </p>
        )}

        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                seconds === 0 ? "text-brand-mint" : "text-brand-ember"
              }`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-foreground">
              {formatTime(seconds)}
            </span>
            {seconds === 0 && (
              <span className="text-brand-mint font-semibold mt-2">
                Rest Complete!
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="rounded-full w-16 h-16 bg-brand-ember hover:bg-brand-ember/90"
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          <Button
            onClick={resetTimer}
            size="lg"
            variant="outline"
            className="rounded-full w-16 h-16"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>

        {/* Quick Time Adjustments */}
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={() => adjustTime(-30)} variant="outline" size="sm">
            <Minus className="h-4 w-4 mr-1" />
            30s
          </Button>
          <Button onClick={() => adjustTime(-15)} variant="outline" size="sm">
            <Minus className="h-4 w-4 mr-1" />
            15s
          </Button>
          <Button onClick={() => adjustTime(30)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            30s
          </Button>
          <Button onClick={() => adjustTime(60)} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            1m
          </Button>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-6 bg-brand-mint hover:bg-brand-mint/90 text-white"
        >
          Continue Workout
        </Button>
      </div>
    </div>
  );
}
