// Mock Supabase client for tests - prevents initialization errors
const mockAuthMethods = {
  getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
  getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  signInWithPassword: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null as any // Allow error to have any shape for TypeScript compatibility
  })),
  signUp: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null as any
  })),
  signOut: jest.fn(() => Promise.resolve({ error: null as any })),
  resetPasswordForEmail: jest.fn(() => Promise.resolve({ data: {}, error: null as any })),
  verifyOtp: jest.fn(() => Promise.resolve({ 
    data: { user: null, session: null }, 
    error: null as any
  })),
  updateUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null as any })),
  setSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null as any })),
  onAuthStateChange: jest.fn(() => ({
    data: { subscription: { unsubscribe: jest.fn() } }
  })),
  refreshSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null as any }))
};

const mockQueryBuilder = {
  select: jest.fn(function(this: any) { return this; }),
  eq: jest.fn(function(this: any) { return this; }),
  neq: jest.fn(function(this: any) { return this; }),
  gt: jest.fn(function(this: any) { return this; }),
  lt: jest.fn(function(this: any) { return this; }),
  gte: jest.fn(function(this: any) { return this; }),
  lte: jest.fn(function(this: any) { return this; }),
  like: jest.fn(function(this: any) { return this; }),
  ilike: jest.fn(function(this: any) { return this; }),
  in: jest.fn(function(this: any) { return this; }),
  is: jest.fn(function(this: any) { return this; }),
  order: jest.fn(function(this: any) { return this; }),
  limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
  single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null }))
};

// Create mock Supabase client with proper method chaining
const mockSupabaseClient = {
  auth: mockAuthMethods,
  from: jest.fn(() => ({
    ...mockQueryBuilder,
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    update: jest.fn(() => ({
      ...mockQueryBuilder,
      eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
    })),
    delete: jest.fn(() => ({
      ...mockQueryBuilder,
      eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  })),
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
    on: jest.fn(function(this: any) { return this; }),
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