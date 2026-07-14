import { ROUTES } from '@/constants/constants';
import { Link } from '@/i18n/navigation';
import { getUser } from '@/lib/auth/get-user';
import { getRequestAnalytics } from '@/lib/request-history';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';

export default async function RequestAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const user = await getUser();

  if (!user) redirect(ROUTES.HOME);

  const [entry, t] = await Promise.all([
    getRequestAnalytics(user.uid, id),
    getTranslations('history'),
  ]);

  if (!entry) notFound();

  const metrics = [
    [t('statusCode'), String(entry.statusCode)],
    [t('durationLabel'), t('duration', { value: entry.duration })],
    [
      t('timestamp'),
      new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'long' }).format(
        new Date(entry.timestamp)
      ),
    ],
    [t('method'), entry.method],
    [t('requestSize'), t('bytes', { value: entry.requestSize })],
    [t('responseSizeLabel'), t('bytes', { value: entry.responseSize })],
    [t('endpoint'), entry.endpoint],
    [t('errorDetails'), entry.errorDetails ?? t('none')],
  ];

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
      <div>
        <Link href={ROUTES.HISTORY} className="link link-success text-sm">
          {t('back')}
        </Link>
        <h1 className="mt-3 text-3xl font-bold">{t('analyticsTitle')}</h1>
      </div>
      <dl className="card bg-base-100 border-base-300 divide-base-300 divide-y border shadow">
        {metrics.map(([label, value]) => (
          <div key={label} className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr]">
            <dt className="text-base-content/60 font-medium">{label}</dt>
            <dd className="min-w-0 font-mono text-sm break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
