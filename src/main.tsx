import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Registro de Service Worker para soporte PWA offline-first nativo
if ('serviceWorker' in navigator && typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('[Kalo PWA] Error al registrar Service Worker:', err));
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento raíz #root no encontrado en el documento HTML');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
