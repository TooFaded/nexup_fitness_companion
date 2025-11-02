"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dumbbell, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createWorkout } from "@/lib/actions/workouts";

interface Template {
  id: string;
  name: string;
  description: string | null;
}

interface NewWorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Template[];
}

export function NewWorkoutModal({
  open,
  onOpenChange,
  templates,
}: NewWorkoutModalProps) {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("blank");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWorkout = async () => {
    setIsCreating(true);

    const result = await createWorkout({
      name: workoutName || "Quick Workout",
      templateId: selectedTemplate,
    });

    if (result.error) {
      console.error("Failed to create workout:", result.error);
      setIsCreating(false);
      return;
    }

    if (result.workoutId) {
      onOpenChange(false);
      // Small delay to ensure exercises are inserted
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(`/workout/${result.workoutId}`);
      router.refresh();
    }

    setIsCreating(false);
  };

  const handleClose = () => {
    setWorkoutName("");
    setSelectedTemplate("blank");
    onOpenChange(false);
  };

  const getTemplateIcon = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("push")) return "💪";
    if (nameLower.includes("pull")) return "🔙";
    if (nameLower.includes("leg")) return "🦵";
    return "📋";
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-brand-ember" />
            Start New Workout
          </DialogTitle>
          <DialogDescription>
            Name your workout and choose a template to get started quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Workout Name */}
          <div className="space-y-2">
            <Label htmlFor="workout-name" className="text-base font-semibold">
              Workout Name
            </Label>
            <Input
              id="workout-name"
              placeholder="e.g., Morning Push Day"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-mint" />
              Quick Start Template
            </Label>
            <RadioGroup
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
              className="space-y-2"
            >
              {/* Blank Workout Option */}
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <RadioGroupItem value="blank" id="blank" />
                <Label
                  htmlFor="blank"
                  className="flex-1 cursor-pointer font-normal"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Blank Workout
                      </p>
                      <p className="text-sm text-gray-500">
                        Start from scratch and add exercises as you go
                      </p>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Template Options */}
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <RadioGroupItem value={template.id} id={template.id} />
                  <Label
                    htmlFor={template.id}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {getTemplateIcon(template.name)}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {template.name}
                        </p>
                        {template.description && (
                          <p className="text-sm text-gray-500">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateWorkout}
            className="flex-1 bg-brand-ember hover:bg-brand-ember/90"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Dumbbell className="h-4 w-4 mr-2" />
                Start Workout
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
