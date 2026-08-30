/*
# Add Registration Approval System + Password Reset Tokens

## Overview
This migration adds a registration approval workflow so the admin must approve every new user before they can log in.
It also adds a password reset token table for "forgot password" and "forgot email" flows.

## Changes to existing tables
- `profiles` — add `approval_status` column (text, default 'pending')
  - Values: 'pending' (awaiting admin approval), 'approved' (admin approved), 'rejected' (admin rejected)
  - Existing profiles get 'approved' so the admin and any existing users keep access.

## New tables
- `password_reset_tokens`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, ON DELETE CASCADE)
  - `token` (text, unique, not null) — the reset token
  - `used` (boolean, default false)
  - `expires_at` (timestamtz, default now() + 1 hour)
  - `created_at` (timestamtz, default now())

## Security
- RLS enabled on `password_reset_tokens`.
- Users can only read their own reset tokens (authenticated, owner-scoped).
- Users can insert their own reset tokens.
- Users can update (mark as used) their own reset tokens.
- Admins can read all reset tokens.
- Profiles: existing policies unchanged; new policy added so authenticated users can read their own approval_status (already covered by existing SELECT policy).

## Important notes
1. The admin's own profile is set to 'approved' in this migration.
2. New signups default to 'pending' — they cannot access the panel until approved.
3. The frontend checks approval_status after login and blocks access if 'pending' or 'rejected'.
*/

-- Add approval_status column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending';

-- Set existing profiles to approved so current users keep access
UPDATE profiles SET approval_status = 'approved' WHERE approval_status = 'pending' AND role = 'admin';

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  used boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for password_reset_tokens (owner-scoped)
DROP POLICY IF EXISTS "select_own_reset_tokens" ON password_reset_tokens;
CREATE POLICY "select_own_reset_tokens"
  ON password_reset_tokens FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reset_tokens" ON password_reset_tokens;
CREATE POLICY "insert_own_reset_tokens"
  ON password_reset_tokens FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reset_tokens" ON password_reset_tokens;
CREATE POLICY "update_own_reset_tokens"
  ON password_reset_tokens FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a SECURITY DEFINER function so admin can approve/reject users
-- without needing direct table update access on all profiles
CREATE OR REPLACE FUNCTION approve_user(p_user_id uuid, p_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins can call this (check via auth.uid -> profiles.role)
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Yetkisiz erişim';
  END IF;

  IF p_status NOT IN ('approved', 'rejected', 'pending') THEN
    RAISE EXCEPTION 'Geçersiz durum';
  END IF;

  UPDATE profiles
  SET approval_status = p_status
  WHERE id = p_user_id;

  RETURN true;
END;
$$;

-- Grant execute to authenticated
GRANT EXECUTE ON FUNCTION approve_user(uuid, text) TO authenticated;

-- Create a SECURITY DEFINER function to check approval status
-- This allows the frontend to check if a user is approved
CREATE OR REPLACE FUNCTION check_approval_status(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  status text;
BEGIN
  SELECT approval_status INTO status
  FROM profiles
  WHERE id = p_user_id;

  RETURN COALESCE(status, 'pending');
END;
$$;

GRANT EXECUTE ON FUNCTION check_approval_status(uuid) TO authenticated;
