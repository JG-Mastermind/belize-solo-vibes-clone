import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RevokeRequest {
  invitation_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from auth token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is super_admin
    const { data: userData, error: fetchError } = await supabaseClient
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (fetchError || !userData || userData.user_type !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Super admin required.' }),
        { 
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse request body
    const { invitation_id }: RevokeRequest = await req.json();

    if (!invitation_id) {
      return new Response(
        JSON.stringify({ error: 'Invitation ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Verify invitation exists and is active
    const { data: invitation, error: getError } = await supabaseClient
      .from('admin_invitations')
      .select('id, email, is_active, used_at')
      .eq('id', invitation_id)
      .single();

    if (getError || !invitation) {
      return new Response(
        JSON.stringify({ error: 'Invitation not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (!invitation.is_active || invitation.used_at) {
      return new Response(
        JSON.stringify({ error: 'Invitation is already inactive or used' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Deactivate the invitation
    const { error: updateError } = await supabaseClient
      .from('admin_invitations')
      .update({ 
        is_active: false, 
        used_at: new Date().toISOString() 
      })
      .eq('id', invitation_id);

    if (updateError) {
      throw new Error(`Failed to revoke invitation: ${updateError.message}`);
    }

    // Log the action in audit trail
    const { error: auditError } = await supabaseClient
      .from('admin_invitation_audit')
      .insert({
        invitation_id: invitation_id,
        acted_by: user.id,
        action: 'revoke'
      });

    if (auditError) {
      console.error('Failed to log audit trail:', auditError);
      // Don't fail the request if audit logging fails
    }

    console.log(`Invitation ${invitation_id} revoked by ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation revoked successfully',
        invitation_id: invitation_id,
        revoked_at: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error in revoke_admin_invite:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});