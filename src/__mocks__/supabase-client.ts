// Mock Supabase client for tests - prevents initialization errors
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

// Define expected data shapes
interface MockData {
  id?: string;
  [key: string]: unknown; // Flexible for mock data
}

interface RpcResponse {
  success: boolean;
}

// Proper error type definition for tests
const createMockError = (message: string, code: string = 'test_error', status: number = 400) => ({
  message,
  code,
  status
});

// Define the query builder interface
interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  eq: (column: string, value: unknown) => MockQueryBuilder;
  neq: (column: string, value: unknown) => MockQueryBuilder;
  gt: (column: string, value: unknown) => MockQueryBuilder;
  lt: (column: string, value: unknown) => MockQueryBuilder;
  gte: (column: string, value: unknown) => MockQueryBuilder;
  lte: (column: string, value: unknown) => MockQueryBuilder;
  like: (column: string, value: string) => MockQueryBuilder;
  ilike: (column: string, value: string) => MockQueryBuilder;
  in: (column: string, values: unknown[]) => MockQueryBuilder;
  is: (column: string, value: unknown) => MockQueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder;
  limit: (count: number) => Promise<PostgrestResponse<MockData>>;
  single: () => Promise<PostgrestSingleResponse<MockData>>;
  maybeSingle: () => Promise<PostgrestSingleResponse<MockData>>;
}

const mockAuthMethods = {
  getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  signInWithPassword: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null
  })),
  signUp: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null
  })),
  signOut: jest.fn(() => Promise.resolve({ error: null })),
  resetPasswordForEmail: jest.fn(() => Promise.resolve({ data: {}, error: null })),
  verifyOtp: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null
  })),
  updateUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  setSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  onAuthStateChange: jest.fn(() => ({
    data: { subscription: { unsubscribe: jest.fn() } }
  })),
  refreshSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  
  // Export the createMockError helper for tests that need to simulate errors
  __createMockError: createMockError
};

const mockQueryBuilder: MockQueryBuilder = {
  select: jest.fn(function(this: MockQueryBuilder) { return this; }),
  eq: jest.fn(function(this: MockQueryBuilder) { return this; }),
  neq: jest.fn(function(this: MockQueryBuilder) { return this; }),
  gt: jest.fn(function(this: MockQueryBuilder) { return this; }),
  lt: jest.fn(function(this: MockQueryBuilder) { return this; }),
  gte: jest.fn(function(this: MockQueryBuilder) { return this; }),
  lte: jest.fn(function(this: MockQueryBuilder) { return this; }),
  like: jest.fn(function(this: MockQueryBuilder) { return this; }),
  ilike: jest.fn(function(this: MockQueryBuilder) { return this; }),
  in: jest.fn(function(this: MockQueryBuilder) { return this; }),
  is: jest.fn(function(this: MockQueryBuilder) { return this; }),
  order: jest.fn(function(this: MockQueryBuilder) { return this; }),
  limit: jest.fn(() => Promise.resolve({ data: [] as MockData[], error: null } as PostgrestResponse<MockData>)),
  single: jest.fn(() => Promise.resolve({ data: null, error: null } as PostgrestSingleResponse<MockData>)),
  maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null } as PostgrestSingleResponse<MockData>))
};

// Create mock Supabase client with proper method chaining
const mockSupabaseClient = {
  auth: mockAuthMethods,
  from: jest.fn(() => ({
    ...mockQueryBuilder,
    insert: jest.fn(() => Promise.resolve({ data: null, error: null } as PostgrestResponse<MockData>)),
    update: jest.fn(() => ({
      ...mockQueryBuilder,
      eq: jest.fn(() => Promise.resolve({ data: null, error: null } as PostgrestResponse<MockData>))
    })),
    delete: jest.fn(() => ({
      ...mockQueryBuilder,
      eq: jest.fn(() => Promise.resolve({ data: null, error: null } as PostgrestResponse<MockData>))
    }))
  })),
  rpc: jest.fn(() => Promise.resolve({ data: { success: true } as RpcResponse, error: null } as PostgrestSingleResponse<RpcResponse>)),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: null, error: null })),
      download: jest.fn(() => Promise.resolve({ data: null, error: null })),
      remove: jest.fn(() => Promise.resolve({ data: null, error: null })),
      list: jest.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  },
  functions: {
    invoke: jest.fn(() => Promise.resolve({ data: null, error: null }))
  },
  channel: jest.fn(() => ({
    on: jest.fn(function(this: { on: jest.Mock; subscribe: jest.Mock; unsubscribe: jest.Mock }) { return this; }),
    subscribe: jest.fn(() => 'OK'),
    unsubscribe: jest.fn(() => 'OK')
  })),
  removeChannel: jest.fn(),
  removeAllChannels: jest.fn(),
  getChannels: jest.fn(() => [])
};

// Export both named and default exports to handle different import patterns
export const supabase = mockSupabaseClient;
export default mockSupabaseClient;