import { ROUTES } from '@/constants/constants';
import { getUser } from '@/lib/auth/get-user';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const t = await getTranslations('common');
  const user = await getUser();

  if (!user) {
    redirect(ROUTES.HOME);
  }

  return <h1 className="text-primary">{t('title')}</h1>;
}
