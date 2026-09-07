import { type ReactNode } from 'react';
import { useReveal } from '@/lib/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
}

export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : '';
  return (
    <div
      ref={ref}
      className={`reveal ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
