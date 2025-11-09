-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_items text[] NOT NULL,
  calories integer NOT NULL,
  protein numeric(6,1) NOT NULL,
  carbs numeric(6,1) NOT NULL,
  fats numeric(6,1) NOT NULL,
  confidence text NOT NULL CHECK (confidence IN ('high', 'medium', 'low')),
  analyzed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own meals"
ON public.meals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
ON public.meals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
ON public.meals
FOR DELETE
USING (auth.uid() = user_id);

-- Create index
CREATE INDEX meals_user_id_idx ON public.meals(user_id);
CREATE INDEX meals_analyzed_at_idx ON public.meals(analyzed_at DESC);
