
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

// Polifill essencial para compatibilidade com bibliotecas que esperam 'process'
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {
      NODE_ENV: 'production'
    }
  };
}

/**
 * Registro do Service Worker (PWA)
 * O erro 'invalid state' ocorre frequentemente quando o registro é tentado 
 * em um documento que ainda está mudando ou sendo descarregado (comum em previews).
 */
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Usamos um pequeno timeout para garantir que o React já montou e o DOM está estável
    setTimeout(async () => {
      try {
        const swUrl = new URL('/sw.js', window.location.origin).href;
        const isDevelopmentPreview = window.location.hostname.includes('usercontent.goog') || 
                                     window.location.hostname.includes('ai.studio');

        // Em produção (Vercel), registrará normalmente. 
        // Em preview, tenta registrar mas ignora falhas de ambiente.
        const registration = await navigator.serviceWorker.register(swUrl);
        console.debug('Jornada de Fé: PWA pronto no escopo:', registration.scope);
      } catch (error: any) {
        // Silenciamos erros comuns de ambientes de desenvolvimento/preview
        // que não afetam a funcionalidade do app.
        const ignoredErrors = [
          'invalid state',
          'mismatch origin',
          'SecurityError',
          'disallowed by'
        ];
        
        const shouldLog = !ignoredErrors.some(msg => error.message.toLowerCase().includes(msg));
        if (shouldLog) {
          console.warn('Aviso de PWA:', error.message);
        }
      }
    }, 1000); 
  }
};

// Dispara o registro quando o documento estiver completo
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
