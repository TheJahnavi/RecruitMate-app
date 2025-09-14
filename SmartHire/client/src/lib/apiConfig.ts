// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, API is served from the same origin
  : 'http://localhost:3001'; // In development, API is on port 3001

console.log('API Config - NODE_ENV:', process.env.NODE_ENV);
console.log('API Config - API_BASE_URL:', API_BASE_URL);

export function getApiUrl(path: string): string {
  console.log('API Config - Input path:', path);
  
  // If path is already an absolute URL, return it as is
  if (path.startsWith('http')) {
    console.log('API Config - Returning absolute URL:', path);
    return path;
  }
  
  // For API routes, we want to make sure they're properly handled
  if (path.startsWith('/api/')) {
    // In production on Vercel, API routes are handled by the serverless functions
    // We don't need to prepend anything for API routes in production
    if (process.env.NODE_ENV === 'production') {
      const result = path;
      console.log('API Config - Returning API path for production:', result);
      return result;
    }
    // In development, we prepend the API base URL
    const result = `${API_BASE_URL}${path}`;
    console.log('API Config - Returning API path for development:', result);
    return result;
  }
  
  // For non-API routes, prepend the base URL
  const result = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  console.log('API Config - Returning non-API path:', result);
  return result;
}