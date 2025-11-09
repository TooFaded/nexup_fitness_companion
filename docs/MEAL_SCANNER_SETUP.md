# Meal Scanner Setup Guide

## Prerequisites

- OpenAI API account with access to GPT-4o model
- Supabase project with database access

## Setup Steps

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (it starts with `sk-`)

### 2. Update Environment Variables

Add the following to your `.env.local` file:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Run Database Migration

You have two options:

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/004_create_meals_table.sql`
4. Paste and run the SQL in the editor

**Option B: Using the migration script**

```bash
./scripts/run-meal-migration.sh
```

### 4. Deploy to Vercel

Add the environment variable to Vercel:

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `OPENAI_API_KEY` with your OpenAI API key
4. Redeploy your application

## How to Use

1. Navigate to the dashboard
2. Find the "Meal Scanner" card
3. Click "Upload Meal Photo"
4. Take a photo or select an image from your device
5. Wait for AI analysis (5-10 seconds)
6. View detected foods and macro breakdown
7. Meal is automatically saved to your history

## Features

- ✅ AI-powered food recognition
- ✅ Automatic macro calculation (calories, protein, carbs, fats)
- ✅ Confidence scoring
- ✅ Meal history storage
- ✅ Dark mode support
- ✅ Mobile camera support

## Cost Estimates

- GPT-4o Vision API: ~$0.01-0.03 per image analysis
- Consider implementing usage limits or caching for production

## Troubleshooting

**"Failed to analyze meal photo"**

- Check your OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Verify the image is under 5MB

**"Not authenticated"**

- Make sure you're logged in
- Check Supabase session is valid

**Database errors**

- Ensure migration has been run
- Check RLS policies are enabled
