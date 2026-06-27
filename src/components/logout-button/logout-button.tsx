'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { auth } from '@/lib/firebase/client';
import { ROUTES } from '@/constants/constants';

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations('header');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await signOut(auth);
      router.push(ROUTES.HOME);
      router.refresh();
    } catch {}
  };

  return (
    <button
      onClick={handleLogout}
      className="border-swagger-red text-swagger-red hover:bg-swagger-red flex h-8 cursor-pointer items-center justify-center rounded border bg-transparent px-3 text-xs font-semibold transition-colors hover:text-white"
    >
      {t('signOut')}
    </button>
  );
}
