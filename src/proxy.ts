import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from './constants/constants';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  const pathLocale = pathname.split('/')[1];
  const locale = routing.locales.includes(pathLocale as (typeof routing.locales)[number])
    ? pathLocale
    : routing.defaultLocale;
  const locales = routing.locales.join('|');
  const cleanPath = pathname.replace(new RegExp(`^\\/(${locales})`), '') || '/';

  const isProtected = PROTECTED_ROUTES.some((r) => cleanPath.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => cleanPath.startsWith(r));

  if (isProtected && !session) {
    const redirectUrl = new URL(`/${locale}${ROUTES.HOME}`, request.url);

    return new NextResponse(
      `<!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="refresh" content="0;url=${redirectUrl.toString()}" />
          </head>
          <body>
            <script>window.location.replace(${JSON.stringify(redirectUrl.toString())});</script>
          </body>
        </html>`,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          'Content-Type': 'text/html',
          Location: redirectUrl.toString(),
        },
      }
    );
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(`/${locale}${ROUTES.HOME}`, request.url));
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/', '/(ru|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
