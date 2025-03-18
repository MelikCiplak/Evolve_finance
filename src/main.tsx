
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

// Add global error handler to catch and display runtime errors
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
});

createRoot(rootElement).render(<App />);
