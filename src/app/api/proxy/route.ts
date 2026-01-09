import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans?name=...

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- HELPER: NORMALIZE DATA ---
  // This flattens the weird nested structures from the API
  const normalizeResponse = (data: any) => {
    // Case 1: API returns { data: { items: [...] } } (Your observed structure)
    if (data?.data?.items) {
        return { items: data.data.items };
    }
    // Case 2: API returns { items: [...] } (Standard CoC API)
    if (data?.items) {
        return { items: data.items };
    }
    // Case 3: API returns direct Array [...]
    if (Array.isArray(data)) {
        return { items: data };
    }
    // Case 4: Single object (Profile lookup)
    return data;
  };

  // --- 1. SEARCH REQUESTS (Contains '?') ---
  if (endpoint.includes('?')) {
     try {
        const targetUrl = `${BACKEND_URL}${endpoint}`;
        console.log(`[Proxy] Fetching: ${targetUrl}`);

        const res = await fetch(targetUrl, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            cache: 'no-store',
        });

        if (res.ok) {
            const rawData = await res.json();
            // NORMALIZE BEFORE SENDING
            const cleanData = normalizeResponse(rawData);
            
            console.log(`[Proxy] Success. Normalized Keys: ${Object.keys(cleanData)}`);
            if(cleanData.items) console.log(`[Proxy] Items found: ${cleanData.items.length}\n ${cleanData.items}`);
            
            return NextResponse.json(cleanData);
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

  // --- 2. TAG LOOKUP LOGIC ---
  const variations = [
    endpoint.replace(/#/g, '%23'),
    endpoint.replace(/#/g, '%2523'),
    endpoint,
    endpoint.replace(/#/g, ''),
  ];

  // Unique filter
  const uniqueVariations = variations.filter((value, index, self) => self.indexOf(value) === index);

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
        lastErrorStr = `Status ${res.status} on ${path}`;
      }
    } catch (error: any) {
      lastErrorStr = error.message;
    }
  }

  if (successfulData) {
    // Normalize here too just in case
    return NextResponse.json(normalizeResponse(successfulData));
  }

  return NextResponse.json(
    { error: 'Resource Not Found', debug: lastErrorStr },
    { status: 404 }
  );
}
