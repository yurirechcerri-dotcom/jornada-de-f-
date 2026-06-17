import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Polyfill básico para process.env
(window as any).process = (window as any).process || { env: { NODE_ENV: 'production' } };

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

// Gerenciamento seguro do Service Worker e Limpeza de Cache no Ambiente Cloud Run / Visualização do AI Studio
try {
  const isDevSandbox = window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');

  if (isDevSandbox) {
    if ('serviceWorker' in navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then(() => {
            console.log('[Dev] Service Worker desregistrado para evitar cache obsoleto!');
          }).catch(() => {});
        }
      }).catch(err => {
        console.warn('[Dev] Falha ao obter registros de Service Worker:', err);
      });
    }

    if (typeof window !== 'undefined' && 'caches' in window && window.caches) {
      window.caches.keys().then((keys) => {
        keys.forEach((key) => {
          window.caches.delete(key).then(() => {
            console.log(`[Dev] Cache local '${key}' limpo com sucesso!`);
          }).catch(() => {});
        });
      }).catch(err => {
        console.warn('[Dev] Falha ao limpar cache de armazenamento:', err);
      });
    }
  } else {
    // Em produção real escalada para usuários, ativa o Service Worker em segundo plano como de costume
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }
} catch (e) {
  console.warn('[Dev] Falcon serviceWorker check safely bypassed:', e);
}
