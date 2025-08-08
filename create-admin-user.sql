-- Create Admin User Script
-- Run this in your Supabase SQL Editor

-- First, create the user in auth.users (this will be handled by Supabase Auth)
-- You'll need to create this user through the Supabase Dashboard or Auth API

-- After creating the user, insert them into admin_users table
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT 
  au.id,
  'super_admin',
  '{"all": true}'::jsonb
FROM auth.users au
WHERE au.email = 'admin@trademaster.ai'
ON CONFLICT (user_id) DO NOTHING;

-- Verify the admin user was created
SELECT 
  au.email,
  au.id,
  adu.role,
  adu.permissions
FROM auth.users au
JOIN public.admin_users adu ON au.id = adu.user_id
WHERE au.email = 'admin@trademaster.ai'; 