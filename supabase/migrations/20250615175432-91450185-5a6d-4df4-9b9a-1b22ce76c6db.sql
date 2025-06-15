
-- Add avatar_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;

-- Update the handle_new_user function to include avatar_url
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, city, area, availability_range, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'area',
    new.raw_user_meta_data->>'availability_range',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;
