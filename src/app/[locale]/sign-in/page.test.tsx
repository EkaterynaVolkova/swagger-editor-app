import { render, screen } from '@/__test__/test-utils';
import messages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: keyof typeof messages.FormsLayout.SignIn) => {
    return messages.FormsLayout.SignIn[key];
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
