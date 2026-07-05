import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getUser } from './get-user';

const verifySessionCookie = vi.fn();
const getCookie = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('@/lib/firebase/admin', () => ({
  adminAuth: {
    verifySessionCookie,
  },
}));

describe('getUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      get: getCookie,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  it('returns null without loading Firebase Admin when there is no session cookie', async () => {
    getCookie.mockReturnValue(undefined);

    await expect(getUser()).resolves.toBeNull();

    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it('returns the decoded user from a valid session cookie', async () => {
    const decodedUser = { email: 'user@example.com', uid: 'user-id' };

    getCookie.mockReturnValue({ value: 'session-cookie' });
    verifySessionCookie.mockResolvedValue(decodedUser);

    await expect(getUser()).resolves.toEqual(decodedUser);
    expect(verifySessionCookie).toHaveBeenCalledWith('session-cookie', true);
  });

  it('returns null when session verification fails', async () => {
    getCookie.mockReturnValue({ value: 'expired-session-cookie' });
    verifySessionCookie.mockRejectedValue(new Error('expired'));

    await expect(getUser()).resolves.toBeNull();
  });
});
