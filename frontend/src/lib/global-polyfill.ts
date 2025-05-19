// Polyfill for simple-peer's global requirement
if (typeof window !== 'undefined') {
  // Ensure global is defined
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }

  // Additional required globals for simple-peer
  (window as any).process = {
    env: { NODE_ENV: 'production' },
    nextTick: (fn: Function) => setTimeout(fn, 0),
    version: '',
    browser: true
  };

  // Buffer polyfill if needed
  if (typeof (window as any).Buffer === 'undefined') {
    (window as any).Buffer = require('buffer/').Buffer;
  }
}

export {}; 