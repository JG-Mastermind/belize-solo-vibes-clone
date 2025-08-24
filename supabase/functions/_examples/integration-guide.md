# Rate Limiting Integration Guide

## Quick Integration Steps

### Method 1: Wrapper Function (Recommended)

1. **Import the middleware**
   ```typescript
   import { withRateLimit } from "../_middleware.ts";
   ```

2. **Wrap your existing handler**
   ```typescript
   // Before
   serve(myHandler);
   
   // After  
   serve(withRateLimit(myHandler, "/your-endpoint"));
   ```

3. **No other changes needed** - CORS, authentication, and error handling work as before

### Method 2: Manual Integration

1. **Import the rate limiting function**
   ```typescript
   import { rateLimit } from "../_middleware.ts";
   ```

2. **Add rate limiting check**
   ```typescript
   serve(async (req: Request) => {
     if (req.method === "OPTIONS") {
       return new Response(null, { headers: corsHeaders });
     }

     // Check rate limit
     const rateLimitResult = await rateLimit(req, "/your-endpoint");
     if (!rateLimitResult.allowed) {
       return rateLimitResult.response!;
     }

     // Your existing logic...
     const response = await yourOriginalHandler(req);

     // Add rate limit headers
     for (const [key, value] of Object.entries(rateLimitResult.headers)) {
       response.headers.set(key, value);
     }

     return response;
   });
   ```

## Configuration

Add your endpoint to `_rateLimit.config.json`:

```json
{
  "routes": {
    "/your-endpoint": {
      "windowSizeMs": 60000,
      "maxRequests": 100,
      "keyPrefix": "rl:your-endpoint:",
      "description": "Your endpoint description"
    }
  }
}
```

## Testing Integration

```bash
# Test that rate limiting works
for i in {1..10}; do
  curl -w "%{http_code} " -o /dev/null -s \
    https://your-project.supabase.co/functions/v1/your-endpoint
done
echo
```

Expected: `200 200 200 200 200 429 429 429 429 429` (after limit exceeded)

## Verification Checklist

- [ ] Rate limiting activates after configured limit
- [ ] 429 responses include proper headers and JSON error
- [ ] Rate limit headers added to successful responses
- [ ] OPTIONS requests not rate limited
- [ ] Existing functionality unchanged
- [ ] Authentication and CORS work as before