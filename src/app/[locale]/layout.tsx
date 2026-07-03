import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import '@/app/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for all locales (for static generation)
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for this locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-base-200 text-base-content flex h-screen w-screen flex-col overflow-hidden font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="align flex flex-1 flex-col items-center">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
