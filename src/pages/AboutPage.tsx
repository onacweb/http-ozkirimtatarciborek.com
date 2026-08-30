import { useEffect } from 'react';
import { Award, Clock, Users, Target, Heart, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { logActivity } from '@/lib/activity';
import { Reveal } from '@/components/Reveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { MagneticButton } from '@/components/MagneticButton';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const team = [
  { name: 'Onur Onaç', role: 'Kurucu & Kreatif Direktör', avatar: 'https://images.pexels.com/photos/17049771/pexels-photo-17049771.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { name: 'Elif Yıldız', role: 'Grafik Tasarım Lideri', avatar: 'https://images.pexels.com/photos/38197025/pexels-photo-38197025.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
  { name: 'Mert Aydın', role: '3D & Motion Artist', avatar: 'https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
];

const timeline = [
  { year: '2015', title: 'ONAÇ WEB Doğdu', desc: 'Küçük bir stüdyoda büyük hayallerle yola çıktık.' },
  { year: '2017', title: '100. Müşteri', desc: 'İlk yüz müşterimize ulaştık, portföyümüz büyümeye başladı.' },
  { year: '2019', title: 'Dijital Dönüşüm', desc: 'Web tasarımı ve 3D görselleştirme hizmetlerini ekledik.' },
  { year: '2021', title: '500+ Proje', desc: '500\'ü aşkın tamamlanan proje ile büyümeye devam ettik.' },
  { year: '2023', title: 'Ödüller & Başarılar', desc: 'Tasarım yarışmalarında çok sayıda ödüle layık görüldük.' },
  { year: '2025', title: 'Bugün', desc: '1200+ tamamlanan proje, 500+ mutlu müşteri ve devam ediyoruz.' },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) logActivity('page_view', 'about');
  }, [user]);

  const values = [
    { icon: Award, title: 'Kalite', desc: 'Her projede en yüksek kalite standartlarını benimsiyoruz' },
    { icon: Clock, title: 'Zamanında Teslim', desc: 'Taahhüt ettiğimiz tarihte eksiksiz teslim' },
    { icon: Heart, title: 'Müşteri Memnuniyeti', desc: 'Uzun vadeli iş birlikleri önceliğimizdir' },
    { icon: Target, title: 'Yaratıcılık', desc: 'Hayal gücünü tasarımla buluşturuyoruz' },
    { icon: Shield, title: 'Güven', desc: 'Verileriniz ve projeleriniz güvende' },
    { icon: Users, title: 'Deneyim', desc: '10+ yıl, 1200+ tamamlanan proje' },
  ];

  const stats = [
    { value: 10, suffix: '+', label: 'Yıllık Tecrübe' },
    { value: 500, suffix: '+', label: 'Mutlu Müşteri' },
    { value: 1200, suffix: '+', label: 'Tamamlanan Proje' },
    { value: 49, suffix: '', label: 'Müşteri Puanı', display: '4.9' },
  ];

  return (
    <div className="pt-20 bg-[#0a0a0b] min-h-screen">
      {/* HERO */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-white/70">Hakkımızda</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6 text-balance">Hikayemiz</h1>
            <p className="text-lg text-white/50 leading-relaxed">
              Hayal gücünü tasarımla buluşturduğumuz bu yolda, 10 yılı aşkın süredir
              yaratıcı çözümler sunuyoruz. Logo, afiş, sosyal medya görselleri ve daha
              fazlasında; markanızı sadece tasarlamakla kalmıyor, konuşturuyoruz.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-gradient">
                    {stat.display ? stat.display : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                  </div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-6 text-balance">
                  Taahhütlerimiz ve Teslimat Garantimiz
                </h2>
                <p className="text-white/50 leading-relaxed mb-6">
                  Anlaşma sağlanan tüm projeleri, belirlenen zaman ve teslim tarihleri
                  doğrultusunda eksiksiz ve özenli bir şekilde tamamlıyoruz. Müşteri
                  memnuniyetini en üst seviyede tutmak önceliğimizdir.
                </p>
                <p className="text-white/50 leading-relaxed">
                  Kurumsal ve grafik tasarım çözümleri, dijital ve yayın tasarımı
                  uzmanlığı, marka kimliği ve reklam tasarımları alanlarında
                  profesyonel hizmet sunuyoruz.
                </p>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="p-8 rounded-2xl glass text-center hover-lift">
                    <div className="text-4xl font-extrabold text-orange-400 mb-2">
                      {stat.display ? stat.display : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                    </div>
                    <div className="text-sm text-white/40">{stat.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Değerlerimiz</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Bizi Biz Yapan İlkeler</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <div className="group p-8 rounded-2xl glass hover-lift hover:border-orange-500/30 transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                      <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                    <p className="text-white/40 text-sm">{value.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Yolculuğumuz</h2>
              <p className="text-lg text-white/50">Başlangıçtan bugüne uzanan hikayemiz.</p>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/20 via-orange-500/40 to-orange-500/20 md:-translate-x-1/2" />
            {timeline.map((item, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className={`relative flex items-center mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-4 border-[#0a0a0b] shadow-lg md:-translate-x-1/2 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 ml-12 md:ml-0 md:px-8">
                    <div className="p-6 rounded-2xl glass hover-lift">
                      <div className="text-sm font-bold text-orange-400 mb-1">{item.year}</div>
                      <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 bg-[#080809] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                <span className="text-sm font-medium text-orange-400">Ekip</span>
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Tasarımın Arkasındaki Yaratıcı Ekip</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <Reveal key={i} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <div className="group relative rounded-2xl overflow-hidden img-zoom">
                  <img src={member.avatar} alt={member.name} className="w-full h-80 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-white/50">{member.role}</p>
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
            <h2 className="text-4xl font-extrabold text-white mb-4 text-balance">Bizimle Çalışmaya Hazır mısınız?</h2>
            <p className="text-lg text-white/80 mb-8">Hesap oluşturun, ihtiyaçlarınızı paylaşın, markanızı konuşturalım.</p>
            <MagneticButton onClick={() => onNavigate(user ? 'panel' : 'register')} className="group px-8 py-4 text-base font-semibold text-orange-500 bg-white rounded-xl shadow-lg flex items-center gap-2">
              {user ? 'Panelime Git' : 'Hemen Kayıt Ol'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
