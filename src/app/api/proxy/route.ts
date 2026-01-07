import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint'); // e.g., /clans/#TAG

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  // CORRECTION: Added '/api' to match your working api.ts file
  const BACKEND_URL = 'https://coc-api-functional.onrender.com/api';

  // We will try these 3 variations to ensure the tag is caught correctly
  const variations = [
    endpoint.replace(/#/g, '%23'),   // 1. Standard Encoded (Most likely to work)
    endpoint.replace(/#/g, '%2523'), // 2. Double Encoded (If backend auto-decodes)
    endpoint.replace(/#/g, ''),      // 3. Raw/No Hash (If backend strips it)
  ];

  let lastErrorStr = '';
  let successfulData = null;

  // Loop through variations until one works
  for (const path of variations) {
    const targetUrl = `${BACKEND_URL}${path}`;
    try {
      console.log(`[Proxy] Trying: ${targetUrl}`);
      
      const res = await fetch(targetUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        successfulData = await res.json();
        break; // Success! Stop looping.
      } else {
        lastErrorStr = `Status ${res.status} on ${path}`;
      }
    } catch (error: any) {
      lastErrorStr = error.message;
    }
  }

  // If we found data, return it
  if (successfulData) {
    return NextResponse.json(successfulData);
  }

  // If all failed, return the error
  return NextResponse.json(
    { 
      error: 'Backend Fetch Failed', 
      debug: `Tried 3 variations on ${BACKEND_URL}. Last error: ${lastErrorStr}` 
    },
    { status: 404 }
  );
}

