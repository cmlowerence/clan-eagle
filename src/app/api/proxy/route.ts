import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans?name=test

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // OPTIMIZATION: Only loop variations if it's a Tag look-up (contains #)
  // Otherwise, just fetch the endpoint directly (for searches/leaderboards)
  if (!endpoint.includes('#')) {
     try {
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });
        if(res.ok) return NextResponse.json(await res.json());
        return NextResponse.json({ error: `API Error: ${res.status}` }, { status: res.status });
     } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
     }
  }

  // Existing logic for Tags (try variations)
  const variations = [
    endpoint.replace(/#/g, '%23'),   
    endpoint.replace(/#/g, '%2523'), 
    endpoint.replace(/#/g, ''),      
  ];

  let lastErrorStr = '';
  let successfulData = null;

  for (const path of variations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    try {
      const res = await fetch(targetUrl, {
        headers: { 'Content-Type': 'application/json' },
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
    { error: 'Backend Fetch Failed', debug: lastErrorStr },
    { status: 404 }
  );
}
