import { supabase } from './supabase';

export async function logActivity(
  action: string,
  page?: string,
  details?: Record<string, unknown>,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action,
    page,
    details: details ?? null,
  });
}

export async function trackSessionStart(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_sessions')
    .insert({ user_id: user.id, login_at: new Date().toISOString() })
    .select('id')
    .maybeSingle();

  if (error || !data) return null;
  return data.id;
}

export async function trackSessionEnd(sessionId: string) {
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('user_sessions')
    .select('login_at')
    .eq('id', sessionId)
    .maybeSingle();

  if (!data) return;

  const duration = Math.floor(
    (new Date(now).getTime() - new Date(data.login_at).getTime()) / 1000,
  );

  await supabase
    .from('user_sessions')
    .update({ logout_at: now, duration_seconds: duration })
    .eq('id', sessionId);
}
