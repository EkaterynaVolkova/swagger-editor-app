import { render, screen } from '@/__test__/test-utils';
import { getUser } from '@/lib/auth/get-user';
import messages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';

import { Header } from './header';

vi.mock('@/lib/auth/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: keyof typeof messages.header) => {
    return messages.header[key];
  }),
}));

vi.mock('../language-switcher', () => ({
  LanguageSwitcher: () => <div>Language switcher</div>,
}));

vi.mock('../logout-button', () => ({
  LogoutButton: () => <button>Sign Out</button>,
}));

describe('Header', () => {
  it('renders public navigation for guests', async () => {
    vi.mocked(getUser).mockResolvedValue(null);

    render(await Header());

    expect(screen.getByRole('link', { name: 'Swagger Editor' })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'About Us' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Sign In' })).toHaveLength(2);
    expect(screen.queryByText('History')).not.toBeInTheDocument();
  });

  it('renders history and logout controls for authenticated users', async () => {
    vi.mocked(getUser).mockResolvedValue({ email: 'user@example.com' });

    render(await Header());

    expect(screen.getAllByRole('link', { name: 'History' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Sign Out' })).toHaveLength(2);
    expect(screen.getAllByText('user@example.com')).toHaveLength(2);
  });
});
