"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useState } from "react";

interface Tool {
  id: string;
  name: string;
  emoji: string;
}

interface TrainingToolsProps {
  onSelectTool?: (toolId: string) => void;
}

const tools: Tool[] = [
  { id: "1rm-calculator", name: "1RM Calculator", emoji: "📊" },
  { id: "plate-calculator", name: "Plate Calculator", emoji: "🏋️" },
  { id: "rest-timer", name: "Rest Timer", emoji: "⏱️" },
];

export default function TrainingTools({ onSelectTool }: TrainingToolsProps) {
  const [openTool, setOpenTool] = useState<string | null>(null);

  // 1RM Calculator State
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(1);
  const oneRM = weight && reps ? Math.round(weight * (1 + reps / 30)) : 0;

  // Plate Calculator State
  const [targetWeight, setTargetWeight] = useState(135);
  const [barWeight, setBarWeight] = useState(45);
  const plateSizes = [45, 25, 10, 5, 2.5];
  const plateResult = (() => {
    let remaining = (targetWeight - barWeight) / 2;
    const result: Record<number, number> = {};
    plateSizes.forEach((size) => {
      result[size] = Math.floor(remaining / size);
      remaining -= result[size] * size;
    });
    return result;
  })();

  // Rest Timer State
  const [restTime, setRestTime] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState(restTime);
  // Timer logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timerRunning && timerLeft > 0) {
      interval = setInterval(() => {
        setTimerLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Training Tools</CardTitle>
          <CardDescription>Calculators and utilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => setOpenTool(tool.id)}
            >
              {tool.emoji} {tool.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* 1RM Calculator Modal */}
      <Dialog
        open={openTool === "1rm-calculator"}
        onOpenChange={() => setOpenTool(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>1RM Calculator</DialogTitle>
            <DialogDescription>
              Estimate your one-rep max using the Epley formula.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight-input">Weight (lbs)</Label>
              <input
                id="weight-input"
                type="number"
                min={0}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="border border-border rounded px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Weight (lbs)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps-input">Reps</Label>
              <input
                id="reps-input"
                type="number"
                min={1}
                value={reps}
                onChange={(e) => setReps(Number(e.target.value))}
                className="border border-border rounded px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Reps"
              />
            </div>
            <div className="text-lg font-semibold text-brand-mint">
              Estimated 1RM: {oneRM} lbs
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plate Calculator Modal */}
      <Dialog
        open={openTool === "plate-calculator"}
        onOpenChange={() => setOpenTool(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plate Calculator</DialogTitle>
            <DialogDescription>
              Find out which plates to load for your target weight.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-weight">Target Weight (lbs)</Label>
                <input
                  id="target-weight"
                  type="number"
                  min={0}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  className="border border-border rounded px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Target Weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bar-weight">Bar Weight (lbs)</Label>
                <input
                  id="bar-weight"
                  type="number"
                  min={0}
                  value={barWeight}
                  onChange={(e) => setBarWeight(Number(e.target.value))}
                  className="border border-border rounded px-3 py-2 w-full bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Bar Weight"
                />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                Plates per side:
              </div>
              {plateSizes.map((size) => (
                <div key={size} className="flex justify-between items-center text-base py-1">
                  <span className="text-foreground">{size} lb plates:</span>
                  <span className="font-bold text-lg text-brand-mint">
                    {plateResult[size]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest Timer Modal */}
      <Dialog
        open={openTool === "rest-timer"}
        onOpenChange={() => setOpenTool(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rest Timer</DialogTitle>
            <DialogDescription>Track your rest between sets.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={10}
                value={restTime}
                onChange={(e) => {
                  setRestTime(Number(e.target.value));
                  setTimerLeft(Number(e.target.value));
                }}
                className="border border-border rounded px-3 py-2 w-1/2 bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="Seconds"
              />
              <Button
                onClick={() => {
                  setTimerRunning(!timerRunning);
                }}
                className="ml-2"
              >
                {timerRunning ? "Pause" : "Start"}
              </Button>
              <Button
                onClick={() => {
                  setTimerLeft(restTime);
                  setTimerRunning(false);
                }}
                variant="outline"
                className="ml-2"
              >
                Reset
              </Button>
            </div>
            <div className="text-4xl font-bold text-center text-brand-mint">
              {formatTime(timerLeft)}
            </div>
            {timerLeft === 0 && (
              <div className="text-center text-green-600 font-semibold">
                Rest Complete!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
