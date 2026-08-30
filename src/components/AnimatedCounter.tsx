import { useCountUp } from '@/lib/useCountUp';
import { useReveal } from '@/lib/useReveal';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
}: AnimatedCounterProps) {
  const { ref, visible } = useReveal();
  const count = useCountUp(value, duration, visible);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      {prefix}{count.toLocaleString('tr-TR')}{suffix}
    </span>
  );
}
