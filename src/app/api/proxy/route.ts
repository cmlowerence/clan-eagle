import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans?name=test

  // DEBUG LOG 1: Check what the proxy received
  console.log(`[Proxy] Incoming endpoint:`, endpoint);

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- 1. SEARCH LOGIC ---
  if (endpoint.includes('?')) {
     try {
        const targetUrl = `${BACKEND_URL}${endpoint}`;
        
        // DEBUG LOG 2: Check the final URL being hit
        console.log(`[Proxy] Fetching Target (Search):`, targetUrl);

        const res = await fetch(targetUrl, {
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            cache: 'no-store',
        });

        // DEBUG LOG 3: Check response status
        console.log(`[Proxy] Response Status:`, res.status);

        if (res.ok) {
            const data = await res.json();
            // DEBUG LOG 4: Check if data has items (print keys only to keep logs clean)
            console.log(`[Proxy] Response Keys:`, Object.keys(data));
            if (data.data) console.log(`[Proxy] Nested Data Keys:`, Object.keys(data.data));
            
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { error: `Backend API Error: ${res.status}` }, 
                { status: res.status }
            );
        }
     } catch(e: any) {
        console.error(`[Proxy] Fetch Error:`, e.message);
        return NextResponse.json({ error: e.message }, { status: 500 });
     }
  }

  // --- 2. TAG LOGIC ---
  // ... (Keep your existing tag logic here, omitted for brevity but keep it in your file) ...
  // For debugging purposes, you can just paste the search part above first.
  
  // (Rest of the file remains same as previous working version)
  const variations = [
    endpoint.replace(/#/g, '%23'),
    endpoint.replace(/#/g, '%2523'),
    endpoint,
    endpoint.replace(/#/g, ''),
  ];

  const uniqueVariations = variations.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

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
    return NextResponse.json(successfulData);
  }

  return NextResponse.json(
    { error: 'Resource Not Found', debug: lastErrorStr },
    { status: 404 }
  );
}
