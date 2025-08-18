import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ApiUsageEvent {
  api_key_id: string;
  endpoint?: string;
  http_method?: string;
  status_code?: number;
  response_time_ms?: number;
  success: boolean;
  request_cost?: number;
  tokens_used?: number;
  data_in_bytes?: number;
  data_out_bytes?: number;
  error_type?: string;
  error_message?: string;
  user_id?: string;
  request_id?: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
}

interface BatchUsageUpdate {
  api_key_id: string;
  usage_date: string;
  total_calls?: number;
  successful_calls?: number;
  failed_calls?: number;
  total_cost?: number;
  avg_response_time_ms?: number;
  max_response_time_ms?: number;
  min_response_time_ms?: number;
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
    // Initialize Supabase client with service role for database operations
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
      case 'log_usage': {
        // Log individual API usage event
        const usageEvent: ApiUsageEvent = data;
        
        const { error } = await supabase
          .from('api_usage_logs')
          .insert({
            api_key_id: usageEvent.api_key_id,
            endpoint: usageEvent.endpoint,
            http_method: usageEvent.http_method,
            status_code: usageEvent.status_code,
            response_time_ms: usageEvent.response_time_ms,
            success: usageEvent.success,
            request_cost: usageEvent.request_cost,
            tokens_used: usageEvent.tokens_used,
            data_in_bytes: usageEvent.data_in_bytes,
            data_out_bytes: usageEvent.data_out_bytes,
            error_type: usageEvent.error_type,
            error_message: usageEvent.error_message,
            user_id: usageEvent.user_id,
            request_id: usageEvent.request_id,
            session_id: usageEvent.session_id,
            user_agent: usageEvent.user_agent,
            ip_address: usageEvent.ip_address,
          });

        if (error) {
          console.error('Error logging API usage:', error);
          return new Response(JSON.stringify({ error: 'Failed to log usage' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'batch_update_daily': {
        // Batch update daily usage aggregates
        const updates: BatchUsageUpdate[] = data;
        
        const { error } = await supabase
          .from('api_usage_daily')
          .upsert(
            updates.map(update => ({
              api_key_id: update.api_key_id,
              usage_date: update.usage_date,
              total_calls: update.total_calls || 0,
              successful_calls: update.successful_calls || 0,
              failed_calls: update.failed_calls || 0,
              total_cost: update.total_cost || 0,
              avg_response_time_ms: update.avg_response_time_ms,
              max_response_time_ms: update.max_response_time_ms,
              min_response_time_ms: update.min_response_time_ms,
            })),
            { 
              onConflict: 'api_key_id,usage_date',
              ignoreDuplicates: false 
            }
          );

        if (error) {
          console.error('Error batch updating daily usage:', error);
          return new Response(JSON.stringify({ error: 'Failed to update daily usage' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, updated: updates.length }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'aggregate_daily': {
        // Aggregate logs into daily summaries
        const { target_date } = data;
        
        const { data: result, error } = await supabase
          .rpc('aggregate_api_usage_daily', { 
            p_target_date: target_date || new Date().toISOString().split('T')[0] 
          });

        if (error) {
          console.error('Error aggregating daily usage:', error);
          return new Response(JSON.stringify({ error: 'Failed to aggregate daily usage' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, aggregated_records: result }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'cleanup_old_logs': {
        // Clean up old usage logs
        const { retention_days = 30 } = data;
        
        const { data: deletedCount, error } = await supabase
          .rpc('cleanup_old_usage_logs', { p_retention_days: retention_days });

        if (error) {
          console.error('Error cleaning up old logs:', error);
          return new Response(JSON.stringify({ error: 'Failed to cleanup old logs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: true, deleted_count: deletedCount }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'check_thresholds': {
        // Check for threshold violations and create alerts
        const { api_key_id } = data;
        
        // Get recent usage data to check thresholds
        const { data: recentUsage, error: usageError } = await supabase
          .from('api_usage_daily')
          .select('*')
          .eq('api_key_id', api_key_id)
          .gte('usage_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('usage_date', { ascending: false });

        if (usageError) {
          console.error('Error fetching usage data:', usageError);
          return new Response(JSON.stringify({ error: 'Failed to fetch usage data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Check for anomalies using the database function
        const { data: hasAnomaly, error: anomalyError } = await supabase
          .rpc('detect_usage_anomaly', { 
            p_api_key_id: api_key_id,
            p_date: new Date().toISOString().split('T')[0]
          });

        if (anomalyError) {
          console.error('Error detecting anomaly:', anomalyError);
        }

        return new Response(JSON.stringify({ 
          success: true, 
          recent_usage: recentUsage,
          anomaly_detected: hasAnomaly 
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
    console.error('API Usage Tracker Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});