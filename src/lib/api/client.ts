/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  const options: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);

    // Handle 401 Unauthorized
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
      return { 
        success: false, 
        error: 'Unauthorized - redirecting to login',
        code: 401
      };
    }

    // Handle 403 Forbidden
    if (res.status === 403) {
      console.error('403 Forbidden on', endpoint);
      return {
        success: false,
        error: 'Access forbidden - you do not have permission to access this resource',
        code: 403
      };
    }

    if (!res.ok) {
      const text = await res.text();
      console.warn(`API error ${res.status} on ${endpoint}:`, text);
      return {
        success: false,
        error: `Server error ${res.status} - ${text.slice(0, 100) || 'No details'}`,
        code: res.status
      };
    }

    let responseData: any;
    try {
      const text = await res.text();
      if (!text.trim()) {
        return { success: true, data: undefined as T };
      }
      responseData = JSON.parse(text);
    } catch {
      console.error('Invalid JSON from server:', endpoint);
      return {
        success: false,
        error: 'Server returned invalid response (not JSON)',
      };
    }

 
    const normalizedData = responseData.data ?? responseData.event ?? responseData.program ?? responseData;

    return {
      success: true,
      data: normalizedData as T,
      error: responseData.error,
    };
  } catch (err) {
    console.error('Network or fetch error on', endpoint, err);
    return { 
      success: false, 
      error: 'Network error - is backend running?' 
    };
  }
}