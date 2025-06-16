
-- Add missing RLS policies for pickups table
CREATE POLICY "Users can update their own pickup requests"
  ON public.pickups
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pickup requests"
  ON public.pickups
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add missing RLS policies for profiles table
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add database constraints for better data validation
ALTER TABLE public.pickups 
ADD CONSTRAINT phone_format_check 
CHECK (phone ~ '^(\+237|237)?[0-9]{9}$');

ALTER TABLE public.pickups 
ADD CONSTRAINT address_length_check 
CHECK (length(address) >= 10 AND length(address) <= 500);

ALTER TABLE public.pickups 
ADD CONSTRAINT notes_length_check 
CHECK (notes IS NULL OR length(notes) <= 1000);

ALTER TABLE public.pickups 
ADD CONSTRAINT status_check 
CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'));

-- Add constraints for profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT first_name_length_check 
CHECK (first_name IS NULL OR (length(first_name) >= 2 AND length(first_name) <= 50));

ALTER TABLE public.profiles 
ADD CONSTRAINT city_length_check 
CHECK (city IS NULL OR (length(city) >= 2 AND length(city) <= 100));

ALTER TABLE public.profiles 
ADD CONSTRAINT area_length_check 
CHECK (area IS NULL OR (length(area) >= 2 AND length(area) <= 100));
