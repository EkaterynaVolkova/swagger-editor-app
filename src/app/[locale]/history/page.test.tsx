import { render, screen } from '@/__test__/test-utils';
import { getUser } from '@/lib/auth/get-user';
import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('@/lib/auth/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => (key === 'title' ? 'Swagger Editor App' : key)),
}));

describe('history page', () => {
  it('redirects guests home', async () => {
    vi.mocked(getUser).mockResolvedValue(null);

    await Page();

    expect(redirect).toHaveBeenCalledWith('/');
  });

  it('renders history content for authenticated users', async () => {
    vi.mocked(getUser).mockResolvedValue({ email: 'user@example.com' });

    render(await Page());

    expect(screen.getByRole('heading', { name: 'Swagger Editor App' })).toBeInTheDocument();
  });
});
