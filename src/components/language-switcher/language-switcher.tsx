'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div
      suppressHydrationWarning
      className="border-swagger-border bg-swagger-gray flex items-center gap-1.5 rounded border px-2 py-1 font-sans text-[11px] font-semibold"
    >
      <Link
        href={pathname}
        locale="en"
        className={`no-underline transition-colors ${
          currentLocale === 'en' ? 'text-success font-bold' : 'hover:text-success text-gray-400'
        }`}
      >
        EN
      </Link>
      <span className="text-swagger-dark">|</span>
      <Link
        href={pathname}
        locale="ru"
        className={`no-underline transition-colors ${
          currentLocale === 'ru' ? 'text-success font-bold' : 'hover:text-success text-gray-400'
        }`}
      >
        RU
      </Link>
    </div>
  );
}
