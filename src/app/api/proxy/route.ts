import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }

  // Define the External Backend URL
  const BACKEND_URL = 'https://coc-api-functional.onrender.com';

  try {
    // 1. Construct the URL. 
    // We assume 'endpoint' passed from the client already has the tag, e.g., "/clans/#TAG"
    // We need to manually ensure the # is encoded as %23 for the outgoing request
    const cleanEndpoint = endpoint.replace(/#/g, '%23');
    const targetUrl = `${BACKEND_URL}${cleanEndpoint}`;

    console.log(`[Proxy] Fetching: ${targetUrl}`);

    const res = await fetch(targetUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure we always get fresh data for the "Refresh" button
    });

    if (!res.ok) {
      // Return the backend's error if possible
      return NextResponse.json(
        { error: `Backend responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
