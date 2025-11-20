import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const requestSchema = z.object({
  type: z.enum(['email', 'telegram']),
  value: z.string().trim().min(1).max(255),
  timestamp: z.string()
});

// HTML escape function to prevent XSS
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Simple rate limiting store (in-memory, resets on function restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);
  
  if (!limit || now > limit.resetAt) {
    // Reset or initialize with 1 hour window
    rateLimitStore.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  
  if (limit.count >= 5) {
    return false; // Rate limit exceeded
  }
  
  limit.count++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Validate and parse request
    const requestData = await req.json();
    const validated = requestSchema.parse(requestData);
    
    // Log submission without PII
    console.log(`New ${validated.type} submission received at ${validated.timestamp}`);

    // Escape user input to prevent XSS in email
    const safeValue = escapeHtml(validated.value);
    const safeTimestamp = escapeHtml(new Date(validated.timestamp).toLocaleString());

    const emailResponse = await resend.emails.send({
      from: "Notifications <onboarding@resend.dev>",
      to: ["niklas@audiencescan.io"],
      subject: `New ${validated.type === 'email' ? 'Email' : 'Telegram'} Submission`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Type:</strong> ${validated.type === 'email' ? 'Email Address' : 'Telegram Handle'}</p>
        <p><strong>Value:</strong> ${safeValue}</p>
        <p><strong>Submitted at:</strong> ${safeTimestamp}</p>
        <hr>
        <p>This submission was received through your website's "Get Free Analysis" form.</p>
      `,
    });

    console.log("Notification email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    // Check if it's a validation error
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.error("Error processing submission:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to process submission" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);