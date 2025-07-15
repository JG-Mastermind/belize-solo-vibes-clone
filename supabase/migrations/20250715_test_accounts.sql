-- Migration: Test accounts for local development
-- Created: 2025-07-15
-- Purpose: Create dummy admin and guide accounts for testing role-based authentication

-- ⚠️  MANUAL SETUP REQUIRED ⚠️
-- Since we don't have direct CLI access, create these accounts manually:

-- OPTION 1: Via Supabase Dashboard
-- 1. Go to https://supabase.com/dashboard/project/tljeawrgjogbjvkjmrxo/auth/users
-- 2. Click "Add User" 
-- 3. Create admin user:
--    Email: admin@belizevibes.com
--    Password: Admin123!
--    Email Confirm: YES (skip confirmation)
--    User Metadata: {"role": "admin"}
-- 4. Create guide user:
--    Email: guide@belizevibes.com  
--    Password: Guide123!
--    Email Confirm: YES (skip confirmation)
--    User Metadata: {"role": "guide"}

-- OPTION 2: Via Application Signup (Recommended for testing)
-- 1. Start the dev server: npm run dev
-- 2. Use the signup form to create:
--    - admin@belizevibes.com with "Admin" role selected
--    - guide@belizevibes.com with "Tour Guide" role selected
-- 3. Both accounts will be automatically created with proper role metadata

-- OPTION 3: SQL Commands (if you have direct database access)
-- Run these in the Supabase SQL Editor:

/*
-- Insert admin account
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'admin@belizevibes.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  '{"role": "admin"}',
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
);

-- Insert guide account  
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  'guide@belizevibes.com',
  crypt('Guide123!', gen_salt('bf')),
  NOW(),
  '{"role": "guide"}',
  NOW(),
  NOW(),
  'authenticated',
  'authenticated'
);
*/

-- Test credentials for local development:
-- 👤 Admin: admin@belizevibes.com / Admin123!
-- 👤 Guide: guide@belizevibes.com / Guide123!