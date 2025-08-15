// Script to update admin password using Supabase Auth Admin API
// Run this with: node update-admin-password.js

import { createClient } from '@supabase/supabase-js'

// You'll need to get these from your Supabase project settings
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY' // Must be service role key, not anon key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateAdminPassword() {
  try {
    console.log('Updating admin password...')
    
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      'a31a939e-7d90-4aa5-b821-c15e07ad4466', // jg.mastermind@gmail.com user ID
      { password: 'BelizeT2355!' }
    )
    
    if (error) {
      console.error('Error updating password:', error)
      return
    }
    
    console.log('✅ Password updated successfully!')
    console.log('User can now login with:')
    console.log('  Email: jg.mastermind@gmail.com')
    console.log('  Password: BelizeT2355!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

updateAdminPassword()