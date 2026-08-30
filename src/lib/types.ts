export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  email_verified: boolean;
  avatar_url: string | null;
  last_seen: string;
  created_at: string;
  approval_status: 'pending' | 'approved' | 'rejected';
}

export interface VerificationCode {
  id: string;
  user_id: string;
  code: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  user_id: string;
  content: string;
  sender: 'user' | 'admin';
  read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  page: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  login_at: string;
  logout_at: string | null;
  duration_seconds: number | null;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}
