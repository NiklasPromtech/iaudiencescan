-- Add last_selected_website_id to profiles table
ALTER TABLE public.profiles 
ADD COLUMN last_selected_website_id text;

-- Add a comment for documentation
COMMENT ON COLUMN public.profiles.last_selected_website_id IS 'Stores the ID of the last selected website for persistence across sessions';