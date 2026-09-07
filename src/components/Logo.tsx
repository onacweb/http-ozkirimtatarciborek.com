import { Palette } from 'lucide-react';

export function Logo2({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Palette className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#0a0a0b]" />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`text-lg font-extrabold tracking-tight font-display ${dark ? 'text-white' : 'text-gray-900'}`}>
          ONAC<span className="text-orange-500">WEB</span>
        </span>
        <span className={`text-[9px] font-medium tracking-[0.2em] uppercase ${dark ? 'text-white/40' : 'text-gray-400'}`}>
          Web Studio
        </span>
      </div>
    </div>
  );
}
