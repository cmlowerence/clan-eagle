import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint'); // e.g., clans/#TAG/currentwar

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- HELPER: NORMALIZE DATA ---
  const normalizeResponse = (data: any) => {
    if (data?.data?.items) return { items: data.data.items };
    if (data?.items) return { items: data.items };
    if (Array.isArray(data)) return { items: data };
    return data;
  };

  // --- STEP 1: PREPARE ENDPOINT ---
  // Ensure leading slash for consistency
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }

  // --- STEP 2: DETERMINE REQUEST TYPE ---
  // A "Complex" request is anything that isn't just a basic profile lookup.
  // Examples: /clans/#TAG/currentwar, /clans/#TAG/capitalraidseasons, /leagues/...
  // A basic lookup is roughly: /clans/#TAG or /players/#TAG
  const parts = endpoint.split('/').filter(Boolean); // Filter removes empty strings from leading slash
  const isComplexRequest = endpoint.includes('?') || parts.length > 2;

  // --- STEP 3: HANDLE COMPLEX REQUESTS (Single Try) ---
  if (isComplexRequest) {
    try {
      // 1. Force encode the hash. 
      //    We use a global replace because Next.js decodes the param automatically.
      //    '#' becomes '%23'.
      const safeEndpoint = endpoint.replace(/#/g, '%23');
      const targetUrl = `${BACKEND_URL}${safeEndpoint}`;
      
      console.log(`[Proxy] Fetching Complex: ${targetUrl}`);

      const res = await fetch(targetUrl, {
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const rawData = await res.json();
        return NextResponse.json(normalizeResponse(rawData));
      } else {
        // If we get a 404 here (e.g., Clan not in war), we MUST return it as is.
        // Do NOT retry variations for sub-paths.
        console.error(`[Proxy] Complex Error ${res.status} on ${targetUrl}`);
        return NextResponse.json(
            { error: `Backend API Error: ${res.status}` }, 
            { status: res.status }
        );
      }
    } catch(e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // --- STEP 4: HANDLE SIMPLE LOOKUPS (Retry Logic) ---
  // Only for paths like /clans/#TAG where 404 might actually be an encoding mismatch.
  const variations = [
    endpoint.replace(/#/g, '%23'),   // Standard encoded
    endpoint.replace(/#/g, '%2523'), // Double encoded
    endpoint,                        // Raw
  ];

  const uniqueVariations = Array.from(new Set(variations));
  let lastErrorStr = '';
  let successfulData = null;

  for (const path of uniqueVariations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    try {
      const res = await fetch(targetUrl, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        successfulData = await res.json();
        break; 
      } else {
        lastErrorStr = `Status ${res.status}`;
      }
    } catch (error: any) {
      lastErrorStr = error.message;
    }
  }

  if (successfulData) {
    return NextResponse.json(normalizeResponse(successfulData));
  }

  return NextResponse.json(
    { error: 'Resource Not Found', debug: lastErrorStr },
    { status: 404 }
  );
}
