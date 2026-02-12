import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const requestSchema = z.object({
  email: z.string().trim().email().max(255),
  websiteName: z.string().trim().min(1).max(200),
  inviterName: z.string().trim().min(1).max(200),
});

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
};

const SIGNUP_URL = "https://iaudiencescan.lovable.app/auth";

const buildEmailHtml = (websiteName: string, inviterName: string): string => {
  const safeWebsite = escapeHtml(websiteName);
  const safeInviter = escapeHtml(inviterName);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111111;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:24px 32px;text-align:center;">
              <span style="display:inline-block;background:rgba(0,0,0,0.2);color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:99px;letter-spacing:0.5px;">AUDIENCESCAN</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 16px;">You've been invited</h1>
              <p style="color:#a3a3a3;font-size:15px;line-height:1.6;margin:0 0 24px;">
                <strong style="color:#e5e5e5;">${safeInviter}</strong> has shared analytics access for <strong style="color:#e5e5e5;">${safeWebsite}</strong> with you on AudienceScan.
              </p>
              <p style="color:#a3a3a3;font-size:14px;line-height:1.6;margin:0 0 32px;">
                Create a free account to view traffic analytics, audience insights, and more.
              </p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${SIGNUP_URL}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:10px;">
                      Create your account
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="border-top:1px solid #2a2a2a;padding-top:20px;">
                <p style="color:#666;font-size:12px;line-height:1.5;margin:0;">
                  Once you sign up with this email address, you'll automatically have access to the shared analytics dashboard.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT - only authenticated users can send invites
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !data?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const validated = requestSchema.parse(body);

    const html = buildEmailHtml(validated.websiteName, validated.inviterName);

    await resend.emails.send({
      from: "AudienceScan <onboarding@resend.dev>",
      to: [validated.email],
      subject: `You've been invited to view ${validated.websiteName} on AudienceScan`,
      html,
    });

    console.log(`Invite email sent for ${validated.websiteName}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.issues);
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.error("Error sending invite email:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to send invite email" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
