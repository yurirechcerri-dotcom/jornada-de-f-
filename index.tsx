import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Polyfill minimalista para compatibilidade com bibliotecas antigas
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: { NODE_ENV: 'production' } };
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element não encontrado");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

// Service Worker em segundo plano para não bloquear a renderização inicial
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}