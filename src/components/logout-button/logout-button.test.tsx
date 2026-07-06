import { render, screen, waitFor } from '@/__test__/test-utils';
import { signOut } from 'firebase/auth';
import { describe, expect, it, vi } from 'vitest';

import { LogoutButton } from './logout-button';

const push = vi.fn();
const refresh = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/firebase/client', () => ({
  auth: {},
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}));

describe('LogoutButton', () => {
  it('clears the session and redirects home', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const { user } = render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith('/');
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
