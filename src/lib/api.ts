const BASE_URL = 'https://coc-api-functional.onrender.com/api';

// Interface for the backend response structure
interface BackendResponse<T> {
  cached: boolean;
  data: T;
}

export async function fetchClashAPI<T>(endpoint: string): Promise<T | null> {
  try {
    // 1. URL Encoding: Replace # with %23 for tags
    const cleanEndpoint = endpoint.replace(/#/g, '%23');
    const url = `${BASE_URL}${cleanEndpoint}`;

    console.log(`Fetching: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      console.error(`API Error ${res.status}: ${res.statusText}`);
      return null;
    }

    // 2. Unwrap JSON
    const json: BackendResponse<T> = await res.json();
    
    // 3. Return inner data
    return json.data;

  } catch (error) {
    console.error('Fetch Wrapper Error:', error);
    return null;
  }
}
