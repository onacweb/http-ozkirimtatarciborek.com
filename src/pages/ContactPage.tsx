import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Check, MessageCircle, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { supabase } from '@/lib/supabase';
import { sanitizeInput } from '@/lib/validation';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Reveal } from '@/components/Reveal';
import { MagneticButton } from '@/components/MagneticButton';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) logActivity('page_view', 'contact');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (currentUser) {
      await supabase.from('activity_logs').insert({
        user_id: currentUser.id,
        action: 'contact_form',
        page: 'contact',
        details: { name: sanitizeInput(name), email: sanitizeInput(email), message: sanitizeInput(message) },
      });
    }

    setSent(true);
    setLoading(false);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="pt-20 bg-[#0a0a0b] min-h-screen">
      {/* HERO */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white/70">İletişim</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-4 text-balance">Bize Ulaşın</h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Sorularınız, projeleriniz veya iş birlikleri için bize ulaşın.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* INFO */}
            <Reveal>
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h2>
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Mail, label: 'E-posta', value: 'info@onacweb.com' },
                    { icon: Phone, label: 'Telefon', value: '+90 850 000 00 00' },
                    { icon: MapPin, label: 'Adres', value: 'İstanbul, Türkiye' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl glass hover-lift">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-sm text-white/40">{item.label}</div>
                          <div className="font-semibold text-white">{item.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 rounded-2xl glass mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-white">WhatsApp ile Ulaşın</h3>
                  </div>
                  <p className="text-sm text-white/50 mb-4">
                    Kayıt olmadan, tek tıkla doğrudan WhatsApp üzerinden bize ulaşın.
                  </p>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-green-500/20 transition-all"
                  >
                    Sohbete Başla
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-6 rounded-2xl glass">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white">Canlı Destek</h3>
                  </div>
                  <p className="text-sm text-white/50 mb-4">
                    Kayıt olun ve panelinizden canlı destek ekibimizle anında iletişime geçin.
                  </p>
                  <button onClick={() => onNavigate(user ? 'panel' : 'register')} className="text-sm font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 group">
                    {user ? 'Panele Git' : 'Kayıt Ol'}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* FORM */}
            <Reveal delay={2}>
              <div className="glass rounded-2xl p-8 h-full">
                {sent ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Mesajınız Alındı!</h3>
                    <p className="text-white/50 text-center">En kısa sürede size geri dönüş yapacağız.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold text-white mb-2">Bize Yazın</h2>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">Ad Soyad</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                        placeholder="Adınız Soyadınız"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">E-posta</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-white/30"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-1.5">Mesajınız</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none text-white placeholder-white/30"
                        placeholder="Mesajınızı buraya yazın..."
                        required
                      />
                    </div>
                    <MagneticButton
                      onClick={() => {}}
                      className="w-full"
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Gönder
                          </>
                        )}
                      </button>
                    </MagneticButton>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
