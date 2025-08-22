import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library for better async handling
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Suppress act() warnings for known async operations in tests
// These are expected when testing components that trigger async state updates
const originalError = console.error;
beforeEach(() => {
  console.error = (...args: any[]) => {
    if (
      args[0]?.includes?.('Warning: An update to') &&
      args[0]?.includes?.('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
});

// Mock import.meta.env for Jest compatibility with Vite
const mockEnv = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_OPENAI_ORGANIZATION: 'test-org',
  VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_stripe_key',
  STRIPE_SECRET_KEY: 'sk_test_stripe_secret',
  STRIPE_WEBHOOK_SECRET: 'whsec_test_webhook_secret',
  VITE_SENTRY_DSN: 'https://test-sentry-dsn@sentry.io/test',
  NODE_ENV: 'test',
  MODE: 'test',
  DEV: false,
  PROD: false,
  BASE_URL: '/',
  SSR: false
};

// Create import.meta mock for ESM compatibility
const importMetaMock = {
  env: mockEnv,
  hot: undefined,
  url: 'file:///test',
  glob: jest.fn()
};

// Set up import.meta for both globalThis and global
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: importMetaMock
  },
  writable: true,
  configurable: true
});

// Fallback for older Node.js compatibility
if (typeof global !== 'undefined') {
  Object.defineProperty(global, 'import', {
    value: {
      meta: importMetaMock
    },
    writable: true,
    configurable: true
  });
}

// Mock fetch for Node.js environment
if (!globalThis.fetch) {
  globalThis.fetch = jest.fn();
}

// Mock ResizeObserver for jsdom
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class MockResizeObserver implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock IntersectionObserver for jsdom
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];
    
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
    
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  };
}