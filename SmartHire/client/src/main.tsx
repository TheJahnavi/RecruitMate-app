import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add debugging information
console.log('Application starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Base URL:', import.meta.env.BASE_URL);

// Check if root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  createRoot(rootElement).render(<App />);
}

// Git structure fix applied
console.log('Vercel Git repository structure fix applied');