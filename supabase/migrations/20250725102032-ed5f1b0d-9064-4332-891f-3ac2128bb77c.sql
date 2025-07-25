-- Create table for email submissions
CREATE TABLE public.email_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for telegram handle submissions  
CREATE TABLE public.telegram_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  telegram_handle TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (these are lead collection tables, so we'll allow inserts but restrict access)
ALTER TABLE public.email_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for lead collection), but no one can read without proper access
CREATE POLICY "Allow public insert on email submissions" 
ON public.email_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public insert on telegram submissions" 
ON public.telegram_submissions 
FOR INSERT 
WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX idx_email_submissions_created_at ON public.email_submissions(created_at);
CREATE INDEX idx_telegram_submissions_created_at ON public.telegram_submissions(created_at);