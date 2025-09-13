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
  
  // If path is already an absolute path, prepend the base URL
  if (path.startsWith('/')) {
    const result = `${API_BASE_URL}${path}`;
    console.log('API Config - Returning absolute path:', result);
    return result;
  }
  
  // Otherwise, prepend the base URL and a slash
  const result = `${API_BASE_URL}/${path}`;
  console.log('API Config - Returning relative path:', result);
  return result;
}