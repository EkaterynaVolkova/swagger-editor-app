import { getUser } from '@/lib/auth/get-user';
import { recordRequestAnalytics } from '@/lib/request-history';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createProxyHandler } from './route';

vi.mock('@/lib/auth/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/request-history', () => ({ recordRequestAnalytics: vi.fn() }));

describe('API proxy analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('records server-side analytics for authenticated requests', async () => {
    vi.mocked(getUser).mockResolvedValue({ uid: 'user-1' } as never);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{"ok":true}', { status: 201, statusText: 'Created' })
    );

    const request = new NextRequest(
      'http://localhost/api/proxy?scalar_url=https%3A%2F%2Fapi.example.com%2Fitems',
      { method: 'POST', body: '{"name":"test"}' }
    );
    const response = await createProxyHandler(request);

    expect(response.status).toBe(201);
    expect(recordRequestAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({ uid: 'user-1' }),
      expect.objectContaining({
        method: 'POST',
        endpoint: 'https://api.example.com/items',
        statusCode: 201,
        requestSize: 15,
        responseSize: 11,
        errorDetails: null,
        duration: expect.any(Number),
      })
    );
  });

  it('does not persist history for guests', async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await createProxyHandler(
      new NextRequest(
        'http://localhost/api/proxy?scalar_url=https%3A%2F%2Fapi.example.com%2Fhealth'
      )
    );

    expect(recordRequestAnalytics).not.toHaveBeenCalled();
  });

  it('records error details when the upstream request fails', async () => {
    vi.mocked(getUser).mockResolvedValue({ uid: 'user-1' } as never);
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Connection refused'));

    const response = await createProxyHandler(
      new NextRequest(
        'http://localhost/api/proxy?scalar_url=https%3A%2F%2Fapi.example.com%2Foffline'
      )
    );

    expect(response.status).toBe(500);
    expect(recordRequestAnalytics).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ statusCode: 500, errorDetails: 'Connection refused' })
    );
  });
});
