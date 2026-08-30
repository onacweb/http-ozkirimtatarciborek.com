import { useState } from 'react';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check, ShieldCheck, Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { validateEmail, validatePassword, validateName } from '@/lib/validation';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onRegistered: (email: string) => void;
}

export function RegisterPage({ onNavigate, onRegistered }: RegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: 'En az 8 karakter', valid: password.length >= 8 },
    { label: 'En az bir harf', valid: /[a-zA-Z]/.test(password) },
    { label: 'En az bir rakam', valid: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (nameErr) return setError(nameErr);
    if (emailErr) return setError(emailErr);
    if (passErr) return setError(passErr);
    if (password !== confirmPassword) return setError('Şifreler eşleşmiyor');
    if (!acceptTerms) return setError('Kullanım şartlarını kabul etmelisiniz');

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: fullName.trim() } },
    });

    if (signUpError) {
      setError(
        signUpError.message.includes('already')
          ? 'Bu e-posta adresi zaten kayıtlı'
          : 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      onRegistered(email.trim());
    } else {
      setError('Kayıt tamamlanamadı. Lütfen tekrar deneyin.');
      setLoading(false);
    }
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
          <h1 className="text-3xl font-extrabold text-white mb-2">Hesap Oluştur</h1>
          <p className="text-white/40">ONAÇ WEB Studio'ya katılın</p>
        </div>

        {/* Approval notice */}
        <div className="glass rounded-xl p-4 mb-6 flex items-start gap-3 border border-orange-500/20">
          <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin Onayı Gereklidir</p>
            <p className="text-xs text-white/40 mt-0.5">
              Kayıt olduktan sonra hesabınız admin onayı bekleyecektir. Onaylandıktan sonra giriş yapabilirsiniz.
            </p>
          </div>
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
              <label className="block text-sm font-medium text-white/60 mb-1.5">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                  placeholder="Adınız Soyadınız"
                />
              </div>
            </div>

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
                  placeholder="En az 8 karakter"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${check.valid ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                        {check.valid && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className={check.valid ? 'text-emerald-400' : 'text-white/30'}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
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
                  autoComplete="new-password"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/20"
              />
              <span className="text-sm text-white/50">Kullanım şartlarını ve gizlilik politikasını kabul ediyorum</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Kayıt Ol <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Zaten hesabınız var mı?{' '}
            <button onClick={() => onNavigate('login')} className="font-semibold text-orange-400 hover:text-orange-300">
              Giriş Yapın
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Verileriniz 256-bit SSL ile şifrelenmiştir
        </div>
      </div>
    </div>
  );
}
