
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Polyfill para garantir que bibliotecas que usam process.env não quebrem
// Em produção, o Vite substituirá as chamadas a process.env.API_KEY por valores reais
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'production'
    }
  };
}

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    setTimeout(async () => {
      try {
        const swUrl = new URL('/sw.js', window.location.origin).href;
        await navigator.serviceWorker.register(swUrl);
      } catch (error: any) {
        // Ignora avisos de desenvolvimento
      }
    }, 2000); 
  }
};

if (document.readyState === 'complete') {
  registerServiceWorker();
} else {
  window.addEventListener('load', registerServiceWorker);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
