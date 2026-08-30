import { useEffect, useState } from 'react';
import {
  Palette, Globe, Share2, Box, Package, FileImage,
  Check, ArrowRight, Plus, Minus, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { Reveal } from '@/components/Reveal';
import { MagneticButton } from '@/components/MagneticButton';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

const pricingPlans = [
  {
    name: 'Başlangıç', price: '₺2.500', period: 'proje',
    desc: 'Küçük işletmeler için ideal başlangıç paketi',
    features: ['1 logo tasarımı (3 konsept)', 'Sınırsız revizyon', 'Vektörel dosya teslimi', '5 sosyal medya görseli', '7 gün teslim süresi'],
    highlighted: false,
  },
  {
    name: 'Profesyonel', price: '₺7.500', period: 'proje',
    desc: 'Marka kimliği ve dijital varlık paketi',
    features: ['Logo + kurumsal kimlik', '5 konsept, sınırsız revizyon', 'Web sitesi tasarımı (5 sayfa)', '15 sosyal medya görseli', '3D ürün görselleştirme', '15 gün teslim süresi'],
    highlighted: true,
  },
  {
    name: 'Kurumsal', price: '₺18.000', period: 'proje',
    desc: 'Tam kapsamlı marka ve dijital dönüşüm',
    features: ['Tam kurumsal kimlik paketi', 'Web sitesi + e-ticaret', 'Ambalaj & katalog tasarımı', '30 sosyal medya görseli', '3D animasyon & render', '30 gün teslim süresi', '6 ay ücretsiz destek'],
    highlighted: false,
  },
];

const serviceFaqs = [
  { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Kredi kartı, banka kartı ve havale/EFT ödemelerini kabul ediyoruz. Kurumsal müşterilerimize özel ödeme planları sunabiliyoruz.' },
  { q: 'Tasarım hakları bana mı ait?', a: 'Evet, teslim edilen tüm tasarımların tüm hakları size aittir. İstediğiniz yerde kullanabilir, değiştirebilir ve çoğaltabilirsiniz.' },
  { q: 'Mevcut logomu güncelleyebilir misiniz?', a: 'Kesinlikle. Mevcut logonuzu analiz edip modernize edebilir veya tamamen yeniden tasarlayabiliriz.' },
  { q: 'Acil projeler için hızlı teslimat var mı?', a: 'Evet, acil teslimat seçeneği sunuyoruz. 48 saat içinde logo tasarımı teslim edebiliriz.' },
];

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (user) logActivity('page_view', 'services');
  }, [user]);

  const services = [
    { icon: Palette, title: 'Logo Tasarımı', desc: 'Markanızın ruhunu yansıtan, akılda kalıcı ve benzersiz logo tasarımları.', features: ['3 farklı konsept', 'Sınırsız revizyon', 'Vektörel dosya teslimi', 'Tüm formatlar'], color: 'from-orange-400 to-red-500' },
    { icon: Globe, title: 'Web Tasarımı', desc: 'Modern, kullanıcı dostu ve mobil uyumlu web siteleri.', features: ['Responsive tasarım', 'SEO uyumlu', 'Hızlı yükleme', 'Modern arayüz'], color: 'from-cyan-400 to-blue-500' },
    { icon: Share2, title: 'Sosyal Medya', desc: 'Sosyal medya hesaplarınız için etkileyici görseller ve içerik tasarımları.', features: ['Post tasarımları', 'Story şablonları', 'Kapak görselleri', 'İçerik takvimi'], color: 'from-pink-400 to-rose-500' },
    { icon: Box, title: '3D Tasarım', desc: 'Ürün ve marka için etkileyici 3D görselleştirmeler.', features: ['Ürün modelleme', 'Realistic render', '360° gösterim', 'Animasyon'], color: 'from-violet-400 to-purple-500' },
    { icon: Package, title: 'Ambalaj Tasarımı', desc: 'Ürünlerinizi raflarda öne çıkaran yaratıcı ambalaj tasarımları.', features: ['Kutu tasarımı', 'Etiket tasarımı', 'Barkod & QR', 'Baskıya hazır'], color: 'from-amber-400 to-orange-500' },
    { icon: FileImage, title: 'Katalog & Afiş', desc: 'Profesyonel katalog, afiş, broşür ve tanıtım materyalleri.', features: ['Katalog tasarımı', 'Afiş & poster', 'Broşür', 'Tanıtım dosyası'], color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="pt-20 bg-[#0a0a0b] min-h-screen">
      {/* HERO */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white/70">Tasarım Hizmetleri</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-4 text-balance">Hizmetlerimiz</h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Markanızın ihtiyaç duyduğu tüm görsel ve tasarım çözümlerini tek çatı altında sunuyoruz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="group p-8 rounded-2xl glass hover-lift hover:border-orange-500/30 transition-all duration-300 h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-white/40 mb-5">{service.desc}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                          <Check className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => onNavigate(user ? 'panel' : 'register')} className="text-sm font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 group/btn">
                      Hemen Başla
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Fiyatlandırma</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">Size Uygun Paket</h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">İhtiyacınıza göre seçin, gerisini bize bırakın.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className={`relative p-8 rounded-2xl transition-all duration-300 h-full ${plan.highlighted ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-2 border-orange-500/50 shadow-2xl shadow-orange-500/10 scale-105' : 'glass hover-lift'}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg">
                      EN POPÜLER
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-white/40 mb-6">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-sm text-white/40"> / {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.highlighted ? 'bg-orange-500' : 'bg-orange-500/10'}`}>
                          <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-orange-400'}`} />
                        </div>
                        <span className="text-white/60">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <MagneticButton
                    onClick={() => onNavigate(user ? 'panel' : 'register')}
                    className={`w-full py-3 text-sm font-semibold rounded-xl transition-all ${plan.highlighted ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' : 'glass text-white hover:bg-white/10'}`}
                  >
                    {user ? 'Panele Git' : 'Bu Paketi Seç'}
                  </MagneticButton>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">SSS</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Sıkça Sorulan Sorular</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {serviceFaqs.map((faq, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="glass rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-white">{faq.q}</span>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${openFaq === i ? 'bg-orange-500 text-white rotate-180' : 'bg-white/5 text-white/40'}`}>
                      {openFaq === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  <div className={`grid transition-all duration-300 ${openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-white/50 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 animate-gradient" />
        <div className="absolute inset-0 bg-noise" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Projenizi Konuşalım mı?</h2>
            <p className="text-lg text-white/80 mb-8">Ücretsiz hesap oluşturun, ihtiyaçlarınızı paylaşın, gerisini bize bırakın.</p>
            <MagneticButton onClick={() => onNavigate(user ? 'panel' : 'register')} className="group px-8 py-4 text-base font-semibold text-orange-500 bg-white rounded-xl shadow-lg flex items-center gap-2">
              {user ? 'Panelime Git' : 'Ücretsiz Başla'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
