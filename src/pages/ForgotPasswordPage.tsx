import { useState } from 'react';
import { Mail, ArrowRight, AlertCircle, Check, ArrowLeft, KeyRound } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateEmail } from '@/lib/validation';
import { Logo } from '@/components/Logo';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    if (emailErr) return setError(emailErr);

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#reset-password`,
    });

    if (resetError) {
      setError('Sıfırlama bağlantısı gönderilemedi. E-posta adresini kontrol edin.');
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] animate-glow" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate('home')} className="inline-block mb-6">
            <Logo dark />
          </button>
          <div className="inline-flex w-16 h-16 rounded-2xl bg-orange-500/10 items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Şifremi Unuttum</h1>
          <p className="text-white/40">E-posta adresinize sıfırlama bağlantısı gönderelim</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4 animate-scale-in">
              <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bağlantı Gönderildi!</h3>
              <p className="text-sm text-white/50 mb-6">
                <span className="font-semibold text-white/70">{email}</span> adresine şifre sıfırlama bağlantısı gönderdik.
                E-postanızı kontrol edin ve bağlantıya tıklayın.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
              >
                Giriş Sayfasına Dön
              </button>
            </div>
          ) : (
            <>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sıfırlama Bağlantısı Gönder <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>

              <button
                onClick={() => onNavigate('login')}
                className="mt-6 w-full flex items-center justify-center gap-2 text-sm font-medium text-white/40 hover:text-orange-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Giriş sayfasına dön
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
