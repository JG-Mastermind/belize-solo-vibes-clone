/**
 * CORS Headers Utility for Supabase Edge Functions
 * 
 * Provides standardized CORS headers for different types of requests
 * to ensure proper cross-origin access for the BelizeVibes platform.
 */

// Standard CORS headers for API endpoints
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// CORS headers for security reporting endpoints (more permissive)
export const securityCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// CORS headers for authenticated endpoints
export const authenticatedCorsHeaders = {
  'Access-Control-Allow-Origin': 'https://belizevibes.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

// CORS headers for development
export const developmentCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Get appropriate CORS headers based on environment and request type
 */
export function getCorsHeaders(requestType: 'api' | 'security' | 'authenticated' = 'api'): Record<string, string> {
  const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development' || 
                       Deno.env.get('SUPABASE_URL')?.includes('localhost');

  if (isDevelopment) {
    return developmentCorsHeaders;
  }

  switch (requestType) {
    case 'security':
      return securityCorsHeaders;
    case 'authenticated':
      return authenticatedCorsHeaders;
    default:
      return corsHeaders;
  }
}

/**
 * Create a CORS preflight response
 */
export function createCorsPreflightResponse(requestType: 'api' | 'security' | 'authenticated' = 'api'): Response {
  return new Response(null, {
    status: 200,
    headers: getCorsHeaders(requestType),
  });
}