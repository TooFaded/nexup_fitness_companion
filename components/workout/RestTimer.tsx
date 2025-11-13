"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Plus, Minus, X, Bell } from "lucide-react";
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
  const [showCompletionAlert, setShowCompletionAlert] = useState(false);

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

  // Send notification when timer completes (desktop only)
  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      try {
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

        setTimeout(() => notification.close(), 10000);
      } catch (error) {
        console.log("Notification not supported");
      }
    }
  };

  // Vibrate multiple times for attention
  const vibrateDevice = () => {
    if ("vibrate" in navigator) {
      // Long pattern: vibrate-pause-vibrate pattern repeated 3 times
      navigator.vibrate([300, 200, 300, 200, 300, 200, 300, 200, 300]);
    }
  };

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);

          // Alert methods
          vibrateDevice();
          sendNotification();
          setShowCompletionAlert(true);

          // Flash the entire page/timer
          let flashCount = 0;
          const flashInterval = setInterval(() => {
            // Toggle between mint and ember colors
            const timerElement = document.querySelector(".timer-container");
            if (timerElement) {
              if (flashCount % 2 === 0) {
                timerElement.classList.add("flash-mint");
                timerElement.classList.remove("flash-ember");
              } else {
                timerElement.classList.add("flash-ember");
                timerElement.classList.remove("flash-mint");
              }
            }
            flashCount++;
            if (flashCount > 12) {
              clearInterval(flashInterval);
              if (timerElement) {
                timerElement.classList.remove("flash-mint", "flash-ember");
              }
            }
          }, 300);

          // Flash the document title
          let titleFlashCount = 0;
          const originalTitle = document.title;
          const titleFlash = setInterval(() => {
            document.title =
              titleFlashCount % 2 === 0 ? "⏰ REST COMPLETE!" : "💪 GET BACK!";
            titleFlashCount++;
            if (titleFlashCount > 10) {
              clearInterval(titleFlash);
              document.title = originalTitle;
            }
          }, 500);

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
    setShowCompletionAlert(false);
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
    <>
      <style jsx>{`
        .flash-mint {
          background-color: rgba(94, 234, 212, 0.3) !important;
          border-color: rgb(94, 234, 212) !important;
        }
        .flash-ember {
          background-color: rgba(255, 107, 74, 0.3) !important;
          border-color: rgb(255, 107, 74) !important;
        }
      `}</style>

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className={`timer-container bg-card dark:bg-dark-card rounded-2xl shadow-2xl p-8 max-w-md w-full border transition-all duration-300 ${
            showCompletionAlert
              ? "border-brand-mint border-4 shadow-[0_0_30px_rgba(94,234,212,0.5)]"
              : "border-border"
          }`}
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

          {/* Notification Enable Button (Desktop) */}
          {notificationPermission === "default" && (
            <Button
              onClick={requestNotificationPermission}
              variant="outline"
              size="sm"
              className="w-full mb-4 text-xs"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          {notificationPermission === "granted" && (
            <p className="text-xs text-brand-mint text-center mb-4 flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" />
              Desktop notifications enabled
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
                  seconds === 0
                    ? "text-brand-mint drop-shadow-[0_0_10px_rgba(94,234,212,0.8)]"
                    : "text-brand-ember"
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-6xl font-bold transition-all ${
                  seconds === 0
                    ? "text-brand-mint animate-pulse scale-110"
                    : "text-foreground"
                }`}
              >
                {formatTime(seconds)}
              </span>
              {seconds === 0 && (
                <span className="text-brand-mint font-bold text-xl mt-2 animate-bounce">
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
    </>
  );
}
