import { getUser } from '@/lib/auth/get-user';
import { LogoutButton } from '../logout-button';
import { getTranslations } from 'next-intl/server';
import { ROUTES } from '@/constants/constants';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '../language-switcher';
import { MenuIcon } from '../icons';
import { HeaderClient } from './header-client';

export async function Header() {
  const user = await getUser();
  const t = await getTranslations('header');

  return (
    <HeaderClient>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href={ROUTES.HOME}
            className="link link-success link-hover font-sans font-bold no-underline"
          >
            Swagger Editor
          </Link>
        </div>

        <div className="hidden h-full items-center gap-5 md:flex">
          <nav className="text-swagger-light-grey flex items-center gap-4 text-sm font-medium">
            <Link href={ROUTES.ABOUT} className="link link-success link-hover py-2">
              {t('about')}
            </Link>
            {user && (
              <Link href={ROUTES.HISTORY} className="link link-success link-hover py-2">
                {t('history')}
              </Link>
            )}
          </nav>
          <div className="bg-swagger-border h-6 w-[1px]"></div>
          <LanguageSwitcher />
          <div className="bg-swagger-border h-6 w-[1px]"></div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">{user.email}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={ROUTES.SIGN_IN} className="btn btn-primary btn-sm">
                {t('signIn')}
              </Link>
              <Link href={ROUTES.SIGN_UP} className="btn btn-success btn-sm text-swagger-dark">
                {t('signUp')}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user && <LogoutButton />}

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle text-white">
              <MenuIcon />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-swagger-dark border-swagger-border rounded-box z-[60] mt-3 w-52 gap-3 border p-4 shadow"
            >
              <li>
                <Link href={ROUTES.ABOUT}>{t('about')}</Link>
              </li>
              {user && (
                <li>
                  <Link href={ROUTES.HISTORY}>{t('history')}</Link>
                </li>
              )}
              <div className="border-swagger-border my-1 border-t"></div>
              <div className="px-3 py-1">
                <LanguageSwitcher />
              </div>
              {user && (
                <span className="px-3 py-1 font-mono text-[10px] break-all text-gray-400">
                  {user.email}
                </span>
              )}
              {!user && (
                <div className="mt-2 flex flex-col gap-2">
                  <Link href={ROUTES.SIGN_IN} className="btn btn-primary btn-sm w-full">
                    {t('signIn')}
                  </Link>
                  <Link
                    href={ROUTES.SIGN_UP}
                    className="btn btn-success btn-sm text-swagger-dark w-full"
                  >
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </HeaderClient>
  );
}
