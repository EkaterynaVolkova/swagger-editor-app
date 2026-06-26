import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('common');
  return <h1 className="text-primary">{t('title')}</h1>;
}
