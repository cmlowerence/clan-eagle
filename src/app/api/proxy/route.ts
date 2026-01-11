import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let endpoint = searchParams.get('endpoint'); // e.g. "/clans/#TAG/currentwar"
  
  // Future Auth Token (Empty for now, ready for later)
  const API_TOKEN = process.env.COC_API_TOKEN || ''; 

  // --- 1. VALIDATION ---
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  // Ensure endpoint starts with '/'
  if (!endpoint.startsWith('/')) endpoint = `/${endpoint}`;

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- 2. SMART URL CONSTRUCTION ---
  // The core fix: We globally replace '#' with '%23'.
  // This ensures that whether the user types "#TAG" or "TAG", the backend gets the correct URL format.
  // Next.js searchParams automatically decodes %23 back to #, so we must re-encode it here.
  const safeEndpoint = endpoint.replace(/#/g, '%23');
  const targetUrl = `${BACKEND_URL}${safeEndpoint}`;

  console.log(`[Proxy] Fetching: ${targetUrl}`);

  // --- 3. FETCH ---
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Future Auth: Uncomment next line when you need it
        // 'Authorization': `Bearer ${API_TOKEN}` 
      },
      cache: 'no-store', // Always fresh data for live wars/stats
    });

    // --- 4. SMART ERROR HANDLING ---
    
    // Case A: Success (200)
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(normalizeResponse(data));
    }

    // Case B: Clan Not In War (404 on currentwar)
    // The CoC API returns 404 if a clan is not in war. We shouldn't treat this as an "error".
    // We return null so the frontend simply shows "Not in War" instead of crashing.
    if (res.status === 404 && endpoint.includes('/currentwar')) {
      console.log(`[Proxy] Info: Clan not in war (${endpoint})`);
      return NextResponse.json(null); // Return null, not error
    }

    // Case C: Private War Log (403)
    if (res.status === 403) {
      return NextResponse.json({ error: 'Access Denied', code: 'access_denied' }, { status: 403 });
    }

    // Case D: Genuine Error
    const errorText = await res.text();
    console.error(`[Proxy] API Error ${res.status}: ${errorText}`);
    return NextResponse.json(
      { error: `Backend Error ${res.status}`, details: errorText }, 
      { status: res.status }
    );

  } catch (error: any) {
    console.error(`[Proxy] Network Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// --- HELPER: NORMALIZE DATA ---
// Flattens the API response so frontend always gets { items: [...] } or the Object.
const normalizeResponse = (data: any) => {
  if (data?.data?.items) return { items: data.data.items };
  if (data?.items) return { items: data.items };
  if (Array.isArray(data)) return { items: data };
  return data;
};
