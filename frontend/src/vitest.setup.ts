import '@testing-library/jest-dom/vitest';


// src/setupTests.ts
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as any).ResizeObserver = ResizeObserver;
  