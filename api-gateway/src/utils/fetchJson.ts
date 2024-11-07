export async function fetchJson(url: string, options: RequestInit = {}, apiKey?: string) {
    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey && { 'X-API-KEY': apiKey }),
      ...options.headers,
    };
  
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }
  
    return data;
  }