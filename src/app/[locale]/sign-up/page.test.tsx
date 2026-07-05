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
      title: 'Get started',
      'sub-title': 'Create a new account',
      account: 'Already have an account?',
      form: 'Sign in',
    };

    return messages[key];
  }),
}));

vi.mock('@/components/forms/sign-up', () => ({
  SignUp: () => <form>Sign up form</form>,
}));

describe('sign-up page', () => {
  it('renders sign-up form layout', async () => {
    render(await Page());

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.getByText('Sign up form')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
  });
});
