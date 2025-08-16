
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

// Service Worker Registration
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      console.log('PWA: Registering Service Worker...');
      
      // Unregister any existing service workers first
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
        console.log('PWA: Unregistered old service worker');
      }
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('PWA: Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Show update available notification
                console.log('PWA: New version available! Please refresh.');
                showUpdateNotification();
              } else {
                console.log('PWA: Content cached for offline use.');
              }
            }
          });
        }
      });

    } catch (error) {
      console.error('PWA: Service Worker registration failed:', error);
    }
  } else {
    console.log('PWA: Service Worker not supported');
  }
}

// Show update notification
function showUpdateNotification() {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Inter, sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      backdrop-filter: blur(10px);
    ">
      🚀 New version available! Click to refresh.
    </div>
  `;

  notification.onclick = () => {
    window.location.reload();
  };

  document.body.appendChild(notification);

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 10000);
}

// Initialize PWA features
async function initPWA() {
  await registerServiceWorker();

  // Add offline/online event listeners
  window.addEventListener('online', () => {
    console.log('PWA: Back online');
  });

  window.addEventListener('offline', () => {
    console.log('PWA: Gone offline');
  });
}

// Initialize everything
initPWA();

createRoot(document.getElementById("root")!).render(<App />);
