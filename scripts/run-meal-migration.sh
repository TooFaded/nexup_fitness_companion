#!/bin/bash

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

# Run the migration
echo "Running meal table migration..."
psql "${SUPABASE_DB_URL}" -f supabase/migrations/004_create_meals_table.sql

echo "Migration completed!"
