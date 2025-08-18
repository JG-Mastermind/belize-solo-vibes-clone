import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface SecurityEvent {
  api_key_id?: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source_ip?: string;
  user_agent?: string;
  endpoint?: string;
  request_count?: number;
  time_window_minutes?: number;
  risk_score?: number;
  anomaly_indicators?: Record<string, any>;
  action_taken?: string;
  auto_remediation?: boolean;
}

interface AlertRequest {
  alert_type: 'usage_threshold' | 'cost_threshold' | 'error_rate' | 'response_time' | 'rate_limit' | 'security_breach' | 'key_expiry' | 'service_outage' | 'unusual_activity' | 'quota_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  api_key_id?: string;
  service_provider?: string;
  title: string;
  message: string;
  threshold_value?: number;
  actual_value?: number;
  notification_channels?: string[];
}

Deno.serve(async (req: Request) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { type, data } = await req.json();

    switch (type) {
      case 'log_security_event': {
        const event: SecurityEvent = data;
        
        // Calculate risk score if not provided
        let riskScore = event.risk_score || 0;
        if (!event.risk_score) {
          // Simple risk scoring algorithm
          let score = 0;
          
          // Base score by severity
          switch (event.severity) {
            case 'critical': score += 80; break;
            case 'high': score += 60; break;
            case 'medium': score += 30; break;
            case 'low': score += 10; break;
          }
          
          // Additional risk factors
          if (event.request_count && event.request_count > 100) score += 20;
          if (event.event_type.includes('breach') || event.event_type.includes('attack')) score += 30;
          if (event.source_ip && event.source_ip.startsWith('10.') === false) score += 10; // External IP
          
          riskScore = Math.min(100, score);
        }

        // Store security event
        const { error } = await supabase
          .from('api_security_events')
          .insert({
            api_key_id: event.api_key_id,
            event_type: event.event_type,
            severity: event.severity,
            title: event.title,
            description: event.description,
            source_ip: event.source_ip,
            user_agent: event.user_agent,
            endpoint: event.endpoint,
            request_count: event.request_count || 1,
            time_window_minutes: event.time_window_minutes || 1,
            risk_score: riskScore,
            anomaly_indicators: event.anomaly_indicators ? JSON.stringify(event.anomaly_indicators) : null,
            action_taken: event.action_taken,
            auto_remediation: event.auto_remediation || false
          });

        if (error) {
          console.error('Error logging security event:', error);
          return new Response(JSON.stringify({ error: 'Failed to log security event' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // If high risk, trigger immediate alert
        if (riskScore > 70) {
          await supabase.from('api_alerts').insert({
            alert_type: 'security_breach',
            severity: event.severity,
            api_key_id: event.api_key_id,
            title: `High Risk Security Event: ${event.title}`,
            message: `Risk score: ${riskScore}/100. ${event.description}`,
            actual_value: riskScore,
            threshold_value: 70,
            alert_hash: `security_${event.event_type}_${Date.now()}`
          });
        }

        return new Response(JSON.stringify({ 
          success: true, 
          risk_score: riskScore,
          alert_triggered: riskScore > 70 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'create_alert': {
        const alertData: AlertRequest = data;
        
        // Generate unique alert hash to prevent duplicates
        const alertHash = `${alertData.alert_type}_${alertData.api_key_id || alertData.service_provider}_${new Date().toISOString().split('T')[0]}`;

        const { error } = await supabase
          .from('api_alerts')
          .insert({
            alert_type: alertData.alert_type,
            severity: alertData.severity,
            api_key_id: alertData.api_key_id,
            service_provider: alertData.service_provider,
            title: alertData.title,
            message: alertData.message,
            threshold_value: alertData.threshold_value,
            actual_value: alertData.actual_value,
            alert_hash: alertHash,
            notification_channels: alertData.notification_channels || ['email']
          });

        if (error && !error.message.includes('duplicate key')) {
          console.error('Error creating alert:', error);
          return new Response(JSON.stringify({ error: 'Failed to create alert' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ 
          success: true,
          alert_hash: alertHash,
          duplicate: error?.message.includes('duplicate key') || false
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'analyze_anomalies': {
        // Analyze recent usage patterns for anomalies
        const { 
          hours_back = 24, 
          api_key_id,
          threshold_multiplier = 3.0 
        } = data;

        const cutoffTime = new Date(Date.now() - hours_back * 60 * 60 * 1000).toISOString();

        // Get recent usage logs
        let query = supabase
          .from('api_usage_logs')
          .select(`
            *,
            api_keys!inner (
              service_provider,
              service_name
            )
          `)
          .gte('request_timestamp', cutoffTime);

        if (api_key_id) {
          query = query.eq('api_key_id', api_key_id);
        }

        const { data: recentLogs, error: logsError } = await query
          .order('request_timestamp', { ascending: false });

        if (logsError) {
          console.error('Error fetching recent logs:', logsError);
          return new Response(JSON.stringify({ error: 'Failed to fetch logs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const anomalies = [];

        if (recentLogs && recentLogs.length > 0) {
          // Group by API key and analyze patterns
          const logsByKey = recentLogs.reduce((acc: any, log: any) => {
            if (!acc[log.api_key_id]) {
              acc[log.api_key_id] = [];
            }
            acc[log.api_key_id].push(log);
            return acc;
          }, {});

          for (const [keyId, logs] of Object.entries(logsByKey)) {
            const keyLogs = logs as any[];
            
            // Analyze request frequency
            const requestsPerHour = keyLogs.length / hours_back;
            const normalRequestsPerHour = 10; // Baseline assumption
            
            if (requestsPerHour > normalRequestsPerHour * threshold_multiplier) {
              anomalies.push({
                type: 'unusual_frequency',
                api_key_id: keyId,
                severity: 'medium',
                description: `Unusual request frequency: ${requestsPerHour.toFixed(1)} req/hour (normal: ~${normalRequestsPerHour})`,
                risk_score: Math.min(90, 30 + (requestsPerHour / normalRequestsPerHour) * 10)
              });
            }

            // Analyze error patterns
            const errorLogs = keyLogs.filter(log => !log.success);
            const errorRate = (errorLogs.length / keyLogs.length) * 100;
            
            if (errorRate > 20) {
              anomalies.push({
                type: 'high_error_rate',
                api_key_id: keyId,
                severity: errorRate > 50 ? 'high' : 'medium',
                description: `High error rate: ${errorRate.toFixed(1)}% over ${hours_back} hours`,
                risk_score: Math.min(95, 20 + errorRate)
              });
            }

            // Analyze geographic patterns (if IP data available)
            const ipCounts = keyLogs.reduce((acc: any, log: any) => {
              if (log.ip_address) {
                acc[log.ip_address] = (acc[log.ip_address] || 0) + 1;
              }
              return acc;
            }, {});

            const uniqueIPs = Object.keys(ipCounts).length;
            if (uniqueIPs > 10 && keyLogs.length > 50) {
              anomalies.push({
                type: 'distributed_requests',
                api_key_id: keyId,
                severity: 'medium',
                description: `Requests from ${uniqueIPs} different IP addresses`,
                risk_score: Math.min(70, 30 + uniqueIPs)
              });
            }

            // Analyze cost patterns
            const totalCost = keyLogs.reduce((sum, log) => sum + (parseFloat(log.request_cost) || 0), 0);
            const avgCostPerRequest = totalCost / keyLogs.length;
            
            if (avgCostPerRequest > 0.1) { // $0.10 per request threshold
              anomalies.push({
                type: 'high_cost_requests',
                api_key_id: keyId,
                severity: 'low',
                description: `High average cost per request: $${avgCostPerRequest.toFixed(4)}`,
                risk_score: Math.min(60, 20 + (avgCostPerRequest * 100))
              });
            }
          }
        }

        // Log significant anomalies as security events
        for (const anomaly of anomalies) {
          if (anomaly.risk_score > 50) {
            await supabase.from('api_security_events').insert({
              api_key_id: anomaly.api_key_id,
              event_type: anomaly.type,
              severity: anomaly.severity,
              title: `Anomaly Detected: ${anomaly.type}`,
              description: anomaly.description,
              risk_score: anomaly.risk_score,
              time_window_minutes: hours_back * 60,
              auto_remediation: false
            });
          }
        }

        return new Response(JSON.stringify({
          success: true,
          analysis_period_hours: hours_back,
          anomalies_detected: anomalies.length,
          anomalies: anomalies
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'check_key_expiry': {
        // Check for API keys nearing expiry
        const { days_ahead = 30 } = data;
        
        const expiryThreshold = new Date();
        expiryThreshold.setDate(expiryThreshold.getDate() + days_ahead);

        const { data: expiringKeys, error: expiryError } = await supabase
          .from('api_keys')
          .select('*')
          .not('expires_at', 'is', null)
          .lte('expires_at', expiryThreshold.toISOString())
          .eq('status', 'active');

        if (expiryError) {
          console.error('Error checking key expiry:', expiryError);
          return new Response(JSON.stringify({ error: 'Failed to check key expiry' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Create alerts for expiring keys
        const alerts = [];
        for (const key of expiringKeys || []) {
          const daysUntilExpiry = Math.ceil((new Date(key.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          
          const severity = daysUntilExpiry <= 7 ? 'high' : 
                          daysUntilExpiry <= 14 ? 'medium' : 'low';

          const alertHash = `key_expiry_${key.id}_${new Date().toISOString().split('T')[0]}`;

          const { error: alertError } = await supabase
            .from('api_alerts')
            .insert({
              alert_type: 'key_expiry',
              severity: severity,
              api_key_id: key.id,
              service_provider: key.service_provider,
              title: `API Key Expiring Soon: ${key.service_name}`,
              message: `API key for ${key.service_name} expires in ${daysUntilExpiry} days (${key.expires_at})`,
              threshold_value: days_ahead,
              actual_value: daysUntilExpiry,
              alert_hash: alertHash
            });

          if (!alertError || alertError.message.includes('duplicate key')) {
            alerts.push({
              api_key_id: key.id,
              service_name: key.service_name,
              days_until_expiry: daysUntilExpiry,
              severity: severity
            });
          }
        }

        return new Response(JSON.stringify({
          success: true,
          expiring_keys_count: expiringKeys?.length || 0,
          alerts_created: alerts.length,
          expiring_keys: alerts
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'get_security_summary': {
        // Get comprehensive security summary
        const { days_back = 7 } = data;
        
        const startDate = new Date(Date.now() - days_back * 24 * 60 * 60 * 1000).toISOString();

        // Get security events summary
        const { data: securityEvents, error: eventsError } = await supabase
          .from('api_security_events')
          .select('severity, event_type, risk_score, investigated')
          .gte('created_at', startDate);

        // Get active alerts summary
        const { data: activeAlerts, error: alertsError } = await supabase
          .from('api_alerts')
          .select('severity, alert_type, is_acknowledged')
          .eq('is_active', true);

        if (eventsError || alertsError) {
          console.error('Error fetching security summary:', eventsError || alertsError);
          return new Response(JSON.stringify({ error: 'Failed to fetch security summary' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Calculate summary statistics
        const summary = {
          period_days: days_back,
          security_events: {
            total: securityEvents?.length || 0,
            by_severity: {
              critical: securityEvents?.filter(e => e.severity === 'critical').length || 0,
              high: securityEvents?.filter(e => e.severity === 'high').length || 0,
              medium: securityEvents?.filter(e => e.severity === 'medium').length || 0,
              low: securityEvents?.filter(e => e.severity === 'low').length || 0
            },
            avg_risk_score: securityEvents?.length ? 
              securityEvents.reduce((sum, e) => sum + (e.risk_score || 0), 0) / securityEvents.length : 0,
            investigated_count: securityEvents?.filter(e => e.investigated).length || 0
          },
          active_alerts: {
            total: activeAlerts?.length || 0,
            by_severity: {
              critical: activeAlerts?.filter(a => a.severity === 'critical').length || 0,
              high: activeAlerts?.filter(a => a.severity === 'high').length || 0,
              medium: activeAlerts?.filter(a => a.severity === 'medium').length || 0,
              low: activeAlerts?.filter(a => a.severity === 'low').length || 0
            },
            unacknowledged: activeAlerts?.filter(a => !a.is_acknowledged).length || 0
          }
        };

        return new Response(JSON.stringify({
          success: true,
          summary: summary
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid operation type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('API Security Monitor Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});