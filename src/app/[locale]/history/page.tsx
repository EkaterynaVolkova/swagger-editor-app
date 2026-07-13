import { ROUTES } from '@/constants/constants';
import { Link } from '@/i18n/navigation';
import { getUser } from '@/lib/auth/get-user';
import { getRequestHistory } from '@/lib/request-history';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('history');
  const user = await getUser();

  if (!user) {
    redirect(ROUTES.HOME);
  }

  const history = await getRequestHistory(user.uid);
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <p className="text-success text-sm font-semibold tracking-widest uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-base-content/70 mt-2">{t('description')}</p>
      </div>

      {history.length === 0 ? (
        <div className="card bg-base-100 border-base-300 border shadow">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{t('emptyTitle')}</h2>
            <p className="text-base-content/70">{t('emptyDescription')}</p>
            <div className="card-actions mt-3">
              <Link href={`${ROUTES.HOME}#editor`} className="btn btn-success">
                {t('editorLink')}
              </Link>
              <Link href={`${ROUTES.HOME}#viewer`} className="btn btn-outline">
                {t('viewerLink')}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((entry) => (
            <Link
              key={entry.id}
              href={`${ROUTES.HISTORY}/${entry.id}`}
              className="card bg-base-100 border-base-300 hover:border-success border shadow transition-colors"
            >
              <article className="card-body gap-3 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="badge badge-success badge-outline font-mono">
                      {entry.method}
                    </span>
                    <h2 className="max-w-[180px] truncate font-mono text-sm font-semibold sm:max-w-none">
                      {entry.endpoint}
                    </h2>
                  </div>
                  <span
                    className={
                      entry.statusCode >= 400 ? 'badge badge-error' : 'badge badge-success'
                    }
                  >
                    {entry.statusCode}
                  </span>
                </div>
                <div className="text-base-content/65 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span>{dateFormatter.format(new Date(entry.timestamp))}</span>
                  <span>{t('duration', { value: entry.duration })}</span>
                  <span>{t('responseSize', { value: entry.responseSize })}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
