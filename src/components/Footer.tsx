import { Logo } from './Logo';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#080809] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Logo dark />
            <p className="text-sm text-white/40 leading-relaxed mt-5 max-w-xs">
              Logonuzun hayalini kurun, gerisini bize bırakın. 10 yılı aşkın süredir
              markaları tasarımıyla konuşturuyoruz.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-orange-500 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white/60 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Hizmetler
            </h3>
            <ul className="space-y-2.5 text-sm">
              {['Logo Tasarımı', 'Web Tasarımı', 'Sosyal Medya', '3D Tasarım', 'Ambalaj'].map((s) => (
                <li key={s}>
                  <button onClick={() => onNavigate('services')} className="text-white/40 hover:text-orange-400 transition-colors">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              Kurumsal
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Hakkımızda', page: 'about' },
                { label: 'İletişim', page: 'contact' },
                { label: 'Kayıt Ol', page: 'register' },
                { label: 'Giriş Yap', page: 'login' },
              ].map((l) => (
                <li key={l.label}>
                  <button onClick={() => onNavigate(l.page)} className="text-white/40 hover:text-orange-400 transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-white/40">
                <Mail className="w-4 h-4 text-orange-400" />
                info@onacweb.com
              </li>
              <li className="flex items-center gap-3 text-white/40">
                <Phone className="w-4 h-4 text-orange-400" />
                +90 850 000 00 00
              </li>
              <li className="flex items-center gap-3 text-white/40">
                <MapPin className="w-4 h-4 text-orange-400" />
                İstanbul, Türkiye
              </li>
            </ul>
            <button
              onClick={() => onNavigate('contact')}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-orange-400 transition-colors"
            >
              Bize Yazın
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            ©2025 ONAÇ WEB STUDIO. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-white/30 font-display tracking-widest uppercase">
            Tasarım · İnovasyon · Marka
          </p>
        </div>
      </div>
    </footer>
  );
}
