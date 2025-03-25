export async function apiFetch(url: string, method: string = 'GET', body?: any) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    const options: RequestInit = {
      method,
      headers,
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    const res = await fetch(url, options);
  
    if (!res.ok) {
      throw new Error(`API request failed: ${res.statusText}`);
    }
  
    return res.json();
  }