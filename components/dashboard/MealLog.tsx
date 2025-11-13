"use client";

import { useEffect, useState } from "react";
import { getRecentMeals, getTodaysMacros } from "@/lib/actions/meals";
import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Meal {
  id: string;
  food_items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
  analyzed_at: string;
}

interface DailyMacros {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  mealCount: number;
}

export default function MealLog() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyMacros, setDailyMacros] = useState<DailyMacros>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    mealCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMeals, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadMeals() {
    setLoading(true);
    const [recentMeals, macros] = await Promise.all([
      getRecentMeals(10),
      getTodaysMacros(),
    ]);
    setMeals(recentMeals);
    setDailyMacros(macros);
    setLoading(false);
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today&apos;s Nutrition</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadMeals}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Daily Macro Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          Daily Totals ({dailyMacros.mealCount} meals)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dailyMacros.totalCalories}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Calories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dailyMacros.totalProtein}g
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {dailyMacros.totalCarbs}g
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {dailyMacros.totalFats}g
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fats</p>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div>
        <h3 className="text-lg font-medium mb-3">Recent Meals</h3>
        {meals.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No meals logged yet. Use the Meal Scanner to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {meal.food_items.join(", ")}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          meal.confidence === "high"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : meal.confidence === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {meal.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(meal.analyzed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {meal.calories}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      cal
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">
                      {meal.protein}g
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      pro
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                      {meal.carbs}g
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      carb
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                      {meal.fats}g
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      fat
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
