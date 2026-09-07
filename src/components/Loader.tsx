import { useEffect, useState } from 'react';
import { Logo } from './Logo';

export function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0a0b] flex flex-col items-center justify-center animate-loader-out">
      <div className="mb-8 animate-fade-slide">
        <Logo dark />
      </div>
      <div className="w-48 h-px bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-loader-bar" />
      </div>
      <p className="mt-4 text-xs text-white/30 font-display tracking-widest uppercase">
        Yükleniyor
      </p>
    </div>
  );
}
