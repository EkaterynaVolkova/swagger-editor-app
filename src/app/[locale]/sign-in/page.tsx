import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

import { SignIn } from '@/components/forms/sign-in';

export default async function Page() {
  const t = await getTranslations('FormsLayout.sign_in');

  return (
    <section className="flex w-82.5 flex-1 flex-col justify-center sm:w-82.5">
      <h1 className="mt-8 mb-2 lg:text-3xl">{t('title')}</h1>
      <h2 className="text-foreground-light mb-10 text-sm">{t('subTitle')}</h2>
      <SignIn />
      <div className="my-8 self-center text-sm">
        <span className="text-foreground-light">{t('account')}</span>
        <Link href="/sign-up" className="link">
          {t('form')}
        </Link>
      </div>
    </section>
  );
}
