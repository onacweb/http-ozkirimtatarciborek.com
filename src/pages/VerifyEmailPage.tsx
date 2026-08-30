import { useState, useEffect } from 'react';
import { MailCheck, AlertCircle, RefreshCw, Check, Clock, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateOTP } from '@/lib/validation';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/lib/auth';

interface VerifyEmailPageProps {
  onNavigate: (page: string) => void;
  email: string;
}

export function VerifyEmailPage({ onNavigate, email }: VerifyEmailPageProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { refreshProfile } = useAuth();

  useEffect(() => {
    sendCode();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendCode = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const otp = generateOTP();
    const { error: insertError } = await supabase.from('verification_codes').insert({
      user_id: user.id,
      code: otp,
    });

    if (insertError) {
      console.error('Code insert error:', insertError);
      return;
    }

    console.log(`[ONAÇ WEB] Doğrulama kodu (${email}): ${otp}`);
    setResendCooldown(60);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setError('Lütfen 6 haneli kodu eksiksiz girin');
      return;
    }

    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc('verify_email', {
      p_code: fullCode,
    });

    if (rpcError) {
      setError('Doğrulama sırasında bir hata oluştu');
      setLoading(false);
      return;
    }

    if (data?.success) {
      setSuccess(true);
      await refreshProfile();
    } else {
      setError(data?.error || 'Geçersiz kod');
      setLoading(false);
    }
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
          <h1 className="text-3xl font-extrabold text-white mb-3">E-posta Doğrulandı!</h1>

          <div className="glass rounded-2xl p-6 mt-6 border border-orange-500/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-400" />
              <h2 className="font-bold text-white">Admin Onayı Bekleniyor</h2>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              E-posta adresiniz doğrulandı. Hesabınız şu anda admin onayı bekliyor.
              Onaylandığında giriş yaparak panelinize erişebilirsiniz.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
            >
              Giriş Sayfasına Dön
            </button>
          </div>
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
          <div className="inline-flex w-16 h-16 rounded-2xl bg-orange-500/10 items-center justify-center mb-4">
            <MailCheck className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">E-posta Doğrulama</h1>
          <p className="text-white/40">
            <span className="font-semibold text-white/70">{email}</span> adresine
            <br />6 haneli doğrulama kodu gönderildi
          </p>
        </div>

        <div className="glass rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-3">
              {code.map((digit, i) => (
                <input
                  key={i}
                  id={`code-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-white/5 border-2 border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Doğrula'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={sendCode}
              disabled={resendCooldown > 0}
              className="text-sm font-medium text-orange-400 hover:text-orange-300 disabled:text-white/30 flex items-center justify-center gap-2 mx-auto"
            >
              {resendCooldown > 0 ? `${resendCooldown} sn sonra tekrar gönderebilirsiniz` : (
                <><RefreshCw className="w-4 h-4" /> Kodu Tekrar Gönder</>
              )}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/30 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Demo ortamında doğrulama kodu tarayıcı konsolunda gösterilir
        </p>
      </div>
    </div>
  );
}
