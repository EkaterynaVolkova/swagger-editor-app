import { SwaggerPage } from '@/components/swagger-page';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('common');

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1920px] flex-1 flex-col p-4 md:p-6">
      <h1 className="sr-only">{t('title')}</h1>
      <div className="card bg-base-100 border-base-300 flex flex-1 flex-col overflow-hidden rounded-xl border shadow-xl">
        <SwaggerPage />
      </div>
    </div>
  );
}
