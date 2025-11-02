"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description?: string;
}

interface QuickTemplatesProps {
  templates?: Template[];
  onSelectTemplate?: (templateId: string) => void;
}

// Default emojis for common template names
const getTemplateEmoji = (name: string): string => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("push")) return "💪";
  if (nameLower.includes("pull")) return "🔙";
  if (nameLower.includes("leg")) return "🦵";
  if (nameLower.includes("upper")) return "�";
  if (nameLower.includes("lower")) return "🦵";
  if (nameLower.includes("full")) return "🏋️";
  return "📋"; // Default emoji
};

export default function QuickTemplates({
  templates = [],
  onSelectTemplate,
}: QuickTemplatesProps) {
  const handleSelectTemplate = (templateId: string) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    } else {
      // Default behavior
      console.log(`Selected template: ${templateId}`);
      // TODO: Navigate to /workout/template/:id when that route is created
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quick Templates</CardTitle>
        <CardDescription>Start from a pre-built routine</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No templates yet</p>
            <p className="text-xs mt-1">Create your first workout template</p>
          </div>
        ) : (
          templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleSelectTemplate(template.id)}
            >
              {getTemplateEmoji(template.name)} {template.name}
            </Button>
          ))
        )}
      </CardContent>
    </Card>
  );
}
