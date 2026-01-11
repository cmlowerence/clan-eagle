const BASE_URL = 'https://coc-api-functional.onrender.com/api';

// --- HELPER: NORMALIZE DATA ---
// Flattens the API response to ensure consistent structure
// whether it comes from 'data.items', 'items', or direct array.
const normalizeResponse = (data: any) => {
  if (data?.data?.items) return { items: data.data.items };
  if (data?.items) return { items: data.items };
  if (Array.isArray(data)) return { items: data };
  return data;
};

// --- MAIN FETCHER ---
// Use this function in Server Components to fetch data directly
// without going through the Next.js API Proxy loop.
export async function fetchClashAPI<T>(endpoint: string): Promise<T | null> {
  try {
    // 1. Validation & Formatting
    // Ensure endpoint starts with '/'
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // 2. Smart URL Encoding
    // Replace '#' with '%23' to ensure tags are sent correctly to the backend
    const safePath = path.replace(/#/g, '%23');
    const url = `${BASE_URL}${safePath}`;

    // 3. Fetch
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    // 4. Handle Specific Status Codes
    if (res.status === 404) {
      console.warn(`[API] Resource not found: ${url}`);
      return null;
    }

    if (!res.ok) {
      console.error(`[API] Error ${res.status}: ${res.statusText} at ${url}`);
      return null;
    }

    // 5. Unwrap & Normalize
    const json = await res.json();
    return normalizeResponse(json) as T;

  } catch (error) {
    console.error('[API] Network Exception:', error);
    return null;
  }
}
