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

  // --- 2. TAG LOOKUP LOGIC ---
  const variations = [
    endpoint.replace(/#/g, '%23'),   // Standard Encoding
    endpoint.replace(/#/g, '%2523'), // Double Encoding
    endpoint,                        // As-is
    endpoint.replace(/#/g, ''),      // No Hash
  ];

  // FIX: Use filter instead of Set to remove duplicates (ES5 compatible)
  const uniqueVariations = variations.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

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
