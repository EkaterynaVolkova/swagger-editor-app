import { renderHook, waitFor } from '@/__test__/test-utils';
import { onAuthStateChanged } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from './use-auth';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock('@/lib/firebase/client', () => ({
  auth: {},
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tracks authenticated Firebase users', async () => {
    const user = { email: 'user@example.com' };
    const unsubscribe = vi.fn();

    vi.mocked(onAuthStateChanged).mockImplementation((_auth, callback) => {
      callback(user);
      return unsubscribe;
    });

    const { result, unmount } = renderHook(() => useAuth());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBe(user);
    expect(result.current.isAuthenticated).toBe(true);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
