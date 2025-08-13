import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  role: 'admin' | 'blogger';
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
    const { email, role }: InviteRequest = await req.json();

    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate role
    if (!['admin', 'blogger'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be admin or blogger.' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Generate cryptographically secure invitation code
    const invitationCode = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    // Check if active invitation already exists for this email
    const { data: existingInvite, error: checkError } = await supabaseClient
      .from('admin_invitations')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (checkError) {
      throw new Error('Error checking existing invitations');
    }

    if (existingInvite) {
      return new Response(
        JSON.stringify({ error: 'Active invitation already exists for this email' }),
        { 
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create invitation record
    const { data: inviteData, error: insertError } = await supabaseClient
      .from('admin_invitations')
      .insert({
        email: email.toLowerCase(),
        invitation_code: invitationCode,
        invited_by: user.id,
        role_type: role,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create invitation: ${insertError.message}`);
    }

    // TODO: Implement email sending with Resend in production
    // For now, we'll return the invitation details for testing
    const invitationUrl = `https://belizevibes.com/admin/accept?email=${encodeURIComponent(email)}&code=${invitationCode}`;
    
    console.log(`Invitation created for ${email} with code ${invitationCode}`);
    console.log(`Invitation URL: ${invitationUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Invitation created successfully',
        invitation_id: inviteData.id,
        expires_at: expiresAt.toISOString(),
        // Include URL for testing - remove in production
        invitation_url: invitationUrl
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error('Error in create_admin_invite:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});