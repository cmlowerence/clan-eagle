import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent static caching of the proxy

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');

  // Base URL for your Render Backend
  const BACKEND_URL = 'https://coc-api-functional.onrender.com';

  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
  }

  // LOGIC: Ensure the tag (#) is encoded as %23.
  // We assume the input 'endpoint' is like "/clans/#TAG"
  // We strictly replace literal '#' with '%23'
  const cleanEndpoint = endpoint.replace(/#/g, '%23');
  const targetUrl = `${BACKEND_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      // If backend fails, we return the error AND the URL we tried to hit
      // This helps you debug if the encoding is wrong
      return NextResponse.json(
        { 
          error: `Backend Error ${res.status}`, 
          debugUrl: targetUrl 
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Proxy Connection Failed', 
        details: error.message,
        debugUrl: targetUrl 
      },
      { status: 500 }
    );
  }
}

