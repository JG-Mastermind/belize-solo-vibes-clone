/**
 * Test to verify that import.meta.env is properly mocked in Jest environment
 */
describe('import.meta.env mock', () => {
  test('should have access to import.meta.env', () => {
    expect(import.meta.env).toBeDefined();
    expect(import.meta.env.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBe('test-anon-key');
  });

  test('should have all required env variables', () => {
    expect(import.meta.env.NODE_ENV).toBe('test');
    expect(import.meta.env.MODE).toBe('test');
    expect(import.meta.env.DEV).toBe(false);
    expect(import.meta.env.PROD).toBe(false);
  });

  test('should have API keys available', () => {
    expect(import.meta.env.VITE_OPENAI_API_KEY).toBe('test-openai-key');
    expect(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY).toBe('pk_test_stripe_key');
  });
});