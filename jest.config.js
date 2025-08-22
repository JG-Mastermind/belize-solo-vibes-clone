module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Module name mapping for path aliases and mocks
  moduleNameMapper: {
    '^@/integrations/supabase/client$': '<rootDir>/src/__mocks__/supabase-client.ts',
    '^@/utils/clearAuthState$': '<rootDir>/src/__mocks__/clearAuthState.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Transform configuration - modern ts-jest setup
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './tsconfig.jest.json'
    }]
  },
  
  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  
  // File extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],
  
  // Transform ignore patterns for ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  
  // Test environment options
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  
  // Global test timeout
  testTimeout: 10000
};