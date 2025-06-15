
-- Create a table for pickup requests
CREATE TABLE public.pickups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  volume TEXT NOT NULL,
  price TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to insert their own pickup requests
CREATE POLICY "Users can create their own pickup requests"
  ON public.pickups
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to view their own pickup requests
CREATE POLICY "Users can view their own pickup requests"
  ON public.pickups
  FOR SELECT
  USING (auth.uid() = user_id);

