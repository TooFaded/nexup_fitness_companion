"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Upload, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { analyzeMealPhoto, logManualMeal } from "@/lib/actions/meals";

interface MealAnalysis {
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

type ViewMode = "initial" | "photo" | "manual";

export default function MealScanner() {
  const [viewMode, setViewMode] = useState<ViewMode>("initial");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual entry state
  const [manualFood, setManualFood] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFats, setManualFats] = useState("");

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError(null);
    setAnalysis(null);
    setViewMode("photo");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Convert to base64 and analyze
    setIsAnalyzing(true);
    const base64Reader = new FileReader();
    base64Reader.onloadend = async () => {
      const base64String = (base64Reader.result as string).split(",")[1];

      const result = await analyzeMealPhoto(base64String);

      setIsAnalyzing(false);

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || "Failed to analyze meal");
      }
    };
    base64Reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleManualSubmit = async () => {
    if (
      !manualFood ||
      !manualCalories ||
      !manualProtein ||
      !manualCarbs ||
      !manualFats
    ) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    const mealData = {
      foodItems: manualFood.split(",").map((item) => item.trim()),
      calories: parseInt(manualCalories),
      protein: parseFloat(manualProtein),
      carbs: parseFloat(manualCarbs),
      fats: parseFloat(manualFats),
      confidence: "manual",
    };

    const result = await logManualMeal(mealData);
    setIsAnalyzing(false);

    if (result.success) {
      setAnalysis(mealData);
    } else {
      setError(result.error || "Failed to log meal");
    }
  };

  const resetScanner = () => {
    setViewMode("initial");
    setAnalysis(null);
    setError(null);
    setPreviewUrl(null);
    setManualFood("");
    setManualCalories("");
    setManualProtein("");
    setManualCarbs("");
    setManualFats("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-brand-ember" />
          Meal Scanner
        </CardTitle>
        <CardDescription>
          Take a photo of your meal to get instant macro tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {viewMode === "initial" && (
          <div className="space-y-3">
            <Button
              onClick={handleButtonClick}
              className="w-full bg-brand-mint hover:bg-brand-mint/90 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Meal Photo
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              onClick={() => setViewMode("manual")}
              variant="outline"
              className="w-full"
            >
              <Edit className="mr-2 h-4 w-4" />
              Manually Log Food
            </Button>
          </div>
        )}

        {viewMode === "manual" && !analysis && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food-name">Food Items (comma-separated)</Label>
              <Input
                id="food-name"
                placeholder="e.g., Grilled Chicken, Rice, Broccoli"
                value={manualFood}
                onChange={(e) => setManualFood(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min={0}
                  placeholder="500"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="45"
                  value={manualProtein}
                  onChange={(e) => setManualProtein(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="50"
                  value={manualCarbs}
                  onChange={(e) => setManualCarbs(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  min={0}
                  step="0.1"
                  placeholder="15"
                  value={manualFats}
                  onChange={(e) => setManualFats(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={resetScanner}
                variant="outline"
                className="flex-1"
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleManualSubmit}
                className="flex-1 bg-brand-mint hover:bg-brand-mint/90 text-white"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Log Meal"
                )}
              </Button>
            </div>
          </div>
        )}

        {viewMode === "photo" && previewUrl && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Meal preview"
                className="w-full rounded-lg object-cover max-h-64"
              />
              {!analysis && !isAnalyzing && (
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                  ✕
                </Button>
              )}
            </div>

            {isAnalyzing && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing your meal...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-500 text-sm">{error}</p>
                <Button
                  onClick={resetScanner}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  Try Again
                </Button>
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                <div className="p-4 bg-brand-mint/10 border border-brand-mint/20 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">
                    Detected Foods:
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    {analysis.foodItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Calories
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.calories}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Protein
                    </p>
                    <p className="text-2xl font-bold text-brand-mint">
                      {analysis.protein}g
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Carbs
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.carbs}g
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase">
                      Fats
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.fats}g
                    </p>
                  </div>
                </div>

                {analysis.confidence !== "manual" && (
                  <p className="text-xs text-muted-foreground text-center">
                    Confidence:{" "}
                    <span className="capitalize">{analysis.confidence}</span>
                  </p>
                )}

                <Button
                  onClick={resetScanner}
                  variant="outline"
                  className="w-full"
                >
                  Log Another Meal
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
