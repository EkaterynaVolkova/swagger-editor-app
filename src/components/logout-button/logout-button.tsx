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
    <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm bg-transparent">
      {t('signOut')}
    </button>
  );
}
