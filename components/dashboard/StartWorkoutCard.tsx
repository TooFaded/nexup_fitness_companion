"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import { NewWorkoutModal } from "../modals/NewWorkoutModal";

interface Template {
  id: string;
  name: string;
  description: string | null;
}

interface StartWorkoutCardProps {
  templates?: Template[];
}

export default function StartWorkoutCard({
  templates = [],
}: StartWorkoutCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Card className="border-2 border-brand-ember">
        <CardHeader>
          <CardTitle className="text-xl">Start a Workout</CardTitle>
          <CardDescription>
            Begin tracking your training session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full bg-brand-ember hover:bg-brand-ember/90 text-white"
          >
            <Dumbbell className="mr-2 h-5 w-5" />
            New Workout
          </Button>
        </CardContent>
      </Card>

      <NewWorkoutModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        templates={templates}
      />
    </>
  );
}
