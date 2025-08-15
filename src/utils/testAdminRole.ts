/**
 * Test script to verify admin role detection functionality
 * This can be run in the browser console to test the fix
 */

import { supabase } from '@/integrations/supabase/client';

export const testAdminRoleDetection = async () => {
  console.log('Testing admin role detection...');
  
  try {
    // Test 1: Check if we can query the users table
    console.log('Test 1: Querying users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, user_type')
      .limit(5);
    
    if (usersError) {
      console.error('Error querying users table:', usersError);
      return false;
    }
    
    console.log('✓ Users table query successful, found', users?.length, 'users');
    
    // Test 2: Check specific admin user
    console.log('Test 2: Checking admin user...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('user_type')
      .eq('email', 'jg.mastermind@gmail.com')
      .single();
    
    if (adminError) {
      console.error('Error querying admin user:', adminError);
      return false;
    }
    
    if (adminUser?.user_type === 'super_admin') {
      console.log('✓ Admin user found with correct role:', adminUser.user_type);
    } else {
      console.error('✗ Admin user not found or incorrect role:', adminUser);
      return false;
    }
    
    // Test 3: Test the fetchUserRole function logic
    console.log('Test 3: Testing fetchUserRole function logic...');
    const testUserId = 'a31a939e-7d90-4aa5-b821-c15e07ad4466';
    const { data: roleData, error: roleError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', testUserId)
      .single();
    
    if (roleError) {
      console.error('Error in fetchUserRole test:', roleError);
      return false;
    }
    
    console.log('✓ Role fetch successful for user ID:', testUserId, 'Role:', roleData?.user_type);
    
    console.log('🎉 All tests passed! Admin role detection should work correctly.');
    return true;
    
  } catch (error) {
    console.error('Unexpected error during testing:', error);
    return false;
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('Admin role detection test utility loaded. Run testAdminRoleDetection() to test.');
}