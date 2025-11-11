"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkoutName } from "@/lib/actions/workouts";

interface EditableWorkoutTitleProps {
  workoutId: string;
  initialName: string;
}

export function EditableWorkoutTitle({
  workoutId,
  initialName,
}: EditableWorkoutTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!name.trim()) {
      setName(initialName);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const result = await updateWorkoutName(workoutId, name.trim());

    if (result.error) {
      console.error("Failed to update workout name:", result.error);
      setName(initialName);
    }

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold h-10 max-w-md"
          disabled={isSaving}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          className="h-8 w-8 text-gray-600 hover:text-gray-700 hover:bg-gray-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <h1 className="text-2xl font-bold text-foreground">{name}</h1>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsEditing(true)}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
