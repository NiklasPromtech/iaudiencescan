import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYTICS_API_URL = "https://cdn.audiencescan.io/api";

const ALLOWED_PATHS = [
  "/analytics/scorecard",
  "/analytics/table",
  "/analytics/bots",
  "/analytics/filtering",
];

function isAllowedPath(path: string): boolean {
  if (ALLOWED_PATHS.includes(path)) return true;
  if (path.startsWith("/analytics/tracking-status/")) return true;
  return false;
}

async function hashKey(key: string): Promise<string> {
  const encoded = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract API key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer as_k_")) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = authHeader.replace("Bearer ", "");
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

    // Resolve proxy path
    const url = new URL(req.url);
    // Path after /api-proxy, e.g. /analytics/scorecard
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

    // Forward request to backend
    const targetUrl = `${ANALYTICS_API_URL}${proxyPath}`;
    const forwardHeaders: Record<string, string> = {
      "Content-Type": req.headers.get("Content-Type") || "application/json",
      "X-Service-Key": serviceKey,
      "X-User-Id": keyRow.user_id,
      "X-Website-Id": keyRow.website_id,
    };

    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body: req.method !== "GET" ? await req.text() : undefined,
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
