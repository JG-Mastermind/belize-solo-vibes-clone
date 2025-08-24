# Secure Coding Guidelines

**Project**: BelizeVibes.com Tourism Platform  
**Tech Stack**: React 18 + TypeScript + Vite + Supabase + Stripe  
**Version**: 1.0  
**Last Updated**: August 24, 2025  

## 📋 Quick Reference

| Security Area | Key Pattern | Documentation Section |
|---------------|-------------|----------------------|
| Authentication | `RequireRole(['admin'])` + JWT validation | [Authentication Security](#authentication-security) |
| Database | RLS policies + parameterized queries | [Database Security](#database-security) |
| Input Validation | Zod schemas + sanitization | [Input Validation](#input-validation) |
| API Security | Rate limiting + CORS | [API Security](#api-security) |
| Secrets | Environment variables only | [Secrets Management](#secrets-management) |

---

## 🔐 Authentication Security

### Role-Based Access Control (RBAC)

#### ✅ DO: Use RequireRole Component
```typescript
// Protect admin routes with role-based access
import RequireRole from '@/components/auth/RequireRole';

function AdminDashboard() {
  return (
    <RequireRole requiredRoles={['admin', 'super_admin']}>
      <div>Admin-only content</div>
    </RequireRole>
  );
}

// Protect API routes with role checking
import { getUserRole } from '@/lib/auth';

export default async function handler(req: Request) {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const userRole = await getUserRole(user.id);
  if (!['admin', 'super_admin'].includes(userRole?.role)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Process admin request
}
```

#### ❌ DON'T: Trust Client-Side Role Data
```typescript
// NEVER trust user metadata directly from client
const user = supabase.auth.getUser();
if (user.user_metadata.role === 'admin') {  // ❌ Can be forged
  // Admin logic - SECURITY VULNERABILITY
}

// NEVER rely on URL patterns for security
if (window.location.pathname.includes('/admin')) {  // ❌ Bypassable
  // Admin logic - SECURITY VULNERABILITY  
}
```

### JWT Token Handling

#### ✅ DO: Secure Token Management
```typescript
// Use secure cookie storage with proper flags
const session = await supabase.auth.getSession();
if (session.data.session) {
  // Token is automatically managed by Supabase client
  const { data, error } = await supabase
    .from('secure_table')
    .select('*')
    .single();
}

// Implement token refresh logic
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    // Update client state with new token
    setSession(session);
  }
});
```

#### ❌ DON'T: Insecure Token Storage
```typescript
// NEVER store tokens in localStorage
localStorage.setItem('supabase_token', token);  // ❌ XSS vulnerable

// NEVER log tokens
console.log('User token:', session.access_token);  // ❌ Exposes in logs

// NEVER pass tokens in URLs
window.location.href = `/admin?token=${token}`;  // ❌ Logged in access logs
```

---

## 🗄️ Database Security

### Row Level Security (RLS) Policies

#### ✅ DO: Explicit RLS Policies
```sql
-- Enable RLS on all public tables
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Create explicit, restrictive policies
CREATE POLICY "Users can only view published tours"
ON public.tours FOR SELECT
USING (is_published = true OR user_id = auth.uid());

CREATE POLICY "Only admins can insert tours"
ON public.tours FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super_admin')
  )
);

-- Pin search_path in SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION accept_admin_invitation(invitation_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- ✅ Prevents SQL injection
AS $$
BEGIN
  -- Function logic here
END;
$$;
```

#### ❌ DON'T: Weak or Missing RLS
```sql
-- NEVER create overly broad policies
CREATE POLICY "Allow all access" 
ON sensitive_table USING (true);  -- ❌ No security

-- NEVER disable RLS globally
SET row_security = off;  -- ❌ Bypasses all protection

-- NEVER create SECURITY DEFINER without search_path
CREATE FUNCTION risky_function()
SECURITY DEFINER  -- ❌ SQL injection risk
AS $$
  -- Dynamic SQL without search_path pinning
$$;
```

### Parameterized Queries

#### ✅ DO: Use Supabase Client Methods
```typescript
// Safe parameterized queries with Supabase client
const { data, error } = await supabase
  .from('tours')
  .select('*')
  .eq('id', tourId)  // ✅ Automatically parameterized
  .single();

// Safe RPC calls with parameters
const { data, error } = await supabase
  .rpc('search_tours', {
    search_term: userInput,  // ✅ Safely parameterized
    max_price: priceLimit
  });

// Safe text search with proper escaping
const { data, error } = await supabase
  .from('tours')
  .textSearch('title', searchQuery, {
    type: 'websearch',  // ✅ Prevents injection
    config: 'english'
  });
```

#### ❌ DON'T: Dynamic SQL Construction
```typescript
// NEVER construct raw SQL with user input
const query = `SELECT * FROM tours WHERE title LIKE '%${userInput}%'`;  // ❌ SQL injection

// NEVER use string interpolation in RPC calls
const result = await supabase.rpc('unsafe_function', {
  sql_fragment: `AND user_id = ${userId}`  // ❌ SQL injection
});

// NEVER trust user input in database functions
const { data } = await supabase
  .from('tours')
  .select(`*, ${userSelectFields}`)  // ❌ Can expose sensitive columns
  .single();
```

---

## ✅ Input Validation

### Schema-Based Validation with Zod

#### ✅ DO: Comprehensive Input Validation
```typescript
import { z } from 'zod';

// Define strict validation schemas
const TourCreateSchema = z.object({
  title: z.string().min(1).max(100).trim(),
  description: z.string().min(10).max(2000),
  price: z.number().positive().max(10000),
  duration: z.number().int().positive().max(14),
  max_participants: z.number().int().positive().max(50),
  location: z.string().min(1).max(100),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  is_published: z.boolean().default(false)
});

// Validate on both client and server
export async function createTour(formData: FormData) {
  // Client-side validation
  const result = TourCreateSchema.safeParse(Object.fromEntries(formData));
  
  if (!result.success) {
    return { error: 'Invalid input data', details: result.error.issues };
  }
  
  // Server-side validation (Edge Function)
  const response = await fetch('/functions/v1/create-tour', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result.data)
  });
  
  return response.json();
}

// Edge Function validation
export default async function handler(req: Request) {
  const body = await req.json();
  
  // Always validate on server side
  const result = TourCreateSchema.safeParse(body);
  if (!result.success) {
    return new Response(JSON.stringify({ 
      error: 'Validation failed', 
      issues: result.error.issues 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Process validated data
  const { data, error } = await supabase
    .from('tours')
    .insert(result.data)
    .single();
    
  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

#### ❌ DON'T: Trust User Input
```typescript
// NEVER skip validation
async function createTour(data: any) {  // ❌ No validation
  return await supabase.from('tours').insert(data);
}

// NEVER rely only on client-side validation
function handleSubmit(formData: FormData) {
  // Client validation only - ❌ Can be bypassed
  if (formData.get('title').length > 0) {
    submitToServer(formData);
  }
}

// NEVER trust file uploads without validation
async function uploadImage(file: File) {
  // ❌ No file type or size validation
  const { data } = await supabase.storage
    .from('images')
    .upload(`public/${file.name}`, file);
}
```

### File Upload Security

#### ✅ DO: Secure File Handling
```typescript
import { z } from 'zod';

// Define file validation schema
const ImageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'File must be under 5MB')
    .refine(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 
            'Only JPEG, PNG, and WebP images allowed')
    .refine(file => !file.name.includes('..'), 'Invalid file name')
});

async function uploadTourImage(file: File, tourId: string): Promise<string | null> {
  // Validate file
  const validation = ImageUploadSchema.safeParse({ file });
  if (!validation.success) {
    throw new Error(`File validation failed: ${validation.error.message}`);
  }
  
  // Generate safe file name
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `tour-${tourId}-${Date.now()}.${fileExt}`;
  
  // Upload with access control
  const { data, error } = await supabase.storage
    .from('tour-images')
    .upload(`public/${fileName}`, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Upload failed:', error);
    return null;
  }
  
  return data.path;
}
```

#### ❌ DON'T: Unsafe File Operations
```typescript
// NEVER trust file extensions or MIME types alone
async function uploadFile(file: File) {
  // ❌ Can be spoofed by attackers
  if (file.name.endsWith('.jpg')) {
    return supabase.storage.from('uploads').upload(file.name, file);
  }
}

// NEVER allow arbitrary file paths
async function uploadWithPath(file: File, userPath: string) {
  // ❌ Path traversal vulnerability
  return supabase.storage
    .from('uploads')
    .upload(userPath, file);  // Could be '../../../sensitive.txt'
}

// NEVER skip file size validation
async function uploadLargeFile(file: File) {
  // ❌ Could cause storage/memory issues
  return supabase.storage.from('uploads').upload(file.name, file);
}
```

---

## 🌐 API Security

### Edge Function Security Patterns

#### ✅ DO: Comprehensive API Security
```typescript
// Complete security middleware pattern
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Validate request method
  if (!['POST', 'GET'].includes(req.method)) {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }
  
  // Initialize Supabase client with RLS
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
  
  // Authenticate request
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { 
      status: 401, 
      headers: corsHeaders 
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);
  
  if (error || !user) {
    return new Response('Unauthorized', { 
      status: 401, 
      headers: corsHeaders 
    });
  }
  
  // Set user context for RLS
  supabaseClient.auth.setAuth(token);
  
  // Validate and rate limit
  const clientIP = req.headers.get('CF-Connecting-IP') || 
                   req.headers.get('X-Forwarded-For') || 
                   'unknown';
                   
  if (await isRateLimited(clientIP, 'api-endpoint')) {
    return new Response('Too Many Requests', { 
      status: 429, 
      headers: corsHeaders 
    });
  }
  
  try {
    // Process request with validated input
    const requestData = await req.json();
    const validatedData = await validateInput(requestData);
    
    const result = await processRequest(validatedData, user, supabaseClient);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    // Log error securely (no sensitive data)
    console.error('API Error:', {
      timestamp: new Date().toISOString(),
      endpoint: req.url,
      method: req.method,
      error: error.message,
      userId: user.id
    });
    
    return new Response('Internal Server Error', {
      status: 500,
      headers: corsHeaders
    });
  }
}
```

#### ❌ DON'T: Insecure API Patterns
```typescript
// NEVER skip authentication
export default async function handler(req: Request) {
  // ❌ No authentication check
  const data = await supabase.from('sensitive_data').select('*');
  return new Response(JSON.stringify(data));
}

// NEVER expose sensitive data in errors
export default async function handler(req: Request) {
  try {
    // API logic
  } catch (error) {
    // ❌ Exposes internal details
    return new Response(JSON.stringify({
      error: error.message,
      stack: error.stack,  // ❌ Shows internal structure
      sql: error.query     // ❌ Exposes database queries
    }));
  }
}

// NEVER trust request origins without validation
export default async function handler(req: Request) {
  // ❌ No CORS validation
  const response = new Response(JSON.stringify(data));
  response.headers.set('Access-Control-Allow-Origin', '*');  // ❌ Too permissive
  return response;
}
```

### Rate Limiting Implementation

#### ✅ DO: Comprehensive Rate Limiting
```typescript
// Rate limiting with different tiers
import { rateLimitConfig } from '../_rateLimit.config.json';

interface RateLimitConfig {
  [key: string]: {
    requests: number;
    window: number; // seconds
    burst?: number;
  };
}

async function checkRateLimit(
  ip: string, 
  endpoint: string, 
  userId?: string
): Promise<boolean> {
  const config = rateLimitConfig[endpoint] || rateLimitConfig.default;
  
  // Use more generous limits for authenticated users
  const limit = userId ? config.requests * 2 : config.requests;
  const window = config.window * 1000; // Convert to milliseconds
  
  const key = userId ? `rate_limit:${userId}:${endpoint}` : `rate_limit:${ip}:${endpoint}`;
  
  // Sliding window rate limiting with Redis
  const pipeline = redis.pipeline();
  const now = Date.now();
  const windowStart = now - window;
  
  pipeline.zremrangebyscore(key, '-inf', windowStart);
  pipeline.zadd(key, now, `${now}-${Math.random()}`);
  pipeline.zcount(key, windowStart, now);
  pipeline.expire(key, Math.ceil(window / 1000));
  
  const results = await pipeline.exec();
  const requestCount = results[2][1] as number;
  
  return requestCount <= limit;
}
```

#### ❌ DON'T: Weak Rate Limiting
```typescript
// NEVER use client-side rate limiting only
const requestCount = localStorage.getItem('requestCount');  // ❌ Bypassable

// NEVER use overly permissive limits
const rateLimits = {
  'admin-create-user': { requests: 1000, window: 60 }  // ❌ Too high for sensitive operation
};

// NEVER forget to implement rate limiting
export default async function sensitiveHandler(req: Request) {
  // ❌ No rate limiting on sensitive endpoint
  return await deleteAllUsers();
}
```

---

## 🔑 Secrets Management

### Environment Variables

#### ✅ DO: Proper Secret Handling
```typescript
// Use environment variables for all secrets
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Validate environment in development
function validateEnvironment() {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'STRIPE_PUBLIC_KEY',
    'OPENAI_API_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !Deno.env.get(varName));
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

// Use different keys for different environments
const stripeKey = Deno.env.get('NODE_ENV') === 'production' 
  ? Deno.env.get('STRIPE_SECRET_KEY_LIVE')
  : Deno.env.get('STRIPE_SECRET_KEY_TEST');
```

#### ❌ DON'T: Hardcode Secrets
```typescript
// NEVER hardcode API keys or secrets
const supabase = createClient(
  'https://abc123.supabase.co',           // ❌ Hardcoded URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ❌ Hardcoded key
);

const stripe = new Stripe('sk_live_abc123...');  // ❌ Production key in code

// NEVER commit .env files with real secrets
// .env.production (in git) - ❌ NEVER DO THIS
SUPABASE_URL=https://real-project.supabase.co
SUPABASE_ANON_KEY=real_secret_key_here

// NEVER log secrets
console.log('Using API key:', process.env.STRIPE_SECRET_KEY);  // ❌ Exposes in logs
```

### API Key Rotation

#### ✅ DO: Implement Key Rotation
```typescript
// Support multiple API keys for rotation
class APIKeyManager {
  private keys: string[];
  private currentKeyIndex: number = 0;
  
  constructor(keys: string[]) {
    this.keys = keys.filter(key => key && key.trim() !== '');
    if (this.keys.length === 0) {
      throw new Error('No valid API keys provided');
    }
  }
  
  getCurrentKey(): string {
    return this.keys[this.currentKeyIndex];
  }
  
  rotateToNextKey(): void {
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
  }
  
  async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    let lastError: Error | null = null;
    
    // Try each key in rotation
    for (let attempts = 0; attempts < this.keys.length; attempts++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.getCurrentKey()}`
          }
        });
        
        if (response.status === 401) {
          // Key might be revoked, try next one
          this.rotateToNextKey();
          continue;
        }
        
        return response;
        
      } catch (error) {
        lastError = error as Error;
        this.rotateToNextKey();
      }
    }
    
    throw lastError || new Error('All API keys failed');
  }
}

// Usage
const apiManager = new APIKeyManager([
  Deno.env.get('OPENAI_API_KEY_1'),
  Deno.env.get('OPENAI_API_KEY_2'),
  Deno.env.get('OPENAI_API_KEY_3')
].filter(Boolean) as string[]);
```

---

## 🧪 Security Testing Patterns

### Authentication Testing

#### ✅ DO: Comprehensive Auth Tests
```typescript
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RequireRole from '@/components/auth/RequireRole';

describe('RequireRole Security', () => {
  it('blocks access without authentication', async () => {
    // Mock unauthenticated state
    jest.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      role: null
    });
    
    render(
      <RequireRole requiredRoles={['admin']}>
        <div data-testid="protected-content">Secret Admin Content</div>
      </RequireRole>
    );
    
    // Should not render protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
  });
  
  it('blocks access with insufficient role', async () => {
    // Mock user with insufficient role
    jest.mocked(useAuth).mockReturnValue({
      user: { id: 'user-1', email: 'user@test.com' },
      loading: false,
      role: { role: 'user' }  // Not admin
    });
    
    render(
      <RequireRole requiredRoles={['admin']}>
        <div data-testid="protected-content">Secret Admin Content</div>
      </RequireRole>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
  
  it('allows access with correct role', async () => {
    // Mock admin user
    jest.mocked(useAuth).mockReturnValue({
      user: { id: 'admin-1', email: 'admin@test.com' },
      loading: false,
      role: { role: 'admin' }
    });
    
    render(
      <RequireRole requiredRoles={['admin']}>
        <div data-testid="protected-content">Secret Admin Content</div>
      </RequireRole>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
```

### Input Validation Testing

#### ✅ DO: Test Input Sanitization
```typescript
describe('Input Validation Security', () => {
  it('prevents XSS in tour title', async () => {
    const maliciousInput = '<script>alert("XSS")</script>Tour Title';
    
    const result = TourCreateSchema.safeParse({
      title: maliciousInput,
      description: 'Valid description',
      price: 100,
      duration: 1,
      max_participants: 10,
      location: 'Belize City'
    });
    
    // Should sanitize or reject malicious input
    if (result.success) {
      expect(result.data.title).not.toContain('<script>');
    } else {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['title'],
          message: expect.stringContaining('invalid')
        })
      );
    }
  });
  
  it('prevents SQL injection in search queries', async () => {
    const maliciousQuery = "'; DROP TABLE tours; --";
    
    // Test that parameterized queries are safe
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .textSearch('title', maliciousQuery);
    
    // Should not cause database error or return unexpected results
    expect(error).toBeFalsy();
    expect(data).toBeDefined();
  });
});
```

---

## 🔍 Code Review Security Checklist

### Security-Focused Code Review

#### Before Approving Any PR, Check:

**Authentication & Authorization**:
- [ ] All protected routes use `RequireRole` component
- [ ] Server-side functions verify user authentication
- [ ] Role checks happen on server, not just client
- [ ] JWT tokens are handled securely (no localStorage)

**Input Validation**:
- [ ] All user inputs are validated with Zod schemas
- [ ] File uploads have size and type restrictions  
- [ ] Search queries use parameterized/sanitized methods
- [ ] Form data is validated on both client and server

**Database Security**:
- [ ] New tables have RLS policies enabled
- [ ] Policies follow principle of least privilege
- [ ] SECURITY DEFINER functions pin search_path
- [ ] No dynamic SQL construction with user input

**API Security**:
- [ ] Rate limiting configured for new endpoints
- [ ] CORS headers are restrictive and appropriate
- [ ] Error messages don't leak sensitive information
- [ ] Authentication required for sensitive operations

**Secrets Management**:
- [ ] No hardcoded API keys or passwords
- [ ] Environment variables used for all secrets
- [ ] No sensitive data in error messages or logs
- [ ] .env files properly gitignored

### Security Red Flags

#### Immediate Security Review Required:
- Any use of `dangerouslySetInnerHTML`
- String concatenation for SQL or HTML
- `eval()`, `Function()`, or other dynamic code execution
- User input directly inserted into database queries
- Authentication bypasses or role checks removed
- New environment variables or configuration changes
- External API integrations without rate limiting
- File upload functionality without validation

---

## 📚 Security Resources & Training

### Required Reading for Developers

1. **OWASP Top 10 Web Application Security Risks**
   - https://owasp.org/www-project-top-ten/
   - Focus areas: Injection, Broken Authentication, Security Misconfiguration

2. **Supabase Security Best Practices**
   - https://supabase.com/docs/guides/auth/row-level-security
   - https://supabase.com/docs/guides/auth/managing-user-data

3. **React Security Best Practices**
   - https://blog.logrocket.com/react-security-best-practices/
   - Focus on XSS prevention and secure component patterns

### Security Tools Integration

```bash
# Add to package.json scripts
{
  "scripts": {
    "security:audit": "npm audit --audit-level=high",
    "security:scan": "trufflehog git file://. --only-verified",
    "security:test": "jest --testPathPattern=security",
    "security:check": "npm run security:audit && npm run security:scan && npm run security:test"
  }
}
```

### Continuous Security Learning

- **Monthly Security Reviews**: Team review of new vulnerabilities and patches
- **Quarterly Security Training**: Updated training on latest attack vectors  
- **Annual Security Audit**: External security assessment and penetration testing
- **Security Champions**: Designate security-focused developers in each team

---

*This document should be reviewed and updated quarterly or after any security incidents. All developers must read and acknowledge understanding of these guidelines before contributing to the codebase.*