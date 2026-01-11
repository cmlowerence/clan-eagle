import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans/#TAG/capitalraidseasons...

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // --- HELPER: NORMALIZE DATA ---
  // Flattens inconsistent API response structures into a standard { items: [] } format
  const normalizeResponse = (data: any) => {
    if (data?.data?.items) return { items: data.data.items };
    if (data?.items) return { items: data.items };
    if (Array.isArray(data)) return { items: data };
    return data;
  };

  // --- HELPER: SANITIZE ENDPOINT ---
  // Ensures tags with '#' are correctly encoded as '%23' for the fetch call.
  // We do this regardless of frontend input, as searchParams decodes automatically.
  const createSafeUrl = (path: string) => {
    // If the path contains a literal '#', replace it with '%23'
    // This prevents fetch() from treating the tag as a URL fragment
    return `${BACKEND_URL}${path.replace(/#/g, '%23')}`;
  };

  // --- 1. COMPLEX REQUESTS (Query Params / Specific Paths) ---
  // Used for: Raid Seasons, War Logs, or Search Filters
  if (endpoint.includes('?') || endpoint.split('/').length > 3) {
     try {
        const targetUrl = createSafeUrl(endpoint);
        
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
            return NextResponse.json(
                { error: `Backend API Error: ${res.status}` }, 
                { status: res.status }
            );
        }
     } catch(e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
     }
  }

  // --- 2. SIMPLE TAG LOOKUP (Robust Fallback) ---
  // Used for: Clan or Player profile lookups.
  // We try multiple encoding variations to ensure we find the resource.
  const variations = [
    endpoint.replace(/#/g, '%23'),   // Standard encoded (# -> %23)
    endpoint.replace(/#/g, '%2523'), // Double encoded (sometimes needed for specific proxies)
    endpoint,                        // Raw
  ];

  // Remove duplicates
  const uniqueVariations = Array.from(new Set(variations));

  let successfulData = null;
  let lastErrorStr = '';

  for (const path of uniqueVariations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    
    try {
      const res = await fetch(targetUrl, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        successfulData = await res.json();
        break; // Stop once we find data
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
