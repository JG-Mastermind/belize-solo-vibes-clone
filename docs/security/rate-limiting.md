# Edge Functions Rate Limiting System

## Overview

The Supabase Edge Functions rate limiting system provides production-grade protection against abuse, brute force attacks, and resource exhaustion. It implements a sliding window algorithm with configurable per-route policies, supporting both Redis (Upstash) and Deno KV storage backends.

## Architecture

### Components

1. **Middleware System** (`supabase/functions/_middleware.ts`)
   - Core rate limiting logic with sliding window algorithm
   - Redis (Upstash) primary storage with Deno KV fallback
   - Granular key generation (IP + route + auth-state)
   - Graceful degradation with fail-open behavior

2. **Configuration System** (`supabase/functions/_rateLimit.config.json`)
   - Per-route rate limiting policies
   - Environment-specific overrides
   - Security policies and alerting configuration

3. **Test Suite** (`supabase/functions/_tests/rateLimit.spec.ts`)
   - Comprehensive test coverage for all scenarios
   - Mock implementations for isolated testing
   - Integration tests with Edge Function patterns

## Environment Setup

### Required Environment Variables

```bash
# Rate Limiting Control
RATE_LIMIT_ENABLED=true                    # Enable/disable rate limiting (default: true)

# Storage Configuration (Redis preferred)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io  # Optional: Upstash Redis endpoint
UPSTASH_REDIS_REST_TOKEN=your_redis_token              # Optional: Upstash Redis token

# Default Rate Limits (requests per minute)
RATE_LIMIT_UNAUTH_RPM=60                  # Unauthenticated users (default: 60)
RATE_LIMIT_AUTH_RPM=300                   # Authenticated users (default: 300)
RATE_LIMIT_WEBHOOK_RPM=30                 # Webhook endpoints (default: 30)
```

### Upstash Redis Setup

1. **Create Upstash Redis Database**
   ```bash
   # Visit https://upstash.com/
   # Create account and new Redis database
   # Copy REST URL and token
   ```

2. **Configure Environment**
   ```bash
   # Add to your .env or deployment environment
   UPSTASH_REDIS_REST_URL=https://your-region-12345.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AXlsASQgMzNlNGQ2NDgtZjE5...
   ```

3. **Verify Connection**
   ```bash
   # Test Redis connectivity
   curl -X POST https://your-redis.upstash.io \
     -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
     -H "Content-Type: application/json" \
     -d '["PING"]'
   ```

## Usage

### Method 1: Wrapper Function (Recommended)

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { withRateLimit } from "../_middleware.ts";

const handler = async (req: Request): Promise<Response> => {
  // Your existing edge function logic
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

// Wrap with rate limiting
serve(withRateLimit(handler, "/your-endpoint"));
```

### Method 2: Manual Integration

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { rateLimit } from "../_middleware.ts";

serve(async (req: Request): Promise<Response> => {
  // Skip rate limiting for OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check rate limit
  const rateLimitResult = await rateLimit(req, "/your-endpoint");
  
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  // Your logic here
  const response = new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });

  // Add rate limit headers
  for (const [key, value] of Object.entries(rateLimitResult.headers)) {
    response.headers.set(key, value);
  }

  return response;
});
```

## Configuration

### Per-Route Policies

The system supports fine-grained rate limiting policies per endpoint:

```json
{
  "routes": {
    "/stripe-webhook": {
      "windowSizeMs": 60000,
      "maxRequests": 10,
      "keyPrefix": "rl:stripe:",
      "description": "Stripe webhook endpoint - very strict limits"
    },
    "/create-payment-intent": {
      "windowSizeMs": 300000,
      "maxRequests": 20,
      "keyPrefix": "rl:payment:",
      "description": "Payment intent creation - prevent spam bookings (5 min window)"
    }
  }
}
```

### Environment-Specific Configuration

```json
{
  "environments": {
    "development": {
      "enabled": false,
      "multiplier": 10
    },
    "production": {
      "enabled": true,
      "multiplier": 1
    }
  }
}
```

### Security Policies

```json
{
  "securityPolicies": {
    "burstProtection": {
      "enabled": true,
      "burstThreshold": 10,
      "burstWindowMs": 1000
    },
    "progressiveBackoff": {
      "enabled": true,
      "multiplier": 2,
      "maxBackoffMs": 300000
    }
  }
}
```

## Rate Limit Categories

### 1. Authentication Endpoints
- **Limit**: 10 requests/minute
- **Window**: 1 minute
- **Purpose**: Prevent brute force attacks
- **Endpoints**: `/test-auth`, password reset functions

### 2. Payment Endpoints  
- **Limit**: 15-20 requests/5 minutes
- **Window**: 5 minutes
- **Purpose**: Prevent payment spam and fraud
- **Endpoints**: `/create-payment-intent`, `/create-payment`

### 3. Admin Functions
- **Limit**: 3-10 requests/5 minutes  
- **Window**: 5 minutes
- **Purpose**: Protect sensitive administrative operations
- **Endpoints**: `/create-admin-user`, `/delete-user`, admin invitations

### 4. Webhook Endpoints
- **Limit**: 10-30 requests/minute
- **Window**: 1 minute  
- **Purpose**: Prevent webhook abuse
- **Endpoints**: `/stripe-webhook`, generic `/webhook/*`

### 5. Resource-Intensive Operations
- **Limit**: 5-10 requests/10 minutes
- **Window**: 10 minutes
- **Purpose**: Prevent resource exhaustion
- **Endpoints**: Blog generation, image processing, SEO analysis

### 6. Public Read Operations
- **Limit**: 100-200 requests/minute
- **Window**: 1 minute
- **Purpose**: Allow reasonable public access
- **Endpoints**: `/popular-adventures`, public content APIs

## Response Headers

The system adds standard rate limiting headers to all responses:

```http
RateLimit-Limit: 300
RateLimit-Remaining: 299
RateLimit-Reset: 1693872000
Retry-After: 60
```

### Header Descriptions

- **RateLimit-Limit**: Maximum requests allowed in the time window
- **RateLimit-Remaining**: Requests remaining in current window
- **RateLimit-Reset**: Unix timestamp when the rate limit resets
- **Retry-After**: Seconds to wait before retrying (included in 429 responses)

## Error Response

When rate limited, the system returns a 429 status with detailed error information:

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 60,
    "windowMs": 60000,
    "retryAfter": 60
  }
}
```

## Key Generation Strategy

The system uses a hierarchical key generation strategy for granular control:

```
Pattern: {keyPrefix}{route}:{userType}:{identifier}

Examples:
- rl:unauth:/create-payment:ip:192.168.1.1
- rl:auth:/get-profile:user:user-123-456
- rl:webhook:/stripe-webhook:ip:203.0.113.1
```

### Key Components

1. **Route**: Endpoint path for per-route limits
2. **User Type**: `ip` for unauthenticated, `user` for authenticated
3. **Identifier**: IP address or user ID for isolation

## Storage Backends

### Primary: Upstash Redis

**Advantages:**
- High performance and reliability
- Global replication for low latency
- Atomic operations for accurate counting
- TTL support for automatic cleanup

**Configuration:**
```typescript
const storage = new RedisStorage(
  Deno.env.get('UPSTASH_REDIS_REST_URL')!,
  Deno.env.get('UPSTASH_REDIS_REST_TOKEN')!
);
```

### Fallback: Deno KV

**Advantages:**
- Built into Deno runtime
- No external dependencies
- Automatic scaling with Deno Deploy

**Limitations:**
- Regional consistency may vary
- Less mature than Redis for high-volume scenarios

## Testing

### Running Tests

```bash
# Run all rate limiting tests
deno test supabase/functions/_tests/rateLimit.spec.ts --allow-net --allow-env --allow-read

# Run specific test suite
deno test supabase/functions/_tests/rateLimit.spec.ts --allow-net --allow-env --allow-read --filter "Basic Functionality"
```

### Test Coverage

- ✅ Basic rate limiting functionality
- ✅ Rate limit headers validation  
- ✅ 429 error response format
- ✅ Authenticated vs unauthenticated limits
- ✅ Per-route configuration
- ✅ Webhook endpoint protection
- ✅ Wrapper function integration
- ✅ Environment variable configuration
- ✅ Graceful degradation on storage failure
- ✅ IP address extraction from headers

### Manual Testing

```bash
# Test rate limiting with curl
for i in {1..10}; do
  curl -w "%{http_code}\n" -o /dev/null -s \
    -X POST https://your-project.supabase.co/functions/v1/test-endpoint
done
```

Expected output: `200 200 200 200 200 429 429 429 429 429`

## Monitoring and Alerting

### Metrics to Monitor

1. **Rate Limit Violations**: Track 429 responses by endpoint
2. **Storage Performance**: Monitor Redis/KV response times  
3. **False Positives**: Legitimate requests being blocked
4. **Abuse Patterns**: Repeated violations from same IPs/users

### Log Analysis

```bash
# Search for rate limit violations
grep "RATE_LIMIT_EXCEEDED" /var/log/edge-functions.log

# Monitor specific endpoints
grep "429" /var/log/edge-functions.log | grep "/stripe-webhook"
```

### Alerting Configuration

```json
{
  "alerting": {
    "enabled": true,
    "thresholdPercentage": 80,
    "webhookUrl": "https://your-monitoring-service.com/webhook"
  }
}
```

## Security Considerations

### Attack Vectors Mitigated

1. **Brute Force Attacks**: Auth endpoint protection
2. **DDoS/Resource Exhaustion**: Per-IP rate limiting
3. **API Abuse**: Per-route granular controls
4. **Payment Fraud**: Strict payment endpoint limits
5. **Webhook Flooding**: Webhook-specific protections

### Best Practices

1. **Fail Open**: Allow requests if rate limiting system fails
2. **Graduated Limits**: Different limits for different user types
3. **Clear Error Messages**: Help legitimate users understand limits
4. **Monitoring**: Track violations and adjust limits as needed
5. **Regular Review**: Update limits based on usage patterns

### Security Headers

The system respects and preserves existing security headers while adding rate limiting information.

## Troubleshooting

### Common Issues

1. **Rate Limiting Not Working**
   ```bash
   # Check environment variables
   echo $RATE_LIMIT_ENABLED
   echo $RATE_LIMIT_UNAUTH_RPM
   
   # Verify storage connection
   curl -X POST $UPSTASH_REDIS_REST_URL \
     -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
     -d '["PING"]'
   ```

2. **Legitimate Users Being Blocked**
   ```json
   {
     "solution": "Increase rate limits or add IP whitelist",
     "config": {
       "maxRequests": 120,
       "windowSizeMs": 60000
     }
   }
   ```

3. **Storage Errors**
   ```bash
   # Check Deno KV fallback is working
   # Verify Redis connectivity and credentials
   # Monitor error logs for storage failures
   ```

### Debug Mode

Enable detailed logging for troubleshooting:

```typescript
// Add to environment
DEBUG_RATE_LIMIT=true

// Logs will include:
// - Rate limit checks and results
// - Storage operations  
// - Key generation details
// - Error stack traces
```

## Performance Considerations

### Optimization Tips

1. **Use Redis for High Volume**: Upstash Redis for production workloads
2. **Efficient Key Design**: Minimize storage overhead with short prefixes
3. **TTL Management**: Automatic cleanup prevents storage bloat
4. **Connection Pooling**: Redis client handles connection management

### Scalability

- **Redis**: Handles thousands of requests per second
- **Deno KV**: Scales automatically with Deno Deploy
- **Memory Usage**: Minimal overhead per rate limit check
- **Latency**: Sub-millisecond rate limit checks with Redis

## Future Enhancements

### Planned Features

1. **Distributed Rate Limiting**: Cross-region consistency
2. **Dynamic Rate Adjustments**: ML-based rate limit optimization  
3. **User Reputation**: Adjust limits based on user behavior
4. **Advanced Analytics**: Rate limiting insights and reports
5. **IP Geolocation**: Country-based rate limiting policies

### Integration Opportunities

1. **Supabase Dashboard**: Rate limiting metrics and controls
2. **Real-time Notifications**: Instant alerts for violations
3. **A/B Testing**: Rate limit experiments
4. **Business Logic**: Custom rate limiting rules per customer tier

## Maintenance

### Regular Tasks

1. **Monitor Usage**: Review rate limiting metrics monthly
2. **Update Limits**: Adjust based on traffic patterns
3. **Clean Configuration**: Remove unused route policies  
4. **Test Recovery**: Verify graceful degradation works
5. **Security Review**: Ensure protection against new attack vectors

### Configuration Updates

To modify rate limits without deployment:

1. Update `_rateLimit.config.json`
2. Redeploy affected Edge Functions
3. Monitor for impact on legitimate traffic
4. Adjust if false positives increase

---

**Author**: Backend Architecture Guardian  
**Version**: 1.0  
**Last Updated**: August 2025  
**Status**: Production Ready