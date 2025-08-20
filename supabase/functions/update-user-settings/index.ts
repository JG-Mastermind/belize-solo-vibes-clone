import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          user_type: string;
          profile_image: string | null;
          whatsapp_enabled: boolean | null;
          notification_preferences: any | null;
          dark_mode: boolean | null;
          emergency_contact: any | null;
          dietary_restrictions: string | null;
          bio: string | null;
          certifications: string[] | null;
          operating_region: string | null;
          languages_spoken: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          user_type: string;
          profile_image?: string | null;
          whatsapp_enabled?: boolean | null;
          notification_preferences?: any | null;
          dark_mode?: boolean | null;
          emergency_contact?: any | null;
          dietary_restrictions?: string | null;
          bio?: string | null;
          certifications?: string[] | null;
          operating_region?: string | null;
          languages_spoken?: string[] | null;
        };
        Update: {
          full_name?: string | null;
          profile_image?: string | null;
          whatsapp_enabled?: boolean | null;
          notification_preferences?: any | null;
          dark_mode?: boolean | null;
          emergency_contact?: any | null;
          dietary_restrictions?: string | null;
          bio?: string | null;
          certifications?: string[] | null;
          operating_region?: string | null;
          languages_spoken?: string[] | null;
          updated_at?: string;
        };
      };
    };
  };
}

interface UpdateUserSettingsRequest {
  full_name?: string;
  profile_image?: string;
  whatsapp_enabled?: boolean;
  notification_preferences?: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  dark_mode?: boolean;
  // Traveler-specific fields
  emergency_contact?: {
    name: string;
    phone: string;
    relation: string;
  };
  dietary_restrictions?: string;
  // Guide-specific fields
  bio?: string;
  certifications?: string[];
  operating_region?: string;
  languages_spoken?: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const updates: UpdateUserSettingsRequest = await req.json();

    // Validate required fields
    if (!updates || typeof updates !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate notification preferences structure if provided
    if (updates.notification_preferences) {
      const validKeys = ['email', 'whatsapp', 'push'];
      const providedKeys = Object.keys(updates.notification_preferences);
      
      if (!providedKeys.every(key => validKeys.includes(key))) {
        return new Response(
          JSON.stringify({ error: 'Invalid notification preferences format' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Validate emergency contact structure if provided
    if (updates.emergency_contact) {
      const requiredFields = ['name', 'phone', 'relation'];
      const hasAllFields = requiredFields.every(field => 
        field in updates.emergency_contact!
      );
      
      if (!hasAllFields) {
        return new Response(
          JSON.stringify({ error: 'Emergency contact must include name, phone, and relation' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Prepare update object (excluding read-only fields)
    const updateData: Database['public']['Tables']['users']['Update'] = {
      updated_at: new Date().toISOString(),
    };

    // Add allowed fields from the request
    if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
    if (updates.profile_image !== undefined) updateData.profile_image = updates.profile_image;
    if (updates.whatsapp_enabled !== undefined) updateData.whatsapp_enabled = updates.whatsapp_enabled;
    if (updates.notification_preferences !== undefined) updateData.notification_preferences = updates.notification_preferences;
    if (updates.dark_mode !== undefined) updateData.dark_mode = updates.dark_mode;
    if (updates.emergency_contact !== undefined) updateData.emergency_contact = updates.emergency_contact;
    if (updates.dietary_restrictions !== undefined) updateData.dietary_restrictions = updates.dietary_restrictions;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.certifications !== undefined) updateData.certifications = updates.certifications;
    if (updates.operating_region !== undefined) updateData.operating_region = updates.operating_region;
    if (updates.languages_spoken !== undefined) updateData.languages_spoken = updates.languages_spoken;

    // Update user profile in database
    const { data: updatedProfile, error: updateError } = await supabaseClient
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      
      if (updateError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'User profile not found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify(updatedProfile),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});