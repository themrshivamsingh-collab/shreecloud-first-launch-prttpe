import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PANEL_URL = Deno.env.get('PTERODACTYL_PANEL_URL');
    const API_KEY = Deno.env.get('PTERODACTYL_API_KEY');

    if (!PANEL_URL) throw new Error('PTERODACTYL_PANEL_URL is not configured');
    if (!API_KEY) throw new Error('PTERODACTYL_API_KEY is not configured');

    const { endpoint, method = 'GET', body } = await req.json();

    if (!endpoint || typeof endpoint !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing endpoint parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only allow client API endpoints (not admin)
    if (!endpoint.startsWith('/api/client')) {
      return new Response(JSON.stringify({ error: 'Only client API endpoints are allowed' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const panelUrl = PANEL_URL.replace(/\/+$/, '');
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${panelUrl}${endpoint}`, fetchOptions);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Pterodactyl proxy error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
