import { type ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
}

export function PageTransition({ pageKey, children }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [pageKey]);

  return (
    <div
      key={pageKey}
      className={visible ? 'page-enter' : 'opacity-0'}
    >
      {children}
    </div>
  );
}
