import { render, screen } from '@/__test__/test-utils';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

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
      title: 'Welcome back',
      'sub-title': 'Sign in to your account',
      account: 'No account?',
      form: 'Sign up',
    };

    return messages[key];
  }),
}));

vi.mock('@/components/forms/sign-in', () => ({
  SignIn: () => <form>Sign in form</form>,
}));

describe('sign-in page', () => {
  it('renders sign-in form layout', async () => {
    render(await Page());

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByText('Sign in form')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/sign-up');
  });
});
