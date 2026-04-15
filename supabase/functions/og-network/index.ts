import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Known crawler user agents
const crawlerPatterns = [
  'Telegrambot',
  'TelegramBot',
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'WhatsApp',
  'Slackbot',
  'Discordbot',
  'Pinterest',
  'Googlebot',
  'bingbot',
];

function isCrawler(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return crawlerPatterns.some(pattern => userAgent.includes(pattern));
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const studyId = url.searchParams.get('id');
    const userAgent = req.headers.get('user-agent');
    
    console.log(`OG Network request - studyId: ${studyId}, userAgent: ${userAgent}`);

    if (!studyId) {
      return new Response('Missing study ID', { status: 400, headers: corsHeaders });
    }

    // Validate studyId format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const safeIdRegex = /^[a-zA-Z0-9_-]{1,128}$/;
    if (!uuidRegex.test(studyId) && !safeIdRegex.test(studyId)) {
      return new Response('Invalid study ID format', { status: 400, headers: corsHeaders });
    }

    const appUrl = `https://audiencescan.io/network/${studyId}`;
    const ogImageUrl = 'https://audiencescan.io/og-network-preview.png';

    // If not a crawler, redirect to the actual page
    if (!isCrawler(userAgent)) {
      console.log('Not a crawler, redirecting to app');
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': appUrl,
        },
      });
    }

    // Fetch study data to get the primary token
    let title = 'Token Network | AudienceScan';
    let description = 'Discover related tokens through on-chain audience intelligence. Web3 marketing powered by real wallet data.';
    let tokenCount = 0;

    try {
      console.log(`Fetching study data for ${studyId}`);
      const response = await fetch(`https://token-analysis-final.nw.r.appspot.com/chart/${studyId}`);
      
      if (response.ok) {
        const tokens = await response.json();
        if (tokens && tokens.length > 0) {
          const primaryToken = tokens[0];
          tokenCount = tokens.length;
          title = `${primaryToken.ticker} Token Network | AudienceScan`;
          description = `Explore ${tokenCount} related tokens in the ${primaryToken.ticker} community network. On-chain audience intelligence for Web3 marketing.`;
          console.log(`Found ${tokenCount} tokens, primary: ${primaryToken.ticker}`);
        }
      }
    } catch (fetchError) {
      console.error('Error fetching study data:', fetchError);
    }

    // Return HTML with OG tags for crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${appUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="AudienceScan">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${appUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImageUrl}">
  
  <!-- Telegram specific -->
  <meta property="og:image:alt" content="${title}">
  
  <!-- Redirect for browsers that somehow render this -->
  <meta http-equiv="refresh" content="0;url=${appUrl}">
</head>
<body>
  <p>Redirecting to <a href="${appUrl}">${title}</a>...</p>
</body>
</html>`;

    console.log('Returning OG HTML for crawler');
    
    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error in og-network function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
