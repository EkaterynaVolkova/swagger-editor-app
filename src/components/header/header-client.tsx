'use client';

import { useEffect, useState, type ReactNode } from 'react';

export function HeaderClient({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`border-swagger-border sticky top-0 z-50 w-full border-b text-white transition-all duration-300 ${
        scrolled
          ? 'bg-swagger-dark/80 h-12 shadow-lg backdrop-blur-md'
          : 'bg-swagger-dark h-16 shadow-none'
      }`}
    >
      {children}
    </header>
  );
}
