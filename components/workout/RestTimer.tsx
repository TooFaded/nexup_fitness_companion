"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X } from "lucide-react";

interface RestTimerProps {
  onClose: () => void;
  defaultDuration?: number; // in seconds
}

export default function RestTimer({
  onClose,
  defaultDuration = 90,
}: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Function to send browser notification
  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification("Rest Timer Complete! 💪", {
        body: "Time to get back to your workout!",
        icon: "/icon-192x192.png", // You can add an icon
        badge: "/icon-192x192.png",
        tag: "rest-timer",
        requireInteraction: false,
      });

      // Auto-close notification after 10 seconds
      setTimeout(() => notification.close(), 10000);

      // Focus window when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsComplete(true);
            setIsRunning(false);
            // Play sound when timer completes
            if (audioRef.current) {
              audioRef.current.play().catch(() => {
                // Ignore autoplay errors
              });
            }
            // Send browser notification
            sendNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(defaultDuration);
    setIsRunning(true);
    setIsComplete(false);
  };

  const addTime = (seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds));
    if (timeLeft === 0 && seconds > 0) {
      setIsComplete(false);
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((defaultDuration - timeLeft) / defaultDuration) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full relative">
        {/* Audio element for timer completion sound */}
        <audio
          ref={audioRef}
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCuM0vLTgjMGHm7A7+OZRQ0OVqzn77BdGAtCm+D1wXEhBSyJ0fHPeDsGIHi+7+CXSAwSY7Dm7KJaEglInuHyu3EiBiuN0PHSfjgGIXfC7+CaSQ0RYrTl7aFZEwhHn+HyvnQgBi2M0fHOejkFIHnB7+CbSQ4RYbPl66FYEghHnt/xuHMiBS6M0fDNeTsGIXjB8N+aSQ0RYrLk66FYEwhGnt/quHIjBS6M0fDMejkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEghGnt/otnAjBS6M0fDMeTkFIHjA8N6aSQ0RY7Lk66FYEwhGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEghGnt/otnEjBS6L0fDMejkFIHfA8N+bSQ0RY7Pk7KFYEg"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Rest Timer
        </h3>

        {/* Notification status */}
        {"Notification" in window && Notification.permission === "granted" && (
          <p className="text-xs text-gray-500 mb-4 text-center">
            🔔 Notifications enabled
          </p>
        )}
        {"Notification" in window && Notification.permission === "denied" && (
          <p className="text-xs text-gray-400 mb-4 text-center">
            Notifications blocked
          </p>
        )}
        {"Notification" in window && Notification.permission === "default" && (
          <p className="text-xs text-gray-500 mb-4 text-center">
            Notifications not enabled
          </p>
        )}

        {/* Circular progress */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke={isComplete ? "#10B981" : "#00D9C0"}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${
                  isComplete ? "text-green-600" : "text-brand-charcoal"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              {isComplete && (
                <div className="text-green-600 font-medium mt-2">
                  Rest Complete!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Button
            onClick={toggleTimer}
            variant="outline"
            size="icon"
            className="h-12 w-12"
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="icon"
            className="h-12 w-12"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick time adjustments */}
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => addTime(-15)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            -15s
          </Button>
          <Button
            onClick={() => addTime(-30)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            -30s
          </Button>
          <Button
            onClick={() => addTime(30)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            +30s
          </Button>
          <Button
            onClick={() => addTime(60)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            +1m
          </Button>
        </div>

        {/* Skip button */}
        <Button
          onClick={onClose}
          className="w-full mt-4 bg-brand-mint hover:bg-brand-mint/90"
        >
          {isComplete ? "Continue" : "Skip Rest"}
        </Button>
      </div>
    </div>
  );
}
