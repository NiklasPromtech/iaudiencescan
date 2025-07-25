import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'email' | 'telegram';
  value: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, value, timestamp }: NotificationRequest = await req.json();
    
    console.log(`New ${type} submission:`, value);

    const emailResponse = await resend.emails.send({
      from: "Notifications <onboarding@resend.dev>",
      to: ["your-email@example.com"], // Replace with your email
      subject: `New ${type === 'email' ? 'Email' : 'Telegram'} Submission`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Type:</strong> ${type === 'email' ? 'Email Address' : 'Telegram Handle'}</p>
        <p><strong>Value:</strong> ${value}</p>
        <p><strong>Submitted at:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <hr>
        <p>This submission was received through your website's "Get Free Analysis" form.</p>
      `,
    });

    console.log("Notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);