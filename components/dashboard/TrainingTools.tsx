"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const handleSelectTool = (toolId: string) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    } else {
      // Default behavior
      console.log(`Selected tool: ${toolId}`);
      // TODO: Navigate to /tools/:id when those routes are created
    }
  };

  return (
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
            onClick={() => handleSelectTool(tool.id)}
          >
            {tool.emoji} {tool.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
