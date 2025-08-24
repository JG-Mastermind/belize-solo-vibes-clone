#!/usr/bin/env node

/**
 * Security Monitoring CLI Tool
 * 
 * Real-time security event monitoring and analysis tool for the BelizeVibes platform.
 * Provides live tailing of security events with filtering, alerting, and reporting capabilities.
 * 
 * Features:
 * - Real-time security event streaming
 * - Event type filtering and search
 * - Time-based queries and alerts
 * - Severity-based filtering
 * - IP-based threat tracking
 * - Export capabilities for analysis
 * 
 * Usage:
 *   npm run security:watch                           # Watch all events
 *   npm run security:watch -- --type=rate_limit_exceeded  # Filter by type
 *   npm run security:watch -- --last=24h            # Last 24 hours
 *   npm run security:watch -- --severity=high       # High severity only
 *   npm run security:watch -- --export=./report.json # Export to file
 */

import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'module';
import { argv } from 'process';

const require = createRequire(import.meta.url);
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = parseArgs(argv.slice(2));

// Configuration
const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  pollInterval: args.interval || 5000, // 5 seconds default
  maxEvents: args.limit || 100,
  exportPath: args.export,
  filters: {
    eventType: args.type,
    severity: args.severity,
    last: args.last,
    ipHash: args.ip,
    userId: args.user,
    source: args.source,
  },
  alertThresholds: {
    rateLimit: args['alert-rate-limit'] || 10,  // 10 rate limit events in interval
    cspViolation: args['alert-csp'] || 5,       // 5 CSP violations in interval  
    authAnomaly: args['alert-auth'] || 3,       // 3 auth anomalies in interval
    errorBurst: args['alert-errors'] || 20,    // 20 error burst events in interval
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Security event type mappings
const eventTypeColors = {
  rate_limit_exceeded: colors.yellow,
  csp_violation: colors.red,
  auth_anomaly: colors.magenta,
  rls_denial: colors.red,
  error_burst: colors.yellow,
  suspicious_ip: colors.red,
  admin_action: colors.cyan,
  payment_fraud: colors.red,
  data_export: colors.blue,
  unauthorized_access: colors.red,
};

const severityColors = {
  low: colors.green,
  medium: colors.yellow,
  high: colors.red,
  critical: colors.red + colors.bright,
};

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      parsed[key] = value || true;
    }
  }
  
  return parsed;
}

/**
 * Initialize Supabase client
 */
function initializeSupabase() {
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
  }

  return createClient(config.supabaseUrl, config.supabaseServiceKey);
}

/**
 * Build query filters based on CLI arguments
 */
function buildQueryFilters() {
  let query = 'SELECT * FROM security_events';
  const conditions = [];
  const params = {};

  // Event type filter
  if (config.filters.eventType) {
    conditions.push('event_type = $eventType');
    params.eventType = config.filters.eventType;
  }

  // Severity filter
  if (config.filters.severity) {
    conditions.push('severity = $severity');
    params.severity = config.filters.severity;
  }

  // Time-based filter
  if (config.filters.last) {
    const interval = parseTimeInterval(config.filters.last);
    conditions.push('created_at > NOW() - $interval::interval');
    params.interval = interval;
  }

  // IP hash filter
  if (config.filters.ipHash) {
    conditions.push('ip_hash = $ipHash');
    params.ipHash = config.filters.ipHash;
  }

  // User ID filter
  if (config.filters.userId) {
    conditions.push('user_id = $userId');
    params.userId = config.filters.userId;
  }

  // Source filter
  if (config.filters.source) {
    conditions.push('source ILIKE $source');
    params.source = `%${config.filters.source}%`;
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';
  
  if (config.maxEvents) {
    query += ` LIMIT ${config.maxEvents}`;
  }

  return { query, params };
}

/**
 * Parse time interval string (e.g., "24h", "30m", "7d")
 */
function parseTimeInterval(intervalStr) {
  const match = intervalStr.match(/^(\d+)([hdm])$/);
  if (!match) {
    throw new Error(`Invalid time interval: ${intervalStr}. Use format like "24h", "30m", "7d"`);
  }

  const [, amount, unit] = match;
  const unitMap = { h: 'hours', d: 'days', m: 'minutes' };
  
  return `${amount} ${unitMap[unit]}`;
}

/**
 * Format security event for display
 */
function formatSecurityEvent(event) {
  const timestamp = new Date(event.created_at).toLocaleString();
  const eventColor = eventTypeColors[event.event_type] || colors.white;
  const severityColor = severityColors[event.severity] || colors.white;
  
  let output = '';
  output += `${colors.dim}[${timestamp}]${colors.reset} `;
  output += `${eventColor}${event.event_type}${colors.reset} `;
  output += `${severityColor}(${event.severity.toUpperCase()})${colors.reset} `;
  output += `from ${colors.cyan}${event.source}${colors.reset}`;
  
  if (event.route) {
    output += ` on ${colors.blue}${event.route}${colors.reset}`;
  }

  if (event.user_id) {
    output += ` by ${colors.magenta}user:${event.user_id.substring(0, 8)}...${colors.reset}`;
  }

  // Add payload summary for specific event types
  if (event.payload) {
    switch (event.event_type) {
      case 'rate_limit_exceeded':
        if (event.payload.limit && event.payload.attempts) {
          output += ` ${colors.yellow}(${event.payload.attempts}/${event.payload.limit})${colors.reset}`;
        }
        break;
        
      case 'csp_violation':
        if (event.payload.violatedDirective) {
          output += ` ${colors.red}${event.payload.violatedDirective}${colors.reset}`;
        }
        break;
        
      case 'auth_anomaly':
        if (event.payload.attemptType) {
          output += ` ${colors.magenta}${event.payload.attemptType}${colors.reset}`;
        }
        break;
        
      case 'error_burst':
        if (event.payload.errorCount) {
          output += ` ${colors.yellow}(${event.payload.errorCount} errors)${colors.reset}`;
        }
        break;
    }
  }

  return output;
}

/**
 * Check for alert thresholds
 */
function checkAlerts(events) {
  const recentEvents = events.filter(e => {
    const eventTime = new Date(e.created_at);
    const cutoff = new Date(Date.now() - config.pollInterval * 2); // 2 polling intervals
    return eventTime > cutoff;
  });

  const eventCounts = {};
  recentEvents.forEach(event => {
    eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1;
  });

  const alerts = [];

  // Check rate limit alerts
  if (eventCounts.rate_limit_exceeded >= config.alertThresholds.rateLimit) {
    alerts.push({
      type: 'rate_limit_spike',
      severity: 'high',
      message: `⚠️  HIGH: ${eventCounts.rate_limit_exceeded} rate limit violations in the last ${config.pollInterval * 2 / 1000}s`,
      count: eventCounts.rate_limit_exceeded
    });
  }

  // Check CSP violation alerts
  if (eventCounts.csp_violation >= config.alertThresholds.cspViolation) {
    alerts.push({
      type: 'csp_violation_spike',
      severity: 'critical',
      message: `🚨 CRITICAL: ${eventCounts.csp_violation} CSP violations detected - possible XSS attack`,
      count: eventCounts.csp_violation
    });
  }

  // Check auth anomaly alerts
  if (eventCounts.auth_anomaly >= config.alertThresholds.authAnomaly) {
    alerts.push({
      type: 'auth_attack',
      severity: 'high',
      message: `⚠️  HIGH: ${eventCounts.auth_anomaly} authentication anomalies - possible brute force attack`,
      count: eventCounts.auth_anomaly
    });
  }

  // Check error burst alerts
  if (eventCounts.error_burst >= config.alertThresholds.errorBurst) {
    alerts.push({
      type: 'system_instability',
      severity: 'medium',
      message: `⚠️  MEDIUM: ${eventCounts.error_burst} error bursts detected - system may be unstable`,
      count: eventCounts.error_burst
    });
  }

  return alerts;
}

/**
 * Display alerts
 */
function displayAlerts(alerts) {
  alerts.forEach(alert => {
    const color = alert.severity === 'critical' ? colors.red + colors.bright :
                  alert.severity === 'high' ? colors.red :
                  alert.severity === 'medium' ? colors.yellow : colors.white;
    
    console.log(`\n${color}${alert.message}${colors.reset}`);
  });
  
  if (alerts.length > 0) {
    console.log(''); // Extra newline after alerts
  }
}

/**
 * Export events to file
 */
function exportEvents(events, filePath) {
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalEvents: events.length,
      filters: config.filters,
      events: events,
      summary: generateSummary(events)
    };

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    console.log(`📁 Events exported to: ${filePath}`);
  } catch (error) {
    console.error('❌ Failed to export events:', error.message);
  }
}

/**
 * Generate summary statistics
 */
function generateSummary(events) {
  const summary = {
    totalEvents: events.length,
    eventTypes: {},
    severityLevels: {},
    topSources: {},
    timeRange: null
  };

  if (events.length === 0) return summary;

  // Sort events by time
  const sortedEvents = events.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  summary.timeRange = {
    earliest: sortedEvents[0].created_at,
    latest: sortedEvents[sortedEvents.length - 1].created_at
  };

  // Count by event type
  events.forEach(event => {
    summary.eventTypes[event.event_type] = (summary.eventTypes[event.event_type] || 0) + 1;
    summary.severityLevels[event.severity] = (summary.severityLevels[event.severity] || 0) + 1;
    summary.topSources[event.source] = (summary.topSources[event.source] || 0) + 1;
  });

  return summary;
}

/**
 * Display summary statistics
 */
function displaySummary(events) {
  const summary = generateSummary(events);
  
  console.log(`\n${colors.bright}=== SECURITY EVENTS SUMMARY ===${colors.reset}`);
  console.log(`Total Events: ${colors.cyan}${summary.totalEvents}${colors.reset}`);
  
  if (summary.timeRange) {
    console.log(`Time Range: ${colors.dim}${summary.timeRange.earliest} to ${summary.timeRange.latest}${colors.reset}`);
  }

  console.log(`\n${colors.bright}Event Types:${colors.reset}`);
  Object.entries(summary.eventTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      const color = eventTypeColors[type] || colors.white;
      console.log(`  ${color}${type}${colors.reset}: ${count}`);
    });

  console.log(`\n${colors.bright}Severity Levels:${colors.reset}`);
  Object.entries(summary.severityLevels)
    .sort(([,a], [,b]) => b - a)
    .forEach(([severity, count]) => {
      const color = severityColors[severity] || colors.white;
      console.log(`  ${color}${severity.toUpperCase()}${colors.reset}: ${count}`);
    });

  console.log(`\n${colors.bright}Top Sources:${colors.reset}`);
  Object.entries(summary.topSources)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([source, count]) => {
      console.log(`  ${colors.cyan}${source}${colors.reset}: ${count}`);
    });
}

/**
 * Main monitoring loop
 */
async function monitorSecurityEvents() {
  console.log(`${colors.green}🔒 BelizeVibes Security Monitor Started${colors.reset}`);
  console.log(`${colors.dim}Polling every ${config.pollInterval / 1000}s | Max events: ${config.maxEvents}${colors.reset}\n`);

  const supabase = initializeSupabase();
  const { query, params } = buildQueryFilters();
  
  let lastEventId = null;
  let allEvents = [];

  while (true) {
    try {
      const { data: events, error } = await supabase.rpc('exec', {
        query: query,
        params: params
      });

      if (error) {
        console.error(`❌ Query error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, config.pollInterval));
        continue;
      }

      if (!events || events.length === 0) {
        if (allEvents.length === 0) {
          console.log(`${colors.dim}No security events found matching criteria...${colors.reset}`);
        }
        await new Promise(resolve => setTimeout(resolve, config.pollInterval));
        continue;
      }

      // Filter new events
      const newEvents = lastEventId 
        ? events.filter(event => event.id !== lastEventId && 
                                new Date(event.created_at) > new Date(allEvents[0]?.created_at || 0))
        : events;

      if (newEvents.length > 0) {
        newEvents.reverse().forEach(event => {
          console.log(formatSecurityEvent(event));
        });

        allEvents = [...newEvents, ...allEvents].slice(0, config.maxEvents);
        lastEventId = events[0]?.id;

        // Check for alerts
        const alerts = checkAlerts(allEvents);
        displayAlerts(alerts);
      }

      await new Promise(resolve => setTimeout(resolve, config.pollInterval));

    } catch (error) {
      console.error(`❌ Monitoring error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, config.pollInterval));
    }
  }
}

/**
 * One-time query and exit
 */
async function querySecurityEvents() {
  const supabase = initializeSupabase();
  const { query, params } = buildQueryFilters();

  try {
    console.log(`${colors.green}🔍 Querying security events...${colors.reset}\n`);

    const { data: events, error } = await supabase.rpc('exec', {
      query: query,
      params: params
    });

    if (error) {
      console.error(`❌ Query error: ${error.message}`);
      process.exit(1);
    }

    if (!events || events.length === 0) {
      console.log(`${colors.yellow}No security events found matching criteria.${colors.reset}`);
      process.exit(0);
    }

    // Display events
    events.reverse().forEach(event => {
      console.log(formatSecurityEvent(event));
    });

    // Display summary
    displaySummary(events);

    // Export if requested
    if (config.exportPath) {
      exportEvents(events, config.exportPath);
    }

  } catch (error) {
    console.error(`❌ Query error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Display help information
 */
function displayHelp() {
  console.log(`
${colors.bright}BelizeVibes Security Monitor${colors.reset}
Real-time security event monitoring and analysis tool

${colors.bright}USAGE:${colors.reset}
  node security-watch.mjs [options]

${colors.bright}OPTIONS:${colors.reset}
  --type=EVENT_TYPE          Filter by event type (rate_limit_exceeded, csp_violation, etc.)
  --severity=LEVEL           Filter by severity (low, medium, high, critical)
  --last=TIME               Show events from last TIME (24h, 30m, 7d)
  --source=SOURCE           Filter by event source
  --user=USER_ID            Filter by user ID
  --ip=IP_HASH              Filter by IP hash
  --limit=NUM               Maximum events to show (default: 100)
  --interval=MS             Polling interval in milliseconds (default: 5000)
  --export=PATH             Export results to JSON file
  --once                    Run query once and exit (don't monitor)
  --alert-rate-limit=NUM    Alert threshold for rate limit events (default: 10)
  --alert-csp=NUM           Alert threshold for CSP violations (default: 5)
  --alert-auth=NUM          Alert threshold for auth anomalies (default: 3)
  --alert-errors=NUM        Alert threshold for error bursts (default: 20)
  --help                    Show this help

${colors.bright}EXAMPLES:${colors.reset}
  node security-watch.mjs --type=rate_limit_exceeded --last=1h
  node security-watch.mjs --severity=high --export=./security-report.json
  node security-watch.mjs --once --last=24h
  node security-watch.mjs --source=csp --alert-csp=2

${colors.bright}EVENT TYPES:${colors.reset}
  rate_limit_exceeded    - Rate limiting violations
  csp_violation         - Content Security Policy violations  
  auth_anomaly          - Authentication anomalies
  rls_denial            - Row Level Security policy denials
  error_burst           - Unusual error patterns
  suspicious_ip         - IP addresses with suspicious patterns
  admin_action          - Critical admin actions
  payment_fraud         - Payment-related fraud indicators
  data_export           - Large data exports or scraping
  unauthorized_access   - Attempts to access protected resources

${colors.bright}ENVIRONMENT VARIABLES:${colors.reset}
  SUPABASE_URL                  Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY     Supabase service role key
`);
}

/**
 * Main entry point
 */
async function main() {
  if (args.help) {
    displayHelp();
    process.exit(0);
  }

  try {
    if (args.once) {
      await querySecurityEvents();
    } else {
      await monitorSecurityEvents();
    }
  } catch (error) {
    console.error(`❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${colors.green}🛑 Security monitor stopped${colors.reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.green}🛑 Security monitor terminated${colors.reset}`);
  process.exit(0);
});

// Start the application
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});