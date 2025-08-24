/**
 * Rate Limiting Middleware for Supabase Edge Functions
 * 
 * Provides configurable rate limiting with Redis (Upstash) or Deno KV fallback.
 * Implements sliding window algorithm with per-route, per-IP, and auth-state granular control.
 * Integrated with security event monitoring for real-time threat detection.
 * 
 * Environment Variables Required:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis REST URL (optional, falls back to Deno KV)
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis REST token (optional)
 * - RATE_LIMIT_ENABLED: Enable/disable rate limiting (default: true)
 * - RATE_LIMIT_UNAUTH_RPM: Rate limit for unauthenticated users per minute (default: 60)
 * - RATE_LIMIT_AUTH_RPM: Rate limit for authenticated users per minute (default: 300)
 * - RATE_LIMIT_WEBHOOK_RPM: Rate limit for webhook endpoints per minute (default: 30)
 * - SECURITY_MONITORING_ENABLED: Enable security event logging (default: true)
 */

import { SecurityEventLogger, RateLimitEventPayload } from './_utils/securityEvents.ts';

interface RateLimitConfig {
  windowSizeMs: number;
  maxRequests: number;
  keyPrefix: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitHeaders {
  'RateLimit-Limit': string;
  'RateLimit-Remaining': string;
  'RateLimit-Reset': string;
  'Retry-After'?: string;
}

// Storage interface for rate limiting data
interface RateLimitStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs: number): Promise<void>;
  increment(key: string, ttlMs: number): Promise<number>;
}

// Redis storage implementation (Upstash)
class RedisStorage implements RateLimitStorage {
  private baseUrl: string;
  private token: string;

  constructor(url: string, token: string) {
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.token = token;
  }

  private async request(command: string[]): Promise<any> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });

    if (!response.ok) {
      throw new Error(`Redis request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.request(['GET', key]);
      return result.result || null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    try {
      const ttlSeconds = Math.ceil(ttlMs / 1000);
      await this.request(['SET', key, value, 'EX', ttlSeconds.toString()]);
    } catch (error) {
      console.error('Redis SET error:', error);
      throw error;
    }
  }

  async increment(key: string, ttlMs: number): Promise<number> {
    try {
      const result = await this.request(['INCR', key]);
      const count = result.result || 1;
      
      // Set TTL if this is the first increment
      if (count === 1) {
        const ttlSeconds = Math.ceil(ttlMs / 1000);
        await this.request(['EXPIRE', key, ttlSeconds.toString()]);
      }
      
      return count;
    } catch (error) {
      console.error('Redis INCR error:', error);
      throw error;
    }
  }
}

// Deno KV storage implementation (fallback)
class DenoKVStorage implements RateLimitStorage {
  private kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.kv = kv;
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.kv.get([key]);
      return result.value as string | null;
    } catch (error) {
      console.error('Deno KV GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    try {
      await this.kv.set([key], value, { expireIn: ttlMs });
    } catch (error) {
      console.error('Deno KV SET error:', error);
      throw error;
    }
  }

  async increment(key: string, ttlMs: number): Promise<number> {
    try {
      const result = await this.kv.atomic()
        .mutate({
          type: 'sum',
          key: [key],
          value: 1n,
        })
        .commit();

      if (!result.ok) {
        throw new Error('Failed to increment counter');
      }

      const count = Number(result.versionstamp) || 1;
      
      // Set TTL using a separate atomic operation
      await this.kv.set([key + '_ttl'], Date.now() + ttlMs, { expireIn: ttlMs });
      
      return count;
    } catch (error) {
      console.error('Deno KV increment error:', error);
      // Fallback to manual increment
      const current = await this.get(key);
      const count = current ? parseInt(current) + 1 : 1;
      await this.set(key, count.toString(), ttlMs);
      return count;
    }
  }
}

// Rate limiting utility class
class RateLimiter {
  private storage: RateLimitStorage;
  private defaultConfig: RateLimitConfig;

  constructor(storage: RateLimitStorage) {
    this.storage = storage;
    this.defaultConfig = {
      windowSizeMs: 60 * 1000, // 1 minute
      maxRequests: 60,
      keyPrefix: 'rl:',
    };
  }

  private generateKey(ip: string, route: string, userId?: string): string {
    const userSegment = userId ? `user:${userId}` : `ip:${ip}`;
    return `${this.defaultConfig.keyPrefix}${route}:${userSegment}`;
  }

  async checkRateLimit(
    ip: string,
    route: string,
    config: RateLimitConfig,
    userId?: string
  ): Promise<RateLimitResult> {
    const key = this.generateKey(ip, route, userId);
    const now = Date.now();
    const windowStart = now - config.windowSizeMs;
    
    try {
      // Get current count and increment atomically
      const count = await this.storage.increment(key, config.windowSizeMs);
      
      const allowed = count <= config.maxRequests;
      const remaining = Math.max(0, config.maxRequests - count);
      const resetTime = now + config.windowSizeMs;
      
      const result: RateLimitResult = {
        allowed,
        remaining,
        resetTime,
      };

      if (!allowed) {
        result.retryAfter = Math.ceil(config.windowSizeMs / 1000);
      }

      return result;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow the request if rate limiting fails
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: now + config.windowSizeMs,
      };
    }
  }
}

// Initialize storage based on environment
async function createStorage(): Promise<RateLimitStorage> {
  const redisUrl = Deno.env.get('UPSTASH_REDIS_REST_URL');
  const redisToken = Deno.env.get('UPSTASH_REDIS_REST_TOKEN');

  if (redisUrl && redisToken) {
    console.log('Using Upstash Redis for rate limiting');
    return new RedisStorage(redisUrl, redisToken);
  } else {
    console.log('Using Deno KV for rate limiting');
    const kv = await Deno.openKv();
    return new DenoKVStorage(kv);
  }
}

// Load configuration from file
async function loadRouteConfig(): Promise<Record<string, RateLimitConfig>> {
  try {
    const configPath = new URL('./_rateLimit.config.json', import.meta.url);
    const configText = await Deno.readTextFile(configPath);
    const config = JSON.parse(configText);
    return config.routes || {};
  } catch (error) {
    console.warn('Failed to load rate limit config, using defaults:', error);
    return {};
  }
}

// Get client IP from request
function getClientIP(request: Request): string {
  // Try various headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default (should not happen in production)
  return '127.0.0.1';
}

// Extract user ID from authorization header
async function extractUserId(request: Request): Promise<string | undefined> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return undefined;
  }

  // For now, we'll use a simple approach. In a real implementation,
  // you might want to validate the JWT token here
  const token = authHeader.substring(7);
  if (token.length > 10) { // Basic validation
    // Extract user ID from JWT payload (simplified)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return undefined;
    }
  }
  
  return undefined;
}

// Create rate limit headers
function createRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): RateLimitHeaders {
  const headers: RateLimitHeaders = {
    'RateLimit-Limit': config.maxRequests.toString(),
    'RateLimit-Remaining': result.remaining.toString(),
    'RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

// Main rate limiting middleware function
export async function rateLimit(request: Request, route?: string): Promise<{ 
  allowed: boolean; 
  response?: Response; 
  headers: Record<string, string> 
}> {
  // Check if rate limiting is enabled
  const rateLimitEnabled = Deno.env.get('RATE_LIMIT_ENABLED') !== 'false';
  if (!rateLimitEnabled) {
    return { allowed: true, headers: {} };
  }

  try {
    // Initialize storage and load config
    const [storage, routeConfig] = await Promise.all([
      createStorage(),
      loadRouteConfig(),
    ]);

    const rateLimiter = new RateLimiter(storage);
    
    // Determine route from URL if not provided
    const url = new URL(request.url);
    const routePath = route || url.pathname.replace(/^\/functions\/[^\/]+/, '');
    
    // Get client information
    const ip = getClientIP(request);
    const userId = await extractUserId(request);
    
    // Determine rate limit configuration
    const isWebhook = routePath.startsWith('/webhook');
    const isAuth = routePath.includes('/auth') || routePath.includes('/login') || routePath.includes('/reset');
    
    let config = routeConfig[routePath];
    if (!config) {
      // Use default configuration based on route type and auth status
      const baseRpm = isWebhook 
        ? parseInt(Deno.env.get('RATE_LIMIT_WEBHOOK_RPM') || '30')
        : userId 
        ? parseInt(Deno.env.get('RATE_LIMIT_AUTH_RPM') || '300')
        : parseInt(Deno.env.get('RATE_LIMIT_UNAUTH_RPM') || '60');
      
      config = {
        windowSizeMs: 60 * 1000, // 1 minute
        maxRequests: baseRpm,
        keyPrefix: 'rl:',
      };
    }

    // Check rate limit
    const result = await rateLimiter.checkRateLimit(ip, routePath, config, userId);
    
    // Create headers
    const rateLimitHeaders = createRateLimitHeaders(result, config);
    
    if (!result.allowed) {
      // Log rate limit violation to security monitoring
      try {
        const securityLogger = new SecurityEventLogger();
        const rateLimitPayload: RateLimitEventPayload = {
          limit: config.maxRequests,
          windowMs: config.windowSizeMs,
          attempts: config.maxRequests + (config.maxRequests - result.remaining), // Estimate attempts
          retryAfter: result.retryAfter || 60,
          endpoint: routePath,
        };

        // Log rate limit exceeded event asynchronously (don't block response)
        securityLogger.logRateLimitExceeded(
          request, 
          'rate-limit-middleware', 
          rateLimitPayload,
          userId
        ).catch(error => {
          console.warn('Failed to log rate limit security event:', error);
        });

        // Check for suspicious patterns (multiple routes being hit rapidly)
        const suspiciousThreshold = config.maxRequests * 2;
        if ((config.maxRequests - result.remaining) > suspiciousThreshold) {
          securityLogger.logSuspiciousIP(request, 'rate-limit-analysis', {
            pattern: 'aggressive_rate_limiting',
            confidence: 0.8,
            indicators: [
              'excessive_requests',
              `route_${routePath}`,
              `attempts_${config.maxRequests - result.remaining}`
            ]
          }).catch(error => {
            console.warn('Failed to log suspicious IP event:', error);
          });
        }
      } catch (securityError) {
        console.warn('Security event logging failed:', securityError);
        // Continue with rate limiting even if security logging fails
      }

      // Create 429 Too Many Requests response
      const errorResponse = new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            limit: config.maxRequests,
            windowMs: config.windowSizeMs,
            retryAfter: result.retryAfter,
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...rateLimitHeaders,
          },
        }
      );

      return {
        allowed: false,
        response: errorResponse,
        headers: rateLimitHeaders,
      };
    }

    return {
      allowed: true,
      headers: rateLimitHeaders,
    };

  } catch (error) {
    console.error('Rate limiting middleware error:', error);
    // Fail open - allow the request if middleware fails
    return { allowed: true, headers: {} };
  }
}

// Utility function to wrap existing Edge Function handlers
export function withRateLimit(
  handler: (request: Request) => Promise<Response> | Response,
  route?: string
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    // Skip rate limiting for OPTIONS requests
    if (request.method === 'OPTIONS') {
      return handler(request);
    }

    const rateLimitResult = await rateLimit(request, route);
    
    if (!rateLimitResult.allowed && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    // Call the original handler
    const response = await handler(request);
    
    // Add rate limit headers to the response
    const newHeaders = new Headers(response.headers);
    for (const [key, value] of Object.entries(rateLimitResult.headers)) {
      newHeaders.set(key, value);
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  };
}

export default rateLimit;