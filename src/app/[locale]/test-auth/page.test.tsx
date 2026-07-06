import { render, screen, waitFor } from '@/__test__/test-utils';
import { setSessionCookie } from '@/lib/auth/set-session-cookie';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import TestAuthPage from './page';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('@/lib/firebase/client', () => ({
  auth: {},
}));

vi.mock('@/lib/auth/set-session-cookie', () => ({
  setSessionCookie: vi.fn(),
}));

describe('TestAuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('alert', vi.fn());
  });

  it('sets a session cookie after Firebase test login', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue({
      user: {
        getIdToken: vi.fn().mockResolvedValue('id-token'),
      },
    } as Awaited<ReturnType<typeof signInWithEmailAndPassword>>);
    vi.mocked(setSessionCookie).mockResolvedValue(undefined);

    const { user } = render(<TestAuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log In with Test Account' }));

    await waitFor(() => {
      expect(setSessionCookie).toHaveBeenCalledWith('id-token');
      expect(alert).toHaveBeenCalledWith(
        'Success! The authentication cookie has been set. Now try navigating to /history'
      );
    });
  });

  it('shows an error when test login fails', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(new Error('No user'));

    const { user } = render(<TestAuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log In with Test Account' }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('Login failed: No user');
    });
  });

  it('shows a fallback error when test login fails without an Error instance', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue('No user');

    const { user } = render(<TestAuthPage />);
    await user.click(screen.getByRole('button', { name: 'Log In with Test Account' }));

    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith('An unknown error occurred during login.');
    });
  });
});
