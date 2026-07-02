'use client';

import { Link, usePathname } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className="border-swagger-border bg-swagger-gray flex items-center gap-1.5 rounded border px-2 py-1 font-sans text-[11px] font-semibold">
      <Link
        href={pathname}
        locale="en"
        className="link link-success link-hover hover:text-success text-gray-400 no-underline transition-colors"
      >
        EN
      </Link>
      <span className="text-swagger-dark">|</span>
      <Link
        href={pathname}
        locale="ru"
        className="link link-success link-hover hover:text-success text-gray-400 no-underline transition-colors"
      >
        RU
      </Link>
    </div>
  );
}
