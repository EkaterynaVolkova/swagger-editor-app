import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { SignUp } from '@/components/forms/sign-up';

export default async function Page() {
  const t = await getTranslations('FormsLayout.SignUp');

  return (
    <section className="flex w-82.5 flex-1 flex-col justify-center sm:w-82.5">
      <h1 className="mt-8 mb-2 lg:text-3xl">{t('title')}</h1>
      <h2 className="text-foreground-light mb-10 text-sm">{t('sub-title')}</h2>
      <SignUp />
      <div className="my-8 self-center text-sm">
        <span className="text-foreground-light">{t('account')}</span>
        <Link href="/sign-in" className="link">
          {t('form')}
        </Link>
      </div>
    </section>
  );
}
