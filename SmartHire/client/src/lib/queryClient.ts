import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "./apiConfig";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: {
    method: string;
    body?: FormData | unknown;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const isFormData = options.body instanceof FormData;
  
  const fullUrl = getApiUrl(url);
  console.log('API Request - Full URL:', fullUrl);
  console.log('API Request - Options:', options);
  
  const res = await fetch(fullUrl, {
    method: options.method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    body: isFormData ? (options.body as FormData) : (options.body ? JSON.stringify(options.body) : undefined),
    credentials: "include",
  });

  console.log('API Response - Status:', res.status);
  console.log('API Response - Headers:', [...res.headers.entries()]);
  
  await throwIfResNotOk(res);
  const data = await res.json();
  console.log('API Response - Data:', data);
  return data;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(getApiUrl(queryKey.join("/")), {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});