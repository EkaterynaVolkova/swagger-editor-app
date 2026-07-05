import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setSessionCookie } from './set-session-cookie';

describe('setSessionCookie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts the id token to the login API route', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    await setSessionCookie('id-token');

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: 'id-token' }),
    });
  });

  it('throws when the login API route rejects the token', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(setSessionCookie('bad-token')).rejects.toThrow('Failed to set session cookie');
  });
});
