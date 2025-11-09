# Manual Food Logging Feature

## Overview

Added manual food entry option alongside AI photo scanning, giving users two ways to track their meals.

## Features Added

### 1. Dual Entry Options

- **Photo Upload**: AI-powered meal analysis using GPT-4 Vision
- **Manual Entry**: Direct input of food items and macros

### 2. User Interface

- Clean initial view with two clear options
- Visual "OR" separator between options
- Seamless switching between modes

### 3. Manual Entry Form

- Food items input (comma-separated list)
- Macro inputs: Calories, Protein, Carbs, Fats
- Form validation
- Loading state during save
- Error handling

### 4. Results Display

- Same unified results view for both methods
- Hides "Confidence" field for manual entries
- "Log Another Meal" button resets to initial view

## Updated Files

### `components/dashboard/MealScanner.tsx`

- Added `ViewMode` type: "initial" | "photo" | "manual"
- Added manual entry form fields
- Implemented form validation
- Added mode switching logic
- Unified results display

### `lib/actions/meals.ts`

- Added `logManualMeal()` server action
- Saves manual entries to database with "manual" confidence
- Same database structure as AI-analyzed meals

## User Flow

### Photo Path:

1. Click "Upload Meal Photo"
2. Select/take photo
3. Wait for AI analysis (5-10s)
4. View results
5. Log another meal

### Manual Path:

1. Click "Manually Log Food"
2. Enter food items (comma-separated)
3. Enter macros (calories, protein, carbs, fats)
4. Click "Log Meal"
5. View results
6. Log another meal

## Benefits

- ✅ Works without OpenAI API key
- ✅ Faster for users who know their macros
- ✅ Useful when photo quality is poor
- ✅ Great for meal prep (known portions)
- ✅ No API costs for manual entries
- ✅ Same database storage for both methods

## Database

Both methods save to the same `meals` table with identical structure. Manual entries use `confidence: "manual"` instead of "high/medium/low".

## Styling

- Full dark mode support
- Semantic color tokens
- Consistent with app design system
- Mobile-optimized layout
