import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the current user from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get the JWT token and verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is a super_admin
    const { data: currentUserData, error: userError } = await supabaseClient
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (userError || currentUserData?.user_type !== 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Super admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get user details to check if they're a guide
    const { data: targetUser, error: targetUserError } = await supabaseClient
      .from('users')
      .select('user_type, email, first_name, last_name')
      .eq('id', userId)
      .single()

    if (targetUserError) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Prevent deletion of super_admin users
    if (targetUser.user_type === 'super_admin') {
      return new Response(
        JSON.stringify({ error: 'Cannot delete super admin users' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check for active bookings if user is a guide
    if (targetUser.user_type === 'guide') {
      const { data: guideData, error: guideError } = await supabaseClient
        .from('guides')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!guideError && guideData) {
        // Check for active bookings
        const { data: bookings, error: bookingsError } = await supabaseClient
          .from('bookings')
          .select('id, booking_date, start_time, participants, status, adventure_id')
          .eq('guide_id', guideData.id)
          .in('status', ['pending', 'confirmed'])
          .gte('booking_date', new Date().toISOString().split('T')[0])

        if (bookingsError) {
          console.error('Error checking bookings:', bookingsError)
          return new Response(
            JSON.stringify({ error: 'Error checking bookings' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }

        if (bookings && bookings.length > 0) {
          // Check for imminent bookings (within 48 hours)
          const now = new Date()
          const fortyEightHoursFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000))
          
          const imminentBookings = bookings.filter(booking => {
            const bookingDateTime = new Date(`${booking.booking_date}T${booking.start_time || '09:00:00'}`)
            return bookingDateTime <= fortyEightHoursFromNow
          })

          if (imminentBookings.length > 0) {
            return new Response(
              JSON.stringify({
                error: 'Cannot delete guide with bookings within 48 hours',
                bookingConflict: {
                  type: 'imminent',
                  count: imminentBookings.length,
                  bookings: imminentBookings,
                  message: 'This guide has bookings within the next 48 hours. Deletion is blocked for customer safety.'
                }
              }),
              { status: 409, headers: { 'Content-Type': 'application/json' } }
            )
          }

          // Return future bookings warning
          return new Response(
            JSON.stringify({
              error: 'Guide has active future bookings',
              bookingConflict: {
                type: 'future',
                count: bookings.length,
                bookings: bookings,
                message: 'This guide has future bookings. You must handle refunds or reassignments before deletion.'
              }
            }),
            { status: 409, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Delete user using admin API
    const { data, error } = await supabaseClient.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting user:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User deleted successfully',
        deletedUser: {
          email: targetUser.email,
          name: `${targetUser.first_name || ''} ${targetUser.last_name || ''}`.trim() || targetUser.email
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})