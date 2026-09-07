import { useEffect, useState } from 'react';
import {
  Palette, Globe, Share2, Box, Package, FileImage,
  ArrowRight, Check, Star, Sparkles, Plus, Minus,
  Quote, PenTool, Target, Rocket, Zap, Award, Users, Clock,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { Reveal } from '@/components/Reveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { MagneticButton } from '@/components/MagneticButton';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

const portfolioImages = [
  'https://images.pexels.com/photos/26576975/pexels-photo-26576975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8066785/pexels-photo-8066785.png?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7661184/pexels-photo-7661184.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6956303/pexels-photo-6956303.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const heroImage = 'https://images.pexels.com/photos/4348289/pexels-photo-4348289.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const studioImage = 'https://images.pexels.com/photos/6044300/pexels-photo-6044300.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const testimonials = [
  {
    name: 'Elif Yılmaz', role: 'Kurucu, Moda Atölyesi',
    avatar: 'https://images.pexels.com/photos/38197025/pexels-photo-38197025.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    rating: 5, text: 'ONAÇ WEB Studio ile çalışmak harika bir deneyimdi. Logomuz markamızı mükemmel yansıtıyor ve müşterilerimizden sürekli iltifat alıyoruz.',
  },
  {
    name: 'Mehmet Demir', role: 'CEO, Teknoloji A.Ş.',
    avatar: 'https://images.pexels.com/photos/17049771/pexels-photo-17049771.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    rating: 5, text: 'Web sitemizi sıfırdan tasarladılar ve sonuç beklediğimizden çok daha iyi. Modern, hızlı ve kullanıcı dostu. Kesinlikle tavsiye ediyorum.',
  },
  {
    name: 'Ayşe Kaya', role: 'Pazarlama Direktörü, Gıda Ltd.',
    avatar: 'https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
    rating: 5, text: 'Ambalaj tasarımları ürünlerimizi raflarda öne çıkardı. Satışlarımız belirgin şekilde arttı. ONAÇ ekibi markanın ruhunu anlıyor.',
  },
];

const faqs = [
  { q: 'Tasarım süreci nasıl işliyor?', a: 'İlk görüşmede ihtiyaçlarınızı dinler, sonra 3 farklı konsept sunarız. Seçtiğiniz konsept üzerinde sınırsız revizyon yaparız. Onay sonrası tüm dosyaları vektörel formatta teslim ederiz.' },
  { q: 'Bir proje ne kadar sürede tamamlanır?', a: 'Logo tasarımı 3-5 iş günü, web tasarımı 2-4 hafta, 3D tasarım 1-3 hafta arasında değişir. Süre projenin karmaşıklığına göre belirlenir.' },
  { q: 'Revizyon hakkım var mı?', a: 'Evet, tüm paketlerde sınırsız revizyon hakkı bulunur. Tasarım siz tamamen memnun kalana kadar devam eder.' },
  { q: 'Ödeme nasıl yapılıyor?', a: 'Projeler %50 başlangıç, %50 teslim şeklinde ikiye bölünür. Kredi kartı ve havale/EFT kabul edilmektedir.' },
  { q: 'Dosyalarımı hangi formatta alırım?', a: 'AI, EPS, SVG, PNG, JPG ve PDF formatlarında dosyalarınızı alırsınız. Tüm tasarımlar baskıya hazır ve dijital kullanım için uygundur.' },
];

const process = [
  { icon: PenTool, title: 'Keşif', desc: 'İhtiyaçlarınızı dinler, markanızı analiz ederiz.' },
  { icon: Target, title: 'Konsept', desc: '3 farklı tasarım konsepti sunar, en uygun yönü seçeriz.' },
  { icon: Palette, title: 'Tasarım', desc: 'Sınırsız revizyon ile mükemmelliğe ulaşırız.' },
  { icon: Rocket, title: 'Teslim', desc: 'Tüm dosyaları tüm formatlarda eksiksiz teslim ederiz.' },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (user) logActivity('page_view', 'home');
  }, [user]);

  const services = [
    { icon: Palette, title: 'Logo Tasarımı', desc: 'Markanızın ruhunu yansıtan benzersiz logo tasarımları', color: 'from-orange-400 to-red-500' },
    { icon: Globe, title: 'Web Tasarımı', desc: 'Modern, kullanıcı dostu ve mobil uyumlu web siteleri', color: 'from-cyan-400 to-blue-500' },
    { icon: Share2, title: 'Sosyal Medya', desc: 'Sosyal medya görselleri ve içerik tasarımları', color: 'from-pink-400 to-rose-500' },
    { icon: Box, title: '3D Tasarım', desc: 'Ürün ve marka için etkileyici 3D görselleştirmeler', color: 'from-violet-400 to-purple-500' },
    { icon: Package, title: 'Ambalaj Tasarımı', desc: 'Ürünlerinizi öne çıkaran yaratıcı ambalajlar', color: 'from-amber-400 to-orange-500' },
    { icon: FileImage, title: 'Katalog & Afiş', desc: 'Profesyonel katalog, afiş ve broşür tasarımları', color: 'from-emerald-400 to-teal-500' },
  ];

  const stats = [
    { icon: Clock, value: 10, suffix: '+', label: 'Yıllık Tecrübe' },
    { icon: Users, value: 500, suffix: '+', label: 'Mutlu Müşteri' },
    { icon: Award, value: 1200, suffix: '+', label: 'Tamamlanan Proje' },
    { icon: Star, value: 49, suffix: '', label: 'Müşteri Puanı', display: '4.9' },
  ];

  return (
    <div className="bg-[#0a0a0b]">
      {/* === HERO === */}
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-glow" />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-glow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-slide">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white/70">10+ yıllık tasarım deneyimi</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] mb-6 text-balance">
                Logonuzun Hayalini Kurun,
                <br />
                <span className="text-gradient animate-gradient">Gerisini Bize Bırakın</span>
              </h1>
              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-xl">
                Hayal gücünüzle yola çıktık, tasarımla gerçeğe dönüştürdük. Logo, afiş,
                sosyal medya ve tüm görsel ihtiyaçlarınızda yanınızdayız.
              </p>
              <div className="flex flex-wrap gap-4">
                <MagneticButton
                  onClick={() => onNavigate(user ? 'panel' : 'register')}
                  className="group relative px-8 py-4 text-base font-semibold text-white overflow-hidden rounded-xl"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl" />
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    {user ? 'Panele Git' : 'Hemen Başla'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </MagneticButton>
                <MagneticButton
                  onClick={() => onNavigate('services')}
                  className="px-8 py-4 text-base font-semibold text-white/80 glass rounded-xl hover:text-white hover:bg-white/10 transition-all"
                >
                  Hizmetlerimiz
                </MagneticButton>
              </div>

              <div className="flex items-center gap-6 mt-12">
                <div className="flex -space-x-3">
                  {testimonials.map((t, i) => (
                    <img key={i} src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-[#0a0a0b] object-cover" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-sm text-white/40 mt-0.5">500+ mutlu müşteri</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group img-zoom">
                <img src={heroImage} alt="Tasarım" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Yaratıcı Tasarım Stüdyosu</p>
                      <p className="text-xs text-white/50">İstanbul, Türkiye</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl shadow-orange-500/30 animate-float">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl glass flex items-center justify-center animate-float-slow">
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/30 animate-bounce" />
          </div>
        </div>
      </section>

      {/* === MARQUEE === */}
      <section className="py-8 bg-[#080809] border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, dup) =>
            ['Moda Atölyesi', 'Teknoloji A.Ş.', 'Gıda Ltd.', 'Yapı Grup', 'Medya Pro', 'Avangarde', 'Doğa Co.', 'Nova Wear'].map((brand, i) => (
              <span key={`${dup}-${i}`} className="text-2xl font-extrabold text-white/15 tracking-tight font-display hover:text-white/30 transition-colors">
                {brand}
              </span>
            )),
          )}
        </div>
      </section>

      {/* === STATS === */}
      <section className="py-20 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="text-center group">
                    <div className="inline-flex w-14 h-14 rounded-2xl glass items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="text-4xl lg:text-5xl font-extrabold text-white">
                      {stat.display ? stat.display : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                    </div>
                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* === SERVICES === */}
      <section className="py-24 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Hizmetlerimiz</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">
                Markanıza Güç Katan Tasarımlar
              </h2>
              <p className="text-lg text-white/50 max-w-2xl">
                Logo, katalog, ambalaj ve 3D tasarımlar ile markanızı daha güçlü ve
                profesyonel bir görünüme kavuşturuyoruz.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="group relative p-8 rounded-2xl glass hover-lift hover:border-orange-500/30 transition-all duration-300 h-full">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-white/40 leading-relaxed mb-4">{service.desc}</p>
                    <button onClick={() => onNavigate('services')} className="text-sm font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 group/btn">
                      Detayları Gör
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* === PORTFOLIO === */}
      <section className="py-24 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Portföy</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">
                Son Çalışmalarımız
              </h2>
              <p className="text-lg text-white/50 max-w-2xl">
                Markalar için oluşturduğumuz tasarımlardan bir seçki.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioImages.map((img, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="group relative rounded-2xl overflow-hidden img-zoom">
                  <img src={img} alt={`Portföy ${i + 1}`} className="w-full h-72 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-white font-bold text-lg">Proje {i + 1}</h3>
                    <p className="text-white/60 text-sm">Tasarım & Marka Kimliği</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === PROCESS === */}
      <section className="py-24 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Süreç</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">
                Nasıl Çalışıyoruz?
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                Fikirden teslime, dört adımda markanızı hayata geçiriyoruz.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-orange-500/20 via-orange-500/40 to-orange-500/20" />
            {process.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                  <div className="relative text-center">
                    <div className="relative inline-flex w-24 h-24 rounded-2xl glass items-center justify-center mb-5 hover:border-orange-500/30 transition-all">
                      <Icon className="w-10 h-10 text-orange-400" />
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {i + 1}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* === ABOUT TEASER === */}
      <section className="py-24 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl img-zoom">
                  <img src={studioImage} alt="Stüdyo" className="w-full h-[450px] object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl font-extrabold text-gradient">10+</div>
                  <p className="text-sm text-white/40 mt-1">Yıllık tasarım deneyimi</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                  <span className="text-sm font-medium text-orange-400">Hakkımızda</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-6 text-balance">
                  Hayal Gücünü Tasarımla Buluşturuyoruz
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  10 yılı aşkın süredir yaratıcı çözümler sunuyoruz. Logo, afiş, sosyal
                  medya görselleri ve daha fazlasında; markanızı sadece tasarlamakla
                  kalmıyor, konuşturuyoruz.
                </p>
                <div className="space-y-3 mb-8">
                  {['Taahhütlerimiz ve teslimat garantimiz', 'Kurumsal ve grafik tasarım çözümleri', 'Dijital ve yayın tasarımı uzmanlığı', 'Marka kimliği ve reklam tasarımları'].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-white/70">{item}</p>
                    </div>
                  ))}
                </div>
                <MagneticButton onClick={() => onNavigate('about')} className="group px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2">
                  Daha Fazla Bilgi
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="py-24 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Yorumlar</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">
                Müşterilerimiz Ne Diyor?
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="relative p-8 rounded-2xl glass hover-lift h-full flex flex-col">
                  <Quote className="w-10 h-10 text-orange-500/30 mb-4" />
                  <p className="text-white/60 leading-relaxed mb-6 flex-1">{t.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-sm text-white/40">{t.role}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />)}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* === FAQ === */}
      <section className="py-24 bg-[#080809] border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">SSS</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">
                Sıkça Sorulan Sorular
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
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

      {/* === CTA === */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 animate-gradient" />
        <div className="absolute inset-0 bg-noise" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 text-balance">
              Markanızı Konuşturmaya Hazır Mısınız?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Hemen ücretsiz hesap oluşturun, tasarımlarınızla markanızı büyütün.
            </p>
            <MagneticButton onClick={() => onNavigate(user ? 'panel' : 'register')} className="group px-8 py-4 text-base font-semibold text-orange-500 bg-white rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2">
              {user ? 'Panelime Git' : 'Ücretsiz Kayıt Ol'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
