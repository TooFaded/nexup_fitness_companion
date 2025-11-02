# Supabase Database Migrations

This folder contains SQL migration files for the Nexup Fitness Companion app.

## Database Schema Overview

### Core Tables

1. **workouts** - Individual workout sessions
2. **exercises** - Exercises within a workout
3. **sets** - Individual sets for each exercise
4. **workout_templates** - Pre-built workout routines (Push/Pull/Legs)
5. **template_exercises** - Exercises associated with templates
6. **user_preferences** - User settings (units, theme, etc.)
7. **personal_records** - Track PRs for exercises
8. **body_weight_logs** - Optional body weight tracking

### Key Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **User isolation** - Users can only access their own data
- ✅ **Auto-updating timestamps** via triggers
- ✅ **Default templates** auto-created on user signup
- ✅ **Cascade deletes** - Clean up related data automatically

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents of each migration file in order:
   - `001_initial_schema.sql`
   - `002_seed_default_templates.sql`
5. Click **Run** for each file

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Make sure you're in the project root
cd /Users/mac/Documents/repos/nexup_fitness_companion

# Link to your Supabase project (if not already linked)
supabase link --project-ref pubtvtzgljmsxqflwbyq

# Push the migrations to your database
supabase db push
```

### Option 3: Manual SQL Execution

1. Open `001_initial_schema.sql`
2. Copy all the SQL
3. Go to Supabase Dashboard → SQL Editor
4. Paste and run
5. Repeat for `002_seed_default_templates.sql`

## Migration Files

### 001_initial_schema.sql

Creates all tables, indexes, RLS policies, and triggers.

**Tables created:**

- workouts
- exercises
- sets
- workout_templates
- template_exercises
- user_preferences
- personal_records
- body_weight_logs

### 002_seed_default_templates.sql

Creates default workout templates (Push/Pull/Legs) for new users.

**Features:**

- Auto-creates templates when user signs up
- Includes pre-populated exercises
- Sets default user preferences

## Verification

After running migrations, verify they worked:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check if default templates are created (after signup)
SELECT * FROM workout_templates;
```

## TypeScript Types

After creating the tables, generate TypeScript types:

```bash
# Using Supabase CLI
supabase gen types typescript --linked > lib/database.types.ts
```

Then import in your Next.js app:

```typescript
import { Database } from "@/lib/database.types";

type Workout = Database["public"]["Tables"]["workouts"]["Row"];
type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
```

## Troubleshooting

### If migrations fail:

1. Check for syntax errors in SQL
2. Ensure you have the correct permissions
3. Try running each section separately

### If RLS blocks queries:

1. Make sure you're authenticated
2. Check that `auth.uid()` matches the user_id in the table
3. Verify policies are created correctly

### If default templates don't appear:

1. Check if the trigger is created: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Manually run: `SELECT create_default_templates_for_user('your-user-id');`

## Next Steps

After migrations are applied:

1. ✅ Verify tables are created
2. ✅ Sign up a new user and check if templates are auto-created
3. ✅ Generate TypeScript types
4. ✅ Create Supabase queries in your Next.js app
5. ✅ Connect components to real data

## Support

For issues with Supabase migrations, check:

- [Supabase Docs - Database](https://supabase.com/docs/guides/database)
- [Supabase Docs - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
