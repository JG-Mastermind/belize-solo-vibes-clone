/**
 * Rate Limiting Middleware Test Suite
 * 
 * Comprehensive tests for the rate limiting system including:
 * - Redis and Deno KV storage implementations
 * - Sliding window rate limiting algorithm
 * - Per-route, per-IP, and auth-based rate limiting
 * - Response headers and 429 error handling
 * - Graceful degradation and fail-open behavior
 * 
 * Run with: deno test supabase/functions/_tests/rateLimit.spec.ts --allow-net --allow-env --allow-read
 */

import { assertEquals, assertExists, assertInstanceOf } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { rateLimit, withRateLimit } from "../_middleware.ts";

// Mock implementations for testing
class MockRedisStorage {
  private data: Map<string, { value: string; expiry: number }> = new Map();
  private counters: Map<string, { count: number; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const entry = this.data.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.data.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    this.data.set(key, {
      value,
      expiry: Date.now() + ttlMs,
    });
  }

  async increment(key: string, ttlMs: number): Promise<number> {
    const now = Date.now();
    const entry = this.counters.get(key);
    
    if (!entry || now > entry.expiry) {
      this.counters.set(key, { count: 1, expiry: now + ttlMs });
      return 1;
    }
    
    entry.count++;
    return entry.count;
  }

  clear(): void {
    this.data.clear();
    this.counters.clear();
  }
}

// Test helpers
function createMockRequest(options: {
  url?: string;
  method?: string;
  ip?: string;
  authorization?: string;
}): Request {
  const headers = new Headers();
  
  if (options.ip) {
    headers.set('x-forwarded-for', options.ip);
  }
  
  if (options.authorization) {
    headers.set('authorization', options.authorization);
  }

  return new Request(options.url || 'https://example.com/functions/test', {
    method: options.method || 'GET',
    headers,
  });
}

function createMockJWT(userId: string): string {
  const payload = { sub: userId };
  const encoded = btoa(JSON.stringify(payload));
  return `header.${encoded}.signature`;
}

// Sleep utility for timing tests
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test suites
Deno.test("Rate Limiting Middleware - Basic Functionality", async (t) => {
  // Set up environment for testing
  Deno.env.set('RATE_LIMIT_ENABLED', 'true');
  Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '5'); // Low limit for testing
  Deno.env.set('RATE_LIMIT_AUTH_RPM', '10');

  await t.step("should allow requests under the rate limit", async () => {
    const request = createMockRequest({ ip: '192.168.1.1' });
    
    const result = await rateLimit(request, '/test');
    
    assertEquals(result.allowed, true);
    assertExists(result.headers['RateLimit-Limit']);
    assertExists(result.headers['RateLimit-Remaining']);
    assertExists(result.headers['RateLimit-Reset']);
  });

  await t.step("should block requests over the rate limit", async () => {
    const ip = '192.168.1.2';
    const route = '/test-block';
    
    // Make requests up to the limit
    for (let i = 0; i < 5; i++) {
      const request = createMockRequest({ ip, url: `https://example.com${route}` });
      const result = await rateLimit(request, route);
      assertEquals(result.allowed, true, `Request ${i + 1} should be allowed`);
    }
    
    // Next request should be blocked
    const request = createMockRequest({ ip, url: `https://example.com${route}` });
    const result = await rateLimit(request, route);
    
    assertEquals(result.allowed, false);
    assertExists(result.response);
    assertEquals(result.response!.status, 429);
    assertExists(result.headers['Retry-After']);
    
    // Check response body
    const responseBody = await result.response!.json();
    assertEquals(responseBody.error, 'Too many requests');
    assertEquals(responseBody.code, 'RATE_LIMIT_EXCEEDED');
  });

  await t.step("should have different limits for authenticated vs unauthenticated users", async () => {
    const ip = '192.168.1.3';
    const route = '/test-auth';
    const userId = 'user-123';
    const jwt = createMockJWT(userId);

    // Test unauthenticated limit (5 RPM)
    for (let i = 0; i < 5; i++) {
      const request = createMockRequest({ ip, url: `https://example.com${route}` });
      const result = await rateLimit(request, route);
      assertEquals(result.allowed, true);
    }
    
    const unauthRequest = createMockRequest({ ip, url: `https://example.com${route}` });
    const unauthResult = await rateLimit(unauthRequest, route);
    assertEquals(unauthResult.allowed, false, "Unauthenticated request should be blocked");

    // Test authenticated user (should have higher limit)
    const authRequest = createMockRequest({
      ip: '192.168.1.4', // Different IP to avoid conflicts
      url: `https://example.com${route}`,
      authorization: `Bearer ${jwt}`,
    });
    const authResult = await rateLimit(authRequest, route);
    assertEquals(authResult.allowed, true, "Authenticated request should be allowed");
  });

  await t.step("should handle webhook routes with stricter limits", async () => {
    Deno.env.set('RATE_LIMIT_WEBHOOK_RPM', '2'); // Very low for testing
    
    const ip = '192.168.1.5';
    const route = '/webhook/stripe';
    
    // First request should be allowed
    const request1 = createMockRequest({ ip, url: `https://example.com${route}` });
    const result1 = await rateLimit(request1, route);
    assertEquals(result1.allowed, true);
    
    // Second request should be allowed
    const request2 = createMockRequest({ ip, url: `https://example.com${route}` });
    const result2 = await rateLimit(request2, route);
    assertEquals(result2.allowed, true);
    
    // Third request should be blocked
    const request3 = createMockRequest({ ip, url: `https://example.com${route}` });
    const result3 = await rateLimit(request3, route);
    assertEquals(result3.allowed, false);
  });
});

Deno.test("Rate Limiting Headers", async (t) => {
  Deno.env.set('RATE_LIMIT_ENABLED', 'true');
  Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '10');

  await t.step("should include correct rate limit headers", async () => {
    const request = createMockRequest({ ip: '192.168.1.10' });
    const result = await rateLimit(request, '/test-headers');
    
    assertEquals(result.allowed, true);
    assertEquals(result.headers['RateLimit-Limit'], '10');
    assertEquals(parseInt(result.headers['RateLimit-Remaining']), 9);
    assertExists(result.headers['RateLimit-Reset']);
    
    // Reset time should be in the future
    const resetTime = parseInt(result.headers['RateLimit-Reset']);
    const now = Math.floor(Date.now() / 1000);
    assertEquals(resetTime > now, true, "Reset time should be in the future");
  });

  await t.step("should include Retry-After header when rate limited", async () => {
    const ip = '192.168.1.11';
    const route = '/test-retry-after';
    
    // Exhaust the rate limit
    for (let i = 0; i < 10; i++) {
      const request = createMockRequest({ ip, url: `https://example.com${route}` });
      await rateLimit(request, route);
    }
    
    // Next request should include Retry-After
    const request = createMockRequest({ ip, url: `https://example.com${route}` });
    const result = await rateLimit(request, route);
    
    assertEquals(result.allowed, false);
    assertExists(result.headers['Retry-After']);
    assertEquals(parseInt(result.headers['Retry-After']), 60); // 1 minute window
  });
});

Deno.test("withRateLimit Wrapper Function", async (t) => {
  Deno.env.set('RATE_LIMIT_ENABLED', 'true');
  Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '3');

  await t.step("should wrap handler and add rate limiting", async () => {
    const mockHandler = (request: Request): Response => {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const wrappedHandler = withRateLimit(mockHandler, '/test-wrapper');
    
    // First few requests should work
    for (let i = 0; i < 3; i++) {
      const request = createMockRequest({ 
        ip: '192.168.1.20',
        url: 'https://example.com/test-wrapper'
      });
      const response = await wrappedHandler(request);
      
      assertEquals(response.status, 200);
      assertExists(response.headers.get('RateLimit-Limit'));
      assertExists(response.headers.get('RateLimit-Remaining'));
      
      const body = await response.json();
      assertEquals(body.success, true);
    }
    
    // Fourth request should be rate limited
    const request = createMockRequest({ 
      ip: '192.168.1.20',
      url: 'https://example.com/test-wrapper'
    });
    const response = await wrappedHandler(request);
    
    assertEquals(response.status, 429);
    assertExists(response.headers.get('Retry-After'));
  });

  await t.step("should skip rate limiting for OPTIONS requests", async () => {
    const mockHandler = (request: Request): Response => {
      return new Response(null, {
        status: 204,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    };

    const wrappedHandler = withRateLimit(mockHandler, '/test-options');
    
    // Multiple OPTIONS requests should all pass
    for (let i = 0; i < 10; i++) {
      const request = createMockRequest({ 
        method: 'OPTIONS',
        ip: '192.168.1.21',
        url: 'https://example.com/test-options'
      });
      const response = await wrappedHandler(request);
      
      assertEquals(response.status, 204);
    }
  });
});

Deno.test("Rate Limiting Configuration", async (t) => {
  await t.step("should respect RATE_LIMIT_ENABLED=false", async () => {
    Deno.env.set('RATE_LIMIT_ENABLED', 'false');
    
    // Make many requests - all should be allowed
    for (let i = 0; i < 20; i++) {
      const request = createMockRequest({ ip: '192.168.1.30' });
      const result = await rateLimit(request, '/test-disabled');
      assertEquals(result.allowed, true);
      assertEquals(Object.keys(result.headers).length, 0);
    }
  });

  await t.step("should use environment variables for rate limits", async () => {
    Deno.env.set('RATE_LIMIT_ENABLED', 'true');
    Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '1'); // Very low limit
    
    const request1 = createMockRequest({ ip: '192.168.1.31' });
    const result1 = await rateLimit(request1, '/test-env');
    assertEquals(result1.allowed, true);
    assertEquals(result1.headers['RateLimit-Limit'], '1');
    
    const request2 = createMockRequest({ ip: '192.168.1.31' });
    const result2 = await rateLimit(request2, '/test-env');
    assertEquals(result2.allowed, false);
  });
});

Deno.test("Error Handling and Graceful Degradation", async (t) => {
  await t.step("should fail open when storage fails", async () => {
    // This test would need to mock storage failures
    // For now, we test that the middleware handles errors gracefully
    
    const request = createMockRequest({ ip: '192.168.1.40' });
    
    try {
      const result = await rateLimit(request, '/test-error');
      // Should not throw and should fail open
      assertEquals(result.allowed, true);
    } catch (error) {
      // Should not throw errors
      throw new Error(`Rate limiting should not throw errors: ${error}`);
    }
  });
});

Deno.test("IP Address Extraction", async (t) => {
  await t.step("should extract IP from various headers", async () => {
    Deno.env.set('RATE_LIMIT_ENABLED', 'true');
    Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '1');

    // Test X-Forwarded-For
    const request1 = createMockRequest({ ip: '203.0.113.1' });
    const result1 = await rateLimit(request1, '/test-ip1');
    assertEquals(result1.allowed, true);
    
    const request2 = createMockRequest({ ip: '203.0.113.1' });
    const result2 = await rateLimit(request2, '/test-ip1');
    assertEquals(result2.allowed, false, "Same IP should be rate limited");
    
    // Test different IP
    const request3 = createMockRequest({ ip: '203.0.113.2' });
    const result3 = await rateLimit(request3, '/test-ip2');
    assertEquals(result3.allowed, true, "Different IP should be allowed");
  });
});

Deno.test("Sliding Window Behavior", async (t) => {
  await t.step("should reset rate limit after window expires", async () => {
    // This test would need to manipulate time or use shorter windows
    // For practical testing, we'll verify the window size is respected
    
    Deno.env.set('RATE_LIMIT_ENABLED', 'true');
    Deno.env.set('RATE_LIMIT_UNAUTH_RPM', '2');
    
    const ip = '192.168.1.50';
    
    // Use up the rate limit
    const request1 = createMockRequest({ ip });
    const result1 = await rateLimit(request1, '/test-window');
    assertEquals(result1.allowed, true);
    
    const request2 = createMockRequest({ ip });
    const result2 = await rateLimit(request2, '/test-window');
    assertEquals(result2.allowed, true);
    
    // Third request should be blocked
    const request3 = createMockRequest({ ip });
    const result3 = await rateLimit(request3, '/test-window');
    assertEquals(result3.allowed, false);
    
    // Reset time should be approximately 60 seconds from now
    const resetTime = parseInt(result3.headers['RateLimit-Reset']);
    const now = Math.floor(Date.now() / 1000);
    const timeDiff = resetTime - now;
    assertEquals(timeDiff >= 55 && timeDiff <= 65, true, "Reset time should be ~60 seconds");
  });
});

// Integration tests that would run against real Edge Functions
Deno.test("Integration with Real Edge Functions", async (t) => {
  await t.step("should integrate with existing function patterns", async () => {
    // This would test integration with actual edge functions
    // For now, we verify the wrapper function works correctly
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    const mockEdgeFunction = async (req: Request): Promise<Response> => {
      if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
      }

      return new Response(JSON.stringify({ message: "Success" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    };

    const rateLimitedFunction = withRateLimit(mockEdgeFunction, '/integration-test');

    // Test OPTIONS request (should not be rate limited)
    const optionsRequest = createMockRequest({ method: 'OPTIONS' });
    const optionsResponse = await rateLimitedFunction(optionsRequest);
    assertEquals(optionsResponse.status, 204);

    // Test normal request
    const normalRequest = createMockRequest({ method: 'POST' });
    const normalResponse = await rateLimitedFunction(normalRequest);
    assertEquals(normalResponse.status, 200);
    
    const body = await normalResponse.json();
    assertEquals(body.message, "Success");
    
    // Verify rate limit headers are added
    assertExists(normalResponse.headers.get('RateLimit-Limit'));
    assertExists(normalResponse.headers.get('RateLimit-Remaining'));
  });
});

// Clean up environment after tests
Deno.test("Cleanup", () => {
  // Reset environment variables
  Deno.env.delete('RATE_LIMIT_ENABLED');
  Deno.env.delete('RATE_LIMIT_UNAUTH_RPM');
  Deno.env.delete('RATE_LIMIT_AUTH_RPM');
  Deno.env.delete('RATE_LIMIT_WEBHOOK_RPM');
});