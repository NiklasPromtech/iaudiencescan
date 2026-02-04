-- Create touchpoints table for marketing activities
CREATE TABLE public.touchpoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id TEXT NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'single' CHECK (event_type IN ('single', 'range')),
  timestamp TIMESTAMP WITH TIME ZONE,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  color TEXT DEFAULT '#8b5cf6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.touchpoints ENABLE ROW LEVEL SECURITY;

-- Users can view touchpoints for websites they have access to
CREATE POLICY "Users can view touchpoints for their websites"
ON public.touchpoints
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.websites w
    WHERE w.id = touchpoints.website_id
    AND w.user_id = (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
  )
  OR
  EXISTS (
    SELECT 1 FROM public.website_shares ws
    WHERE ws.website_id = touchpoints.website_id
    AND (ws.user_id = (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text))
  )
);

-- Users can create touchpoints for their websites
CREATE POLICY "Users can create touchpoints for their websites"
ON public.touchpoints
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.websites w
    WHERE w.id = touchpoints.website_id
    AND w.user_id = (SELECT id FROM public.users WHERE supabase_id = auth.uid()::text)
  )
);

-- Users can update their own touchpoints
CREATE POLICY "Users can update their own touchpoints"
ON public.touchpoints
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own touchpoints
CREATE POLICY "Users can delete their own touchpoints"
ON public.touchpoints
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_touchpoints_updated_at
BEFORE UPDATE ON public.touchpoints
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_touchpoints_website_id ON public.touchpoints(website_id);
CREATE INDEX idx_touchpoints_timestamp ON public.touchpoints(timestamp);
CREATE INDEX idx_touchpoints_date_range ON public.touchpoints(start_date, end_date);