import './src/index.css';
console.log('pflegenavi24: boot');
// Diagnostic helpers for Tailwind CSS presence
setTimeout(() => {
  try {
    console.log('pflegenavi24: stylesheets', Array.from(document.styleSheets).map(s => s.href || '(inline)'));
    const hasText5xl = Array.from(document.styleSheets).some(s => {
      try { return Array.from(s.cssRules || []).some(r => r.cssText && r.cssText.includes('.text-5xl')); } catch (e) { return false; }
    });
    console.log('pflegenavi24: found .text-5xl rule?', hasText5xl);
    console.log('pflegenavi24: body font', getComputedStyle(document.body).fontFamily, 'color', getComputedStyle(document.body).color);
  } catch (e) {
    console.error('pflegenavi24: style diagnostic error', e);
  }
}, 2000);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);