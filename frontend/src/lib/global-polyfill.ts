// Polyfill for simple-peer's global requirement
if (typeof global === 'undefined') {
  (window as any).global = window;
}

export {}; 