import { render, screen } from '@/__test__/test-utils';
import messages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: keyof typeof messages.FormsLayout.SignUp) => {
    return messages.FormsLayout.SignUp[key];
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
