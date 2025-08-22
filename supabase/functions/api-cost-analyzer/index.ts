import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface CostAnalysisRequest {
  analysis_date?: string;
  period_type: 'daily' | 'weekly' | 'monthly';
  force_refresh?: boolean;
}

interface OptimizationRecommendation {
  api_key_id?: string;
  service_provider: string;
  category: 'cost' | 'performance' | 'security' | 'usage';
  priority: number;
  title: string;
  description: string;
  potential_cost_savings?: number;
  potential_performance_gain?: number;
  implementation_effort: 'low' | 'medium' | 'high';
  implementation_steps: string[];
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
      case 'analyze_costs': {
        const request: CostAnalysisRequest = data;
        const analysisDate = request.analysis_date || new Date().toISOString().split('T')[0];
        
        // Calculate date range based on period type
        let startDate: string;
        const endDate: string = analysisDate;
        
        switch (request.period_type) {
          case 'daily':
            startDate = analysisDate;
            break;
          case 'weekly':
            const weekStart = new Date(analysisDate);
            weekStart.setDate(weekStart.getDate() - 6);
            startDate = weekStart.toISOString().split('T')[0];
            break;
          case 'monthly':
            const monthStart = new Date(analysisDate);
            monthStart.setDate(1);
            startDate = monthStart.toISOString().split('T')[0];
            break;
        }

        // Get usage data for the period
        const { data: usageData, error: usageError } = await supabase
          .from('api_usage_daily')
          .select(`
            *,
            api_keys!inner (
              service_provider,
              service_name,
              status
            )
          `)
          .gte('usage_date', startDate)
          .lte('usage_date', endDate)
          .eq('api_keys.status', 'active');

        if (usageError) {
          console.error('Error fetching usage data:', usageError);
          return new Response(JSON.stringify({ error: 'Failed to fetch usage data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Aggregate costs by service
        const costBreakdown = usageData.reduce((acc: any, usage: any) => {
          const provider = usage.api_keys.service_provider;
          if (!acc[provider]) {
            acc[provider] = {
              total_cost: 0,
              total_calls: 0,
              error_count: 0,
              avg_response_time: 0,
              service_count: 0
            };
          }
          
          acc[provider].total_cost += parseFloat(usage.total_cost || 0);
          acc[provider].total_calls += usage.total_calls || 0;
          acc[provider].error_count += usage.failed_calls || 0;
          acc[provider].avg_response_time += parseFloat(usage.avg_response_time_ms || 0);
          acc[provider].service_count++;
          
          return acc;
        }, {});

        // Calculate totals and efficiency metrics
        const totalCost = Object.values(costBreakdown).reduce((sum: number, service: any) => sum + service.total_cost, 0);
        const totalCalls = Object.values(costBreakdown).reduce((sum: number, service: any) => sum + service.total_calls, 0);
        const totalErrors = Object.values(costBreakdown).reduce((sum: number, service: any) => sum + service.error_count, 0);

        // Calculate cost per call and efficiency score
        const costPerCall = totalCalls > 0 ? totalCost / totalCalls : 0;
        const errorRate = totalCalls > 0 ? (totalErrors / totalCalls) * 100 : 0;
        const costEfficiencyScore = Math.max(0, 100 - (errorRate * 10) - Math.min(50, costPerCall * 1000));

        // Project monthly cost based on current usage
        const daysInPeriod = request.period_type === 'daily' ? 1 : 
                            request.period_type === 'weekly' ? 7 : 
                            new Date(new Date(analysisDate).getFullYear(), new Date(analysisDate).getMonth() + 1, 0).getDate();
        
        const dailyAvgCost = totalCost / daysInPeriod;
        const projectedMonthlyCost = dailyAvgCost * 30;

        // Format cost breakdown for storage
        const formattedBreakdown = {
          total_cost: totalCost,
          openai_cost: costBreakdown.openai?.total_cost || 0,
          stripe_cost: costBreakdown.stripe?.total_cost || 0,
          maps_cost: costBreakdown.google_maps?.total_cost || 0,
          supabase_cost: costBreakdown.supabase?.total_cost || 0,
          other_costs: totalCost - (costBreakdown.openai?.total_cost || 0) - (costBreakdown.stripe?.total_cost || 0) - (costBreakdown.google_maps?.total_cost || 0) - (costBreakdown.supabase?.total_cost || 0)
        };

        // Store analysis results
        const { error: insertError } = await supabase
          .from('api_cost_analysis')
          .upsert({
            analysis_date: analysisDate,
            period_type: request.period_type,
            ...formattedBreakdown,
            total_calls: totalCalls,
            total_errors: totalErrors,
            cost_per_call: costPerCall,
            cost_efficiency_score: costEfficiencyScore,
            projected_monthly_cost: projectedMonthlyCost,
            budget_utilization_percentage: 0, // Would need budget configuration
            optimization_suggestions: JSON.stringify([]),
            cost_anomalies: JSON.stringify([])
          }, {
            onConflict: 'analysis_date,period_type'
          });

        if (insertError) {
          console.error('Error storing cost analysis:', insertError);
          return new Response(JSON.stringify({ error: 'Failed to store analysis' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({
          success: true,
          analysis: {
            analysis_date: analysisDate,
            period_type: request.period_type,
            cost_breakdown: formattedBreakdown,
            total_calls: totalCalls,
            total_errors: totalErrors,
            cost_per_call: costPerCall,
            cost_efficiency_score: costEfficiencyScore,
            projected_monthly_cost: projectedMonthlyCost,
            service_breakdown: costBreakdown
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'generate_recommendations': {
        // Analyze usage patterns and generate optimization recommendations
        const { api_key_id, service_provider } = data;

        // Get recent usage data for analysis
        const { data: recentUsage, error: usageError } = await supabase
          .from('api_usage_daily')
          .select(`
            *,
            api_keys!inner (
              service_provider,
              service_name,
              monthly_quota_limit,
              cost_limit_monthly
            )
          `)
          .eq(api_key_id ? 'api_key_id' : 'api_keys.service_provider', api_key_id || service_provider)
          .gte('usage_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('usage_date', { ascending: false });

        if (usageError) {
          console.error('Error fetching usage data for recommendations:', usageError);
          return new Response(JSON.stringify({ error: 'Failed to fetch usage data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const recommendations: OptimizationRecommendation[] = [];

        // Analyze patterns and generate recommendations
        if (recentUsage && recentUsage.length > 0) {
          const avgDailyCost = recentUsage.reduce((sum, day) => sum + parseFloat(day.total_cost || 0), 0) / recentUsage.length;
          const avgErrorRate = recentUsage.reduce((sum, day) => sum + parseFloat(day.error_rate || 0), 0) / recentUsage.length;
          const avgResponseTime = recentUsage.reduce((sum, day) => sum + parseFloat(day.avg_response_time_ms || 0), 0) / recentUsage.length;

          // High cost recommendation
          if (avgDailyCost > 10) {
            recommendations.push({
              service_provider: recentUsage[0].api_keys.service_provider,
              category: 'cost',
              priority: 1,
              title: 'High Daily API Costs Detected',
              description: `Average daily cost of $${avgDailyCost.toFixed(2)} is above recommended threshold. Consider implementing caching or optimizing API calls.`,
              potential_cost_savings: avgDailyCost * 0.3 * 30, // 30% savings over 30 days
              implementation_effort: 'medium',
              implementation_steps: [
                'Implement response caching for frequently requested data',
                'Batch API requests where possible',
                'Review and optimize query parameters',
                'Set up rate limiting to prevent excessive usage'
              ]
            });
          }

          // High error rate recommendation
          if (avgErrorRate > 5) {
            recommendations.push({
              service_provider: recentUsage[0].api_keys.service_provider,
              category: 'performance',
              priority: 2,
              title: 'High Error Rate Detected',
              description: `Average error rate of ${avgErrorRate.toFixed(1)}% indicates reliability issues. Implement retry logic and error handling.`,
              potential_performance_gain: 15,
              implementation_effort: 'low',
              implementation_steps: [
                'Implement exponential backoff retry logic',
                'Add comprehensive error handling',
                'Monitor and alert on error spikes',
                'Review API usage patterns causing errors'
              ]
            });
          }

          // Slow response time recommendation
          if (avgResponseTime > 2000) {
            recommendations.push({
              service_provider: recentUsage[0].api_keys.service_provider,
              category: 'performance',
              priority: 3,
              title: 'Slow API Response Times',
              description: `Average response time of ${avgResponseTime.toFixed(0)}ms is above optimal threshold. Consider optimization strategies.`,
              potential_performance_gain: 40,
              implementation_effort: 'medium',
              implementation_steps: [
                'Optimize API request payloads',
                'Implement request timeouts',
                'Use CDN for static content',
                'Consider parallel request processing'
              ]
            });
          }
        }

        // Store recommendations
        for (const rec of recommendations) {
          const { error: recError } = await supabase
            .from('api_optimization_recommendations')
            .insert({
              api_key_id: api_key_id,
              service_provider: rec.service_provider,
              category: rec.category,
              priority: rec.priority,
              title: rec.title,
              description: rec.description,
              potential_cost_savings: rec.potential_cost_savings,
              potential_performance_gain: rec.potential_performance_gain,
              implementation_effort: rec.implementation_effort,
              implementation_steps: JSON.stringify(rec.implementation_steps)
            });

          if (recError) {
            console.error('Error storing recommendation:', recError);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          recommendations: recommendations,
          generated_count: recommendations.length
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      case 'forecast_costs': {
        // Generate cost forecasts based on historical data
        const { forecast_days = 30 } = data;

        // Get historical cost data
        const { data: historicalData, error: histError } = await supabase
          .from('api_cost_analysis')
          .select('*')
          .eq('period_type', 'daily')
          .gte('analysis_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('analysis_date', { ascending: true });

        if (histError) {
          console.error('Error fetching historical data:', histError);
          return new Response(JSON.stringify({ error: 'Failed to fetch historical data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (!historicalData || historicalData.length < 7) {
          return new Response(JSON.stringify({ error: 'Insufficient historical data for forecasting' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // Simple linear trend forecasting
        const costs = historicalData.map(d => parseFloat(d.total_cost || 0));
        const avgDailyCost = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
        
        // Calculate trend (simple linear regression)
        const n = costs.length;
        const sumX = (n * (n + 1)) / 2;
        const sumXY = costs.reduce((sum, cost, index) => sum + cost * (index + 1), 0);
        const trend = (sumXY - (sumX * avgDailyCost)) / ((n * (n + 1) * (2 * n + 1)) / 6 - sumX * sumX / n);

        // Generate forecast
        const forecast = [];
        for (let i = 1; i <= forecast_days; i++) {
          const forecastDate = new Date();
          forecastDate.setDate(forecastDate.getDate() + i);
          
          const forecastCost = Math.max(0, avgDailyCost + trend * i);
          
          forecast.push({
            date: forecastDate.toISOString().split('T')[0],
            predicted_cost: forecastCost,
            confidence: Math.max(0.5, 1 - (i / forecast_days) * 0.5) // Decreasing confidence over time
          });
        }

        const totalForecastCost = forecast.reduce((sum, day) => sum + day.predicted_cost, 0);

        return new Response(JSON.stringify({
          success: true,
          forecast: {
            forecast_days: forecast_days,
            total_forecast_cost: totalForecastCost,
            avg_daily_cost: avgDailyCost,
            trend_direction: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
            daily_forecasts: forecast
          }
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
    console.error('API Cost Analyzer Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});