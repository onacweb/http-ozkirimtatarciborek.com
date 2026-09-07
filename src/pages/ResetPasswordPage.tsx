import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validatePassword } from '@/lib/validation';
import { Logo } from '@/components/Logo';

interface ResetPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase will have set the session from the recovery link hash
    supabase.auth.getSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passErr = validatePassword(password);
    if (passErr) return setError(passErr);
    if (password !== confirmPassword) return setError('Şifreler eşleşmiyor');

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError('Şifre güncellenemedi. Bağlantınız geçersiz olabilir.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative text-center max-w-md animate-scale-in">
          <div className="inline-flex w-20 h-20 rounded-full bg-emerald-500/20 items-center justify-center mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Şifreniz Güncellendi!</h1>
          <p className="text-white/50 mb-8">Yeni şifrenizle güvenle giriş yapabilirsiniz.</p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] animate-glow" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-block mb-6">
            <Logo dark />
          </button>
          <h1 className="text-3xl font-extrabold text-white mb-2">Yeni Şifre Belirle</h1>
          <p className="text-white/40">Hesabınız için yeni bir şifre oluşturun</p>
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
              <label className="block text-sm font-medium text-white/60 mb-1.5">Yeni Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  placeholder="En az 8 karakter"
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

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  placeholder="Şifrenizi tekrar girin"
                />
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
                <>Şifreyi Güncelle <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Güvenli SSL bağlantısı ile korunmaktadır
        </div>
      </div>
    </div>
  );
}
