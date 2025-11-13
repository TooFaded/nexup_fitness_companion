"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface MealAnalysis {
  foodItems: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

export async function analyzeMealPhoto(
  imageBase64: string
): Promise<{ success: boolean; data?: MealAnalysis; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Call OpenAI Vision API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this meal photo and provide detailed nutritional information. 
                
Return a JSON object with this exact structure:
{
  "foodItems": ["item1", "item2"],
  "calories": total_calories_number,
  "protein": protein_grams_number,
  "carbs": carbs_grams_number,
  "fats": fats_grams_number,
  "confidence": "high/medium/low"
}

Be as accurate as possible with portion sizes. Only return the JSON object, no other text.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(
        `Failed to analyze image: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    const content = result.choices[0].message.content;

    // Sanitize the response to remove Markdown formatting
    const sanitizedContent = content.replace(/```json|```/g, "").trim();

    // Parse the JSON response
    const analysis: MealAnalysis = JSON.parse(sanitizedContent);

    // Save to database
    const { error: dbError } = await supabase.from("meals").insert({
      user_id: user.id,
      food_items: analysis.foodItems,
      calories: analysis.calories,
      protein: analysis.protein,
      carbs: analysis.carbs,
      fats: analysis.fats,
      confidence: analysis.confidence,
      analyzed_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Error saving meal:", dbError);
    }

    revalidatePath("/");
    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error analyzing meal:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze meal photo";
    return { success: false, error: errorMessage };
  }
}

export async function getRecentMeals(limit: number = 10) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .order("analyzed_at", { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getTodaysMacros() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: 0,
    };
  }

  // Get today's date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const { data } = await supabase
    .from("meals")
    .select("calories, protein, carbs, fats")
    .eq("user_id", user.id)
    .gte("analyzed_at", today.toISOString())
    .lt("analyzed_at", tomorrow.toISOString());

  if (!data || data.length === 0) {
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: 0,
    };
  }

  const totals = data.reduce(
    (acc, meal) => ({
      totalCalories: acc.totalCalories + (meal.calories || 0),
      totalProtein: acc.totalProtein + (meal.protein || 0),
      totalCarbs: acc.totalCarbs + (meal.carbs || 0),
      totalFats: acc.totalFats + (meal.fats || 0),
      mealCount: acc.mealCount + 1,
    }),
    {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: 0,
    }
  );

  return totals;
}

export async function logManualMeal(
  mealData: MealAnalysis
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Save to database
    const { error: dbError } = await supabase.from("meals").insert({
      user_id: user.id,
      food_items: mealData.foodItems,
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fats: mealData.fats,
      confidence: mealData.confidence,
      analyzed_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Error saving meal:", dbError);
      return { success: false, error: "Failed to save meal" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error logging meal:", error);
    return { success: false, error: "Failed to log meal" };
  }
}
