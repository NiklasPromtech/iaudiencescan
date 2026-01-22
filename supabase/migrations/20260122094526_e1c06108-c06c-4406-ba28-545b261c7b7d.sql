-- Create sites table to store user tracking tags
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  site_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  domain TEXT,
  status TEXT NOT NULL DEFAULT 'not_installed' CHECK (status IN ('not_installed', 'receiving', 'active')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Users can view their own sites
CREATE POLICY "Users can view their own sites" 
ON public.sites 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own sites
CREATE POLICY "Users can create their own sites" 
ON public.sites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own sites
CREATE POLICY "Users can update their own sites" 
ON public.sites 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own sites
CREATE POLICY "Users can delete their own sites" 
ON public.sites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_sites_updated_at
BEFORE UPDATE ON public.sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();