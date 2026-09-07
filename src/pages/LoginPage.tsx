import { useState, useEffect } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, MessageCircle, Shield, KeyRound, HelpCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateEmail, validatePassword } from '@/lib/validation';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onAuthSuccess: () => void;
}

export function LoginPage({ onNavigate, onAuthSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      onAuthSuccess();
    }
  }, [onAuthSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) return setError(emailErr);
    if (passErr) return setError(passErr);

    setLoading(true);
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      setLoading(false);
      return;
    }

    if (signInData.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('approval_status, role')
        .eq('id', signInData.user.id)
        .maybeSingle();

      const status = profileData?.approval_status;
      if (status === 'pending') {
        await supabase.auth.signOut();
        setError('Hesabınız henüz onaylanmamış. Admin onayını bekleyin.');
        setLoading(false);
        return;
      }
      if (status === 'rejected') {
        await supabase.auth.signOut();
        setError('Hesabınız reddedilmiştir. Daha fazla bilgi için bizimle iletişime geçin.');
        setLoading(false);
        return;
      }
    }

    onAuthSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] animate-glow" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-block mb-6">
            <Logo dark />
          </button>
          <h1 className="text-3xl font-extrabold text-white mb-2">Tekrar Hoş Geldiniz</h1>
          <p className="text-white/40">Hesabınıza giriş yapın</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  placeholder="ornek@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Forgot password / email area */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-white/40 mb-3 text-center font-medium">Şifrenizi mi unuttunuz?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('forgot-password')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-white/60 hover:text-orange-400 bg-white/5 hover:bg-orange-500/10 rounded-lg transition-all"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Şifremi Unuttum
              </button>
              <button
                onClick={() => onNavigate('forgot-email')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium text-white/60 hover:text-orange-400 bg-white/5 hover:bg-orange-500/10 rounded-lg transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                E-postamı Unuttum
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-white/40">
            Hesabınız yok mu?{' '}
            <button onClick={() => onNavigate('register')} className="font-semibold text-orange-400 hover:text-orange-300">
              Kayıt Olun
            </button>
          </div>
        </div>

        {/* Admin hint */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
          <Shield className="w-4 h-4 text-orange-400/50" />
          Admin girişi için aynı formu kullanın
        </div>
      </div>
    </div>
  );
}
