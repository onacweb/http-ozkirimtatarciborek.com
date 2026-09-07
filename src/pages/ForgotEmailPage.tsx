import { useState } from 'react';
import { HelpCircle, ArrowRight, AlertCircle, Check, ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface ForgotEmailPageProps {
  onNavigate: (page: string) => void;
}

export function ForgotEmailPage({ onNavigate }: ForgotEmailPageProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Lütfen adınızı ve soyadınızı girin');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin');
      return;
    }

    setSubmitted(true);
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
            <HelpCircle className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">E-postamı Unuttum</h1>
          <p className="text-white/40">Bilgilerinizi girin, e-posta adresinizi bulmanıza yardımcı olalım</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-4 animate-scale-in">
              <div className="inline-flex w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Talebiniz Alındı!</h3>
              <p className="text-sm text-white/50 mb-6">
                Bilgileriniz kontrol edilecek ve e-posta adresiniz en kısa sürede size bildirilecektir.
                Acil durumda WhatsApp üzerinden de ulaşabilirsiniz.
              </p>
              <div className="space-y-3">
                <a
                  href={getWhatsAppLink('Merhaba, e-posta adresimi unuttum. Bilgilerim: ' + `Ad: ${fullName}, Telefon: ${phone}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp ile İletişime Geç
                </a>
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all"
                >
                  Giriş Sayfasına Dön
                </button>
              </div>
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
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Ad Soyad</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                    placeholder="Adınız Soyadınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                      placeholder="+90 5xx xxx xx xx"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                >
                  Talep Gönder <ArrowRight className="w-5 h-5" />
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
