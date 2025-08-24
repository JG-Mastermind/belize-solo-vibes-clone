// Comprehensive Production-ready Supabase client mock for all test scenarios
import type { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

// Define expected data shapes for tests
interface MockData {
  id?: string;
  user_type?: string;
  [key: string]: unknown;
}

interface RpcResponse {
  success: boolean;
}

// Global mock state that can be configured per test
export const mockState = {
  user: null as any,
  session: null as any,
  userType: null as string | null,
  shouldReturnError: false,
  errorMessage: 'Mock error'
};

// Helper to reset mock state
export const resetMockState = () => {
  mockState.user = null;
  mockState.session = null;
  mockState.userType = null;
  mockState.shouldReturnError = false;
  mockState.errorMessage = 'Mock error';
};

// Mock implementation that handles ALL Supabase use cases in the application
const mockSupabaseClient = {
  auth: {
    // Critical: getSession must resolve immediately for AuthProvider to complete loading
    getSession: jest.fn(() => {
      if (mockState.shouldReturnError) {
        return Promise.resolve({ data: { session: null }, error: { message: mockState.errorMessage } });
      }
      return Promise.resolve({ 
        data: { session: mockState.session }, 
        error: null 
      });
    }),
    
    getUser: jest.fn((token?: string) => {
      if (mockState.shouldReturnError) {
        return Promise.resolve({ data: { user: null }, error: { message: mockState.errorMessage } });
      }
      return Promise.resolve({ data: { user: mockState.user }, error: null });
    }),
    
    signInWithPassword: jest.fn((email: string, password: string) => {
      if (mockState.shouldReturnError) {
        return Promise.resolve({ data: { user: null, session: null }, error: { message: mockState.errorMessage } });
      }
      return Promise.resolve({ 
        data: { user: mockState.user, session: mockState.session }, 
        error: null 
      });
    }),
    
    signUp: jest.fn(() => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: null
    })),
    
    signOut: jest.fn(() => Promise.resolve({ error: null })),
    
    resetPasswordForEmail: jest.fn((email: string, options?: any) => {
      return Promise.resolve({ data: {}, error: null });
    }),
    
    verifyOtp: jest.fn((params: { token_hash?: string; type?: string }) => {
      if (mockState.shouldReturnError) {
        return Promise.resolve({ 
          data: { user: null, session: null }, 
          error: { message: mockState.errorMessage }
        });
      }
      return Promise.resolve({ 
        data: { user: mockState.user, session: mockState.session }, 
        error: null 
      });
    }),
    
    updateUser: jest.fn((attributes: any) => {
      if (mockState.shouldReturnError) {
        return Promise.resolve({ data: { user: null }, error: { message: mockState.errorMessage } });
      }
      return Promise.resolve({ data: { user: mockState.user }, error: null });
    }),
    
    setSession: jest.fn((session: any) => {
      mockState.session = session;
      return Promise.resolve({ data: { session }, error: null });
    }),
    
    // Critical: onAuthStateChange must return immediately for tests to not hang
    onAuthStateChange: jest.fn((callback) => {
      // Optionally call the callback immediately for tests that need it
      if (callback && typeof callback === 'function') {
        setTimeout(() => callback('SIGNED_OUT', mockState.session), 0);
      }
      return {
        data: { subscription: { unsubscribe: jest.fn() } }
      };
    }),
    
    refreshSession: jest.fn(() => Promise.resolve({ data: { session: mockState.session }, error: null })),
    resetPassword: jest.fn(() => Promise.resolve({ error: null }))
  },

  // Database query mock - handles all the query chains used in the app
  from: jest.fn((table: string) => ({
    select: jest.fn((columns: string) => ({
      eq: jest.fn((column: string, value: unknown) => ({
        maybeSingle: jest.fn(() => {
          // For 'users' table queries, return the configured userType
          if (table === 'users' && columns.includes('user_type')) {
            return Promise.resolve({ 
              data: mockState.userType ? { user_type: mockState.userType } : null,
              error: null 
            } as PostgrestSingleResponse<MockData>);
          }
          return Promise.resolve({ 
            data: null, 
            error: null 
          } as PostgrestSingleResponse<MockData>);
        }),
        single: jest.fn(() => Promise.resolve({ 
          data: mockState.userType ? { user_type: mockState.userType } : null,
          error: null 
        } as PostgrestSingleResponse<MockData>))
      })),
      // Support queries without eq()
      maybeSingle: jest.fn(() => Promise.resolve({ 
        data: null, 
        error: null 
      } as PostgrestSingleResponse<MockData>))
    })),
    
    // Support insert operations
    insert: jest.fn((data: MockData | MockData[]) => Promise.resolve({ 
      data: null, 
      error: null 
    } as PostgrestResponse<MockData>)),
    
    // Support update operations  
    update: jest.fn((data: Partial<MockData>) => ({
      eq: jest.fn((column: string, value: unknown) => Promise.resolve({ 
        data: null, 
        error: null 
      } as PostgrestResponse<MockData>))
    })),
    
    // Support delete operations
    delete: jest.fn(() => ({
      eq: jest.fn((column: string, value: unknown) => Promise.resolve({ 
        data: null, 
        error: null 
      } as PostgrestResponse<MockData>))
    }))
  })),

  // RPC support for stored procedures
  rpc: jest.fn((funcName: string, params?: object) => Promise.resolve({ 
    data: { success: true } as RpcResponse, 
    error: null 
  } as PostgrestSingleResponse<RpcResponse>)),

  // Storage mock
  storage: {
    from: jest.fn((bucket: string) => ({
      upload: jest.fn(() => Promise.resolve({ data: null, error: null })),
      download: jest.fn(() => Promise.resolve({ data: null, error: null })),
      remove: jest.fn(() => Promise.resolve({ data: null, error: null })),
      list: jest.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  },

  // Functions mock
  functions: {
    invoke: jest.fn(() => Promise.resolve({ data: null, error: null }))
  },

  // Realtime subscriptions mock
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