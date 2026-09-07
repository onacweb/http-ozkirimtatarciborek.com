import { useRef, useState, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, onClick, className = '', strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * strength, y: y * strength });
  };

  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      className={`transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </button>
  );
}
