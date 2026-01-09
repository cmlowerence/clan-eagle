import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans?name=test

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- 1. SEARCH/FILTER OPTIMIZATION ---
  // If the request contains '?', it is a search or list request (e.g. ?name=... or ?limit=...).
  // These do not involve hashtags that need complex encoding variations.
  // We fetch these DIRECTLY to avoid unnecessary 404 loops.
  if (endpoint.includes('?')) {
     try {
        const targetUrl = `${BACKEND_URL}${endpoint}`;
        
        const res = await fetch(targetUrl, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            cache: 'no-store',
        });

        // Forward the exact status code from the backend
        if (res.ok) {
            const data = await res.json();
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { error: `Backend API Error: ${res.status}` }, 
                { status: res.status }
            );
        }
     } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
     }
  }

  // --- 2. TAG LOOKUP LOGIC (Legacy Support) ---
  // For endpoints like /clans/#TAG or /players/#TAG.
  // We try multiple variations to ensure the API accepts the tag format 
  // (Raw #, Encoded %23, Double Encoded %2523, or No Hash).
  const variations = [
    endpoint.replace(/#/g, '%23'),   // Standard Encoding
    endpoint.replace(/#/g, '%2523'), // Double Encoding (fixes some proxies)
    endpoint,                        // As-is (in case it's already correct)
    endpoint.replace(/#/g, ''),      // No Hash (fallback)
  ];

  // Remove duplicates to avoid calling the same URL multiple times
  const uniqueVariations = [...new Set(variations)];

  let lastErrorStr = '';
  let successfulData = null;

  for (const path of uniqueVariations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    try {
      const res = await fetch(targetUrl, {
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        cache: 'no-store',
      });

      if (res.ok) {
        successfulData = await res.json();
        break; // Stop loop on first success
      } else {
        lastErrorStr = `Status ${res.status} on ${path}`;
      }
    } catch (error: any) {
      lastErrorStr = error.message;
    }
  }

  if (successfulData) {
    return NextResponse.json(successfulData);
  }

  // If all variations fail
  return NextResponse.json(
    { error: 'Resource Not Found', debug: lastErrorStr },
    { status: 404 }
  );
}
