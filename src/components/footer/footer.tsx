import { getTranslations } from 'next-intl/server';
import { ROUTES } from '@/constants/constants';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-swagger-dark border-swagger-border mt-auto w-full border-t py-6 text-gray-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs sm:flex-row">
        <div>
          © {currentYear} Swagger Editor App. {t('allRightsReserved')}
        </div>

        <nav className="flex items-center gap-6">
          <Link
            href={ROUTES.ABOUT}
            className="hover:text-swagger-green font-medium transition-colors"
          >
            {t('aboutLink')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
