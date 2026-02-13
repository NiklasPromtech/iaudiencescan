import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYTICS_API_URL = "https://cdn.audiencescan.io/api";

const ALLOWED_PATHS = [
  "/analytics/scorecard",
  "/analytics/table",
];

function isAllowedPath(path: string): boolean {
  return ALLOWED_PATHS.includes(path);
}

async function hashKey(key: string): Promise<string> {
  const encoded = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract API key from X-Api-Key header (or fallback to Authorization for backwards compat)
    const apiKey = req.headers.get("X-Api-Key") || req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!apiKey?.startsWith("as_k_")) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing API key. Pass it via X-Api-Key header." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const keyHash = await hashKey(apiKey);

    // Validate key using service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: keyRow, error: keyError } = await supabase
      .from("api_keys")
      .select("id, user_id, website_id")
      .eq("key_hash", keyHash)
      .is("revoked_at", null)
      .single();

    if (keyError || !keyRow) {
      return new Response(
        JSON.stringify({ error: "Invalid or revoked API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update last_used_at (fire and forget)
    supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRow.id)
      .then(() => {});

    // Fetch tag_id from websites table
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("tag_id")
      .eq("id", keyRow.website_id)
      .single();

    if (websiteError || !website?.tag_id) {
      return new Response(
        JSON.stringify({ error: "No website linked to this API key" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Resolve proxy path
    const url = new URL(req.url);
    const proxyPath = url.pathname.replace(/^\/api-proxy/, "").replace(/^\/+/, "/");

    if (!isAllowedPath(proxyPath)) {
      return new Response(
        JSON.stringify({ error: "Endpoint not allowed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceKey = Deno.env.get("API_PROXY_SERVICE_KEY");
    if (!serviceKey) {
      return new Response(
        JSON.stringify({ error: "Proxy not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse body and inject tag_id
    let body: Record<string, unknown> = {};
    if (req.method !== "GET") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }
    body.tag_id = website.tag_id;

    // Forward request to backend
    const targetUrl = `${ANALYTICS_API_URL}${proxyPath}`;
    const forwardHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Service-Key": serviceKey,
      "X-User-Id": keyRow.user_id,
      "X-Website-Id": keyRow.website_id,
    };

    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: JSON.stringify(body),
    });

    const responseBody = await backendResponse.text();
    return new Response(responseBody, {
      status: backendResponse.status,
      headers: {
        ...corsHeaders,
        "Content-Type": backendResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal proxy error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
