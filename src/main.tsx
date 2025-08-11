import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handling for debugging
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  if (event.reason?.message?.includes('fetch') || event.reason?.message?.includes('NetworkError')) {
    console.error('Network fetch error detected:', event.reason);
  }
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  if (event.error?.message?.includes('NetworkError')) {
    console.error('Network error detected:', event.error);
  }
});

createRoot(document.getElementById("root")!).render(<App />);
