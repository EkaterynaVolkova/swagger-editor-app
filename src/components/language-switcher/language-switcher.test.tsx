import { render, screen } from '@/__test__/test-utils';
import type React from 'react';
import { useLocale } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { LanguageSwitcher } from './language-switcher';

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();

  return {
    ...actual,
    useLocale: vi.fn(),
  };
});

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    locale?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => '/about',
}));

describe('LanguageSwitcher', () => {
  it('renders locale links and marks the current locale', () => {
    vi.mocked(useLocale).mockReturnValue('en');

    render(<LanguageSwitcher />);

    expect(screen.getByRole('link', { name: 'EN' })).toHaveClass('text-success');
    expect(screen.getByRole('link', { name: 'RU' })).toHaveAttribute('href', '/about');
  });

  it('marks Russian as active when it is the current locale', () => {
    vi.mocked(useLocale).mockReturnValue('ru');

    render(<LanguageSwitcher />);

    expect(screen.getByRole('link', { name: 'RU' })).toHaveClass('text-success');
    expect(screen.getByRole('link', { name: 'EN' })).toHaveClass('text-gray-400');
  });
});
