import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker for Mobile App Installation & Quick Launch
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        console.log('ALTRON OS PWA Service Worker active:', reg.scope);
      })
      .catch(err => {
        console.warn('PWA Service Worker registration:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
