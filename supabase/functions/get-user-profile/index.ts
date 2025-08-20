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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      
      // If user doesn't exist in users table, create with defaults
      if (profileError.code === 'PGRST116') {
        const defaultProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          user_type: user.user_metadata?.user_type || 'traveler',
          profile_image: user.user_metadata?.avatar_url || null,
          whatsapp_enabled: false,
          notification_preferences: {
            email: true,
            whatsapp: false,
            push: false
          },
          dark_mode: false,
          emergency_contact: user.user_metadata?.user_type === 'traveler' ? {
            name: '',
            phone: '',
            relation: ''
          } : null,
          dietary_restrictions: user.user_metadata?.user_type === 'traveler' ? '' : null,
          bio: user.user_metadata?.user_type === 'guide' ? '' : null,
          certifications: user.user_metadata?.user_type === 'guide' ? [] : null,
          operating_region: user.user_metadata?.user_type === 'guide' ? '' : null,
          languages_spoken: user.user_metadata?.user_type === 'guide' ? ['English'] : null,
        };

        const { data: newProfile, error: insertError } = await supabaseClient
          .from('users')
          .insert(defaultProfile)
          .select()
          .single();

        if (insertError) {
          console.error('Failed to create user profile:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create user profile' }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(
          JSON.stringify(newProfile),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch profile' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify(profile),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});