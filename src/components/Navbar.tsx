import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '@/lib/auth';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Ana Sayfa', page: 'home' },
    { label: 'Hizmetler', page: 'services' },
    { label: 'Hakkımızda', page: 'about' },
    { label: 'İletişim', page: 'contact' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <button onClick={() => handleNav('home')} className="flex-shrink-0">
            <Logo dark />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => handleNav(link.page)}
                className={`nav-link text-sm font-medium transition-colors ${
                  currentPage === link.page ? 'active text-orange-400' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => handleNav('panel')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Panelim
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/40 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNav('login')}
                  className="px-5 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Giriş Yap
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="group relative px-5 py-2.5 text-sm font-semibold text-white overflow-hidden rounded-lg"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" />
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Kayıt Ol</span>
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 mt-2 glass rounded-2xl">
            <div className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'bg-white/5 text-orange-400'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-white/5 my-2" />
              {user ? (
                <>
                  <button onClick={() => handleNav('panel')} className="text-left px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Panelim
                  </button>
                  {isAdmin && (
                    <button onClick={() => handleNav('admin')} className="text-left px-4 py-3 rounded-lg text-sm font-medium text-orange-400 hover:bg-white/5 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Admin Panel
                    </button>
                  )}
                  <button onClick={() => { signOut(); setOpen(false); }} className="text-left px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleNav('login')} className="text-left px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:bg-white/5">Giriş Yap</button>
                  <button onClick={() => handleNav('register')} className="text-left px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500">Kayıt Ol</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
