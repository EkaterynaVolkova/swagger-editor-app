import { cookies } from 'next/headers';
import { describe, expect, it, vi } from 'vitest';

import { POST } from './route';

const deleteCookie = vi.fn();

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('logout route', () => {
  it('deletes the session cookie', async () => {
    vi.mocked(cookies).mockResolvedValue({
      delete: deleteCookie,
    } as unknown as Awaited<ReturnType<typeof cookies>>);

    const response = await POST();

    expect(deleteCookie).toHaveBeenCalledWith('__session');
    await expect(response.json()).resolves.toEqual({ status: 'success' });
  });
});
