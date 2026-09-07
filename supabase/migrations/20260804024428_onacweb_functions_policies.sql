/*
# ONACWEB Web Studio - Functions, Policies, and Triggers

## Overview
Adds SECURITY DEFINER functions (is_admin, handle_new_user, verify_email), RLS policies
on all tables, column-level protection on profiles, and the new-user trigger.

## Functions
1. is_admin() - SECURITY DEFINER, STABLE - returns true if current user has admin role
2. handle_new_user() - SECURITY DEFINER trigger - creates profile on new auth user; first user becomes admin
3. verify_email(p_code) - SECURITY DEFINER - verifies email via 6-digit OTP code

## Security Changes (RLS Policies)
- profiles: SELECT (own + admin), UPDATE (own only); role and email_verified columns REVOKE'd from authenticated
- verification_codes: SELECT/INSERT/UPDATE own only
- support_messages: SELECT (own + admin), INSERT (user sends as 'user', admin sends as 'admin'), UPDATE (admin only)
- activity_logs: SELECT admin-only, INSERT own only
- user_sessions: SELECT admin-only, INSERT/UPDATE own only

## Triggers
- on_auth_user_created: AFTER INSERT on auth.users -> handle_new_user()

## Realtime
- support_messages and profiles added to supabase_realtime publication

## Important Notes
1. First user to sign up automatically becomes admin
2. verify_email is SECURITY DEFINER so it can update email_verified despite the REVOKE
3. sender field enforced in INSERT policy - users can only send as 'user', admins only as 'admin'
*/

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
    INSERT INTO public.profiles (id, email, full_name, role, email_verified)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'admin', false);
  ELSE
    INSERT INTO public.profiles (id, email, full_name, role, email_verified)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'user', false);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.verify_email(p_code text)
RETURNS jsonb AS $$
DECLARE
  v_record public.verification_codes;
BEGIN
  SELECT * INTO v_record FROM public.verification_codes
  WHERE user_id = auth.uid()
    AND code = p_code
    AND used = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Geçersiz veya süresi dolmuş kod');
  END IF;

  UPDATE public.verification_codes SET used = true WHERE id = v_record.id;
  UPDATE public.profiles SET email_verified = true WHERE id = auth.uid();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PROFILES POLICIES + COLUMN PROTECTION
-- ============================================================================
REVOKE UPDATE (role) ON public.profiles FROM authenticated;
REVOKE UPDATE (email_verified) ON public.profiles FROM authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================================
-- VERIFICATION CODES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_own_codes" ON public.verification_codes;
CREATE POLICY "select_own_codes" ON public.verification_codes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_codes" ON public.verification_codes;
CREATE POLICY "insert_own_codes" ON public.verification_codes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_codes" ON public.verification_codes;
CREATE POLICY "update_own_codes" ON public.verification_codes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SUPPORT MESSAGES POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_messages" ON public.support_messages;
CREATE POLICY "select_messages" ON public.support_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "insert_messages" ON public.support_messages;
CREATE POLICY "insert_messages" ON public.support_messages FOR INSERT
  TO authenticated WITH CHECK (
    (auth.uid() = user_id AND sender = 'user')
    OR (public.is_admin() AND sender = 'admin')
  );

DROP POLICY IF EXISTS "update_messages_admin" ON public.support_messages;
CREATE POLICY "update_messages_admin" ON public.support_messages FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================================
-- ACTIVITY LOGS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_logs_admin" ON public.activity_logs;
CREATE POLICY "select_logs_admin" ON public.activity_logs FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "insert_own_logs" ON public.activity_logs;
CREATE POLICY "insert_own_logs" ON public.activity_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER SESSIONS POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "select_sessions_admin" ON public.user_sessions;
CREATE POLICY "select_sessions_admin" ON public.user_sessions FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "insert_own_session" ON public.user_sessions;
CREATE POLICY "insert_own_session" ON public.user_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_session" ON public.user_sessions;
CREATE POLICY "update_own_session" ON public.user_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- REALTIME
-- ============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;