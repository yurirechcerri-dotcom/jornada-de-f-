
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Polifill essencial para compatibilidade
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'production',
      // Preservar variáveis injetadas se houver
      // Fix: Removed 'typeof' to spread the actual object instead of a string
      ...((window as any).process?.env || {})
    }
  };
}

/**
 * Registro do Service Worker (PWA)
 */
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    setTimeout(async () => {
      try {
        const swUrl = new URL('/sw.js', window.location.origin).href;
        const isDevelopmentPreview = window.location.hostname.includes('usercontent.goog') || 
                                     window.location.hostname.includes('ai.studio');

        const registration = await navigator.serviceWorker.register(swUrl);
        console.debug('Jornada de Fé: PWA pronto no escopo:', registration.scope);
      } catch (error: any) {
        const ignoredErrors = ['invalid state', 'mismatch origin', 'SecurityError', 'disallowed by'];
        const shouldLog = !ignoredErrors.some(msg => error.message.toLowerCase().includes(msg));
        if (shouldLog) console.warn('Aviso de PWA:', error.message);
      }
    }, 1500); 
  }
};

if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
