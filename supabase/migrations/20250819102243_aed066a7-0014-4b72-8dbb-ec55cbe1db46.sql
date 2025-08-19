-- Fix security vulnerability: Restrict SELECT access to email_submissions table
-- This prevents public harvesting of email addresses
CREATE POLICY "Restrict SELECT access to email submissions" 
ON public.email_submissions 
FOR SELECT 
USING (false);

-- Fix security vulnerability: Restrict SELECT access to telegram_submissions table  
-- This prevents public harvesting of telegram handles
CREATE POLICY "Restrict SELECT access to telegram submissions"
ON public.telegram_submissions
FOR SELECT
USING (false);