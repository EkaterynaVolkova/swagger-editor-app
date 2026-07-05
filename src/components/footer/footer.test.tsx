import { render, screen } from '@/__test__/test-utils';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Footer } from './footer';

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => {
    const messages: Record<string, string> = {
      allRightsReserved: 'All rights reserved.',
      aboutLink: 'About Us',
    };

    return messages[key];
  }),
}));

describe('Footer', () => {
  it('renders copyright and an about link', async () => {
    render(await Footer());

    expect(screen.getByText(/Swagger Editor App/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
  });
});
