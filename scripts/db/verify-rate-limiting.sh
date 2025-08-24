#!/bin/bash
#
# Rate Limiting Verification Script
# 
# This script helps verify that the rate limiting system is working correctly
# by testing various endpoints and checking for proper rate limiting behavior.
#

set -e

# Configuration
PROJECT_URL="${SUPABASE_URL:-https://your-project.supabase.co}"
TEST_ENDPOINT="${1:-/functions/v1/test-auth}"
RATE_LIMIT="${2:-5}"
ANON_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"

echo "🔄 Rate Limiting Verification Script"
echo "======================================"
echo "Project URL: $PROJECT_URL"
echo "Test Endpoint: $TEST_ENDPOINT"
echo "Expected Rate Limit: $RATE_LIMIT requests/minute"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make a test request
make_request() {
    local endpoint="$1"
    local headers="$2"
    
    curl -s -w "%{http_code}|%{time_total}" \
         -H "apikey: $ANON_KEY" \
         -H "Authorization: Bearer $ANON_KEY" \
         -H "Content-Type: application/json" \
         $headers \
         -X POST \
         -d '{"test": true}' \
         "$PROJECT_URL$endpoint" 2>/dev/null
}

# Function to extract HTTP status code
get_status_code() {
    echo "$1" | cut -d'|' -f1
}

# Function to extract response time
get_response_time() {
    echo "$1" | cut -d'|' -f2
}

echo "🧪 Test 1: Basic Rate Limiting"
echo "------------------------------"

success_count=0
rate_limited_count=0
response_times=()

echo "Making $((RATE_LIMIT + 5)) requests to test rate limiting..."

for i in $(seq 1 $((RATE_LIMIT + 5))); do
    response=$(make_request "$TEST_ENDPOINT" "")
    status_code=$(get_status_code "$response")
    response_time=$(get_response_time "$response")
    
    response_times+=("$response_time")
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}Request $i: $status_code (${response_time}s)${NC}"
        ((success_count++))
    elif [ "$status_code" = "429" ]; then
        echo -e "${RED}Request $i: $status_code - Rate Limited (${response_time}s)${NC}"
        ((rate_limited_count++))
    else
        echo -e "${YELLOW}Request $i: $status_code - Unexpected (${response_time}s)${NC}"
    fi
    
    # Small delay between requests
    sleep 0.1
done

echo ""
echo "📊 Test Results:"
echo "Success: $success_count requests"
echo "Rate Limited: $rate_limited_count requests"

# Verify rate limiting is working
if [ $success_count -le $RATE_LIMIT ] && [ $rate_limited_count -gt 0 ]; then
    echo -e "${GREEN}✅ Rate limiting is working correctly${NC}"
else
    echo -e "${RED}❌ Rate limiting may not be working as expected${NC}"
    echo "Expected: ~$RATE_LIMIT successful requests, then rate limiting"
    echo "Actual: $success_count successful, $rate_limited_count rate limited"
fi

echo ""
echo "🔍 Test 2: Rate Limit Headers"
echo "-----------------------------"

echo "Checking for proper rate limiting headers..."

# Make a single request and check headers
response_with_headers=$(curl -s -I \
    -H "apikey: $ANON_KEY" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -X POST \
    "$PROJECT_URL$TEST_ENDPOINT" 2>/dev/null)

echo "Response headers:"
echo "$response_with_headers" | grep -i "ratelimit\|retry-after" || echo "No rate limiting headers found"

echo ""
echo "🚀 Test 3: Different User Types"
echo "-------------------------------"

echo "Testing authenticated vs unauthenticated rate limits..."

# Test with no auth header (unauthenticated)
echo "Testing unauthenticated requests:"
unauth_success=0
for i in $(seq 1 3); do
    response=$(curl -s -w "%{http_code}" -X POST \
        -H "apikey: $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{"test": true}' \
        "$PROJECT_URL/functions/v1/popular-adventures" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        ((unauth_success++))
        echo -e "${GREEN}Unauthenticated request $i: Success${NC}"
    else
        echo -e "${RED}Unauthenticated request $i: Failed ($response)${NC}"
    fi
done

echo ""
echo "📈 Test 4: Rate Limit Recovery"
echo "-----------------------------"

echo "Waiting for rate limit to reset..."
echo "In production, wait 60 seconds for the rate limit window to reset"
echo "For testing purposes, waiting 5 seconds..."

sleep 5

echo "Testing if requests work after waiting:"
recovery_response=$(make_request "$TEST_ENDPOINT" "")
recovery_status=$(get_status_code "$recovery_response")

if [ "$recovery_status" = "200" ]; then
    echo -e "${GREEN}✅ Rate limit recovery: Request succeeded after waiting${NC}"
else
    echo -e "${YELLOW}⚠️ Rate limit recovery: Still limited (status: $recovery_status)${NC}"
    echo "Note: May need to wait longer for full recovery"
fi

echo ""
echo "🔧 Test 5: Configuration Verification"
echo "-------------------------------------"

echo "Checking rate limiting configuration files..."

config_file="/Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/supabase/functions/_rateLimit.config.json"
middleware_file="/Users/smg.inc/CODES/GitHub/belize-solo-vibes-clone/supabase/functions/_middleware.ts"

if [ -f "$config_file" ]; then
    echo -e "${GREEN}✅ Configuration file exists: $config_file${NC}"
    echo "Configuration for $TEST_ENDPOINT:"
    if command -v jq >/dev/null 2>&1; then
        jq ".routes[\"$TEST_ENDPOINT\"]" "$config_file" 2>/dev/null || echo "Route not found in config"
    else
        grep -A 5 "$TEST_ENDPOINT" "$config_file" || echo "Route not found in config (jq not available for pretty printing)"
    fi
else
    echo -e "${RED}❌ Configuration file not found: $config_file${NC}"
fi

if [ -f "$middleware_file" ]; then
    echo -e "${GREEN}✅ Middleware file exists: $middleware_file${NC}"
else
    echo -e "${RED}❌ Middleware file not found: $middleware_file${NC}"
fi

echo ""
echo "📋 Summary and Recommendations"
echo "==============================="

if [ $rate_limited_count -gt 0 ]; then
    echo -e "${GREEN}✅ Rate limiting is functional${NC}"
    echo "• Requests are being limited after threshold"
    echo "• 429 responses are returned when rate limited"
    
    recommendations=""
    
    # Check response times
    avg_time=$(echo "${response_times[@]}" | tr ' ' '\n' | awk '{sum+=$1} END {print sum/NR}')
    if (( $(echo "$avg_time > 1.0" | bc -l) )); then
        recommendations="$recommendations\n• Consider optimizing response times (avg: ${avg_time}s)"
    fi
    
    if [ -n "$recommendations" ]; then
        echo -e "\n🔧 Recommendations:$recommendations"
    fi
else
    echo -e "${RED}❌ Rate limiting may not be working${NC}"
    echo "• No 429 responses detected"
    echo "• Check environment variables:"
    echo "  - RATE_LIMIT_ENABLED=true"
    echo "  - UPSTASH_REDIS_REST_URL (if using Redis)"
    echo "  - UPSTASH_REDIS_REST_TOKEN (if using Redis)"
    echo "• Verify middleware integration in Edge Functions"
fi

echo ""
echo "🔗 Next Steps:"
echo "1. Run Deno tests: deno test supabase/functions/_tests/rateLimit.spec.ts --allow-all"
echo "2. Monitor production logs for rate limiting events"
echo "3. Adjust rate limits based on actual usage patterns"
echo "4. Set up monitoring alerts for excessive rate limiting"

echo ""
echo "Script completed at $(date)"