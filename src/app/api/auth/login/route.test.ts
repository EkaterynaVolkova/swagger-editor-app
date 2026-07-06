import { adminAuth } from '@/lib/firebase/admin';
import { cookies } from 'next/headers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from './route';

const setCookie = vi.fn();
const { createSessionCookie } = vi.hoisted(() => ({
  createSessionCookie: vi.fn(),
}));

vi.mock('@/lib/firebase/admin', () => ({
  adminAuth: {
    createSessionCookie,
  },
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('login route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockResolvedValue({
      set: setCookie,
    } as unknown as Awaited<ReturnType<typeof cookies>>);
  });

  it('returns 400 when token is missing', async () => {
    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({}),
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Missing token' });
  });

  it('creates a session cookie for a valid token', async () => {
    vi.mocked(adminAuth.createSessionCookie).mockResolvedValue('session-cookie');

    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ idToken: 'id-token' }),
      })
    );

    expect(response.status).toBe(200);
    expect(createSessionCookie).toHaveBeenCalledWith('id-token', {
      expiresIn: 60 * 60 * 24 * 5 * 1000,
    });
    expect(setCookie).toHaveBeenCalledWith(
      '__session',
      'session-cookie',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
      })
    );
  });

  it('returns 500 when session creation fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(adminAuth.createSessionCookie).mockRejectedValue(new Error('Firebase failed'));

    const response = await POST(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ idToken: 'id-token' }),
      })
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'Internal Server Error' });
  });
});
