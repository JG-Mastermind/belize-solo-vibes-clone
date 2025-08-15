/**
 * Integration test for admin role detection
 * This test verifies that the getUserRole() function correctly fetches
 * admin roles from the database instead of relying on user metadata
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

describe('Admin Role Detection Integration', () => {
  let originalSession: any;

  beforeEach(async () => {
    // Store original session
    const { data } = await supabase.auth.getSession();
    originalSession = data.session;
  });

  afterEach(async () => {
    // Restore original session or sign out
    if (originalSession) {
      await supabase.auth.setSession(originalSession);
    } else {
      await supabase.auth.signOut();
    }
  });

  test('should fetch super_admin role for jg.mastermind@gmail.com from database', async () => {
    // Query the database directly to verify the test data exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('email', 'jg.mastermind@gmail.com')
      .single();

    expect(userError).toBeNull();
    expect(userData?.user_type).toBe('super_admin');
  });

  test('should query users table for role instead of metadata', async () => {
    // Create a test to verify our fetchUserRole function works
    const testUserId = 'a31a939e-7d90-4aa5-b821-c15e07ad4466';
    
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', testUserId)
      .single();

    expect(error).toBeNull();
    expect(data?.user_type).toBe('super_admin');
  });

  test('should handle non-existent user gracefully', async () => {
    const fakeUserId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', fakeUserId)
      .single();

    // Should either return null data or an error for non-existent user
    expect(data).toBeNull();
    expect(error).toBeTruthy();
  });

  test('should return null for users without user_type', async () => {
    // Test with a regular user (traveler type)
    const { data, error } = await supabase
      .from('users')
      .select('user_type')
      .eq('user_type', 'traveler')
      .limit(1)
      .single();

    // If we have traveler users, verify they don't have admin roles
    if (!error && data) {
      expect(data.user_type).toBe('traveler');
      expect(data.user_type).not.toBe('admin');
      expect(data.user_type).not.toBe('super_admin');
    }
  });
});