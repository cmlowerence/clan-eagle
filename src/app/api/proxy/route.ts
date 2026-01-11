import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint'); 
  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // [DEBUG] 1. Log the incoming request
  console.log(`[Proxy-Start] Raw Endpoint Param: "${endpoint}"`);

  if (!endpoint) {
    console.error('[Proxy-Error] Endpoint missing');
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  // --- HELPER: NORMALIZE RESPONSE ---
  // Flattens nested data structures from the API
  const normalizeResponse = (data: any) => {
    if (data?.data?.items) return { items: data.data.items };
    if (data?.items) return { items: data.items };
    if (Array.isArray(data)) return { items: data };
    return data;
  };

  // --- STEP 1: NORMALIZE ENDPOINT ---
  // Ensure the endpoint starts with a slash
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }
  
  // [DEBUG] 2. Log normalized endpoint
  console.log(`[Proxy-Step1] Normalized Endpoint: "${endpoint}"`);

  // --- STEP 2: DETERMINE LOGIC PATH ---
  // Split by slash to count segments. Filter(Boolean) removes empty strings.
  // Example: "/clans/#TAG/currentwar" -> ["clans", "#TAG", "currentwar"] (Length 3)
  const parts = endpoint.split('/').filter(Boolean);
  
  // Logic: If it has params (?) OR has more than 2 segments (e.g. clan + tag + resource), it's complex.
  const isComplexRequest = endpoint.includes('?') || parts.length > 2;

  console.log(`[Proxy-Step2] Is Complex Request? ${isComplexRequest} (Segments: ${parts.length})`);

  // --- STEP 3: HANDLE COMPLEX REQUESTS (Raid Seasons, War, etc.) ---
  if (isComplexRequest) {
    try {
      // CRITICAL: Next.js decodes the param, so we have a raw '#'.
      // We MUST encode it back to '%23' for the external API to recognize it as part of the path.
      // We use a global replace to handle any hash found.
      const safeEndpoint = endpoint.replace(/#/g, '%23');
      const targetUrl = `${BACKEND_URL}${safeEndpoint}`;
      
      console.log(`[Proxy-Complex] Fetching Target: ${targetUrl}`);

      const res = await fetch(targetUrl, {
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        cache: 'no-store',
      });

      console.log(`[Proxy-Complex] Response Status: ${res.status}`);

      if (res.ok) {
        const rawData = await res.json();
        return NextResponse.json(normalizeResponse(rawData));
      } else {
        // If 404/403/500, return detailed error to frontend
        const errorText = await res.text();
        console.error(`[Proxy-Complex-Error] Body: ${errorText.slice(0, 100)}`); // Log first 100 chars
        return NextResponse.json(
            { error: `Backend API Error: ${res.status}`, details: errorText }, 
            { status: res.status }
        );
      }
    } catch(e: any) {
      console.error(`[Proxy-Exception] ${e.message}`);
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // --- STEP 4: HANDLE SIMPLE LOOKUPS (Profile/Clan Info) ---
  // If we are here, it's a simple path like "/clans/#TAG" or "/players/#TAG".
  // We try variations to handle encoding mismatches robustly.
  
  const variations = [
    endpoint.replace(/#/g, '%23'),   // Priority 1: Standard encoded (%23TAG)
    endpoint.replace(/#/g, '%2523'), // Priority 2: Double encoded (%2523TAG) - rare but possible
    endpoint,                        // Priority 3: Raw (#TAG) - usually fails but good fallback
  ];

  // Unique set to avoid duplicate requests
  const uniqueVariations = Array.from(new Set(variations));
  console.log(`[Proxy-Simple] Loop variations: ${JSON.stringify(uniqueVariations)}`);

  let successfulData = null;
  let lastErrorStr = '';

  for (const path of uniqueVariations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    
    try {
      console.log(`[Proxy-Simple-Attempt] Fetching: ${targetUrl}`);
      const res = await fetch(targetUrl, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        console.log(`[Proxy-Simple-Success] Data found at: ${path}`);
        successfulData = await res.json();
        break; 
      } else {
        lastErrorStr = `Status ${res.status}`;
      }
    } catch (error: any) {
      lastErrorStr = error.message;
      console.error(`[Proxy-Simple-Fail] ${error.message}`);
    }
  }

  if (successfulData) {
    return NextResponse.json(normalizeResponse(successfulData));
  }

  console.error(`[Proxy-Final-Fail] All attempts failed. Last error: ${lastErrorStr}`);
  return NextResponse.json(
    { error: 'Resource Not Found', debug: lastErrorStr },
    { status: 404 }
  );
}
