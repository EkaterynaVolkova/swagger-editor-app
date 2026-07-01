import { getUser } from '@/lib/auth/get-user';
import { LogoutButton } from '../logout-button';
import { getTranslations } from 'next-intl/server';
import { ROUTES } from '@/constants/constants';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '../language-switcher';

export async function Header() {
  const user = await getUser();
  const t = await getTranslations('header');

  return (
    <header className="bg-swagger-dark border-swagger-border fixed top-0 z-50 w-full border-b text-white shadow-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href={ROUTES.HOME}
            className="text-swagger-green flex items-center gap-2 font-sans font-bold transition-opacity hover:text-white hover:opacity-80"
          >
            Swagger Editor App
          </Link>
        </div>

        <div className="flex h-full items-center gap-5">
          <nav className="text-swagger-light-grey flex items-center gap-4 text-sm font-medium">
            <Link href={ROUTES.ABOUT} className="hover:text-swagger-green py-2 transition-colors">
              {t('about')}
            </Link>

            {user && (
              <Link
                href={ROUTES.HISTORY}
                className="hover:text-swagger-green py-2 transition-colors"
              >
                {t('history')}
              </Link>
            )}
          </nav>

          <LanguageSwitcher />

          <div className="bg-swagger-dark h-6 w-[1px]"></div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-xs text-gray-400 md:inline">
                  {user.email}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.SIGN_IN}
                  className="bg-swagger-blue hover:bg-swagger-blue-hover flex h-8 items-center justify-center rounded px-3 text-xs font-semibold text-white transition-colors"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href={ROUTES.SIGN_UP}
                  className="bg-swagger-green hover:bg-swagger-green-hover text-swagger-dark flex h-8 items-center justify-center rounded px-3 text-xs font-semibold transition-colors"
                >
                  {t('signUp')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
