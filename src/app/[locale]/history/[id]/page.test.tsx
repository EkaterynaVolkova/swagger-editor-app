import { render, screen } from '@/__test__/test-utils';
import { getUser } from '@/lib/auth/get-user';
import { getRequestAnalytics } from '@/lib/request-history';
import { notFound, redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RequestAnalyticsPage from './page';

vi.mock('@/lib/auth/get-user', () => ({ getUser: vi.fn() }));
vi.mock('@/lib/request-history', () => ({ getRequestAnalytics: vi.fn() }));
vi.mock('next/navigation', () => ({ notFound: vi.fn(), redirect: vi.fn() }));
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string, values?: Record<string, number>) => {
    const messages: Record<string, string> = {
      analyticsTitle: 'Request analytics',
      back: 'Back to history',
      statusCode: 'Response status code',
      durationLabel: 'Request duration',
      duration: '{value} ms',
      timestamp: 'Request timestamp',
      method: 'Request method',
      requestSize: 'Request size',
      responseSizeLabel: 'Response size',
      endpoint: 'Endpoint / URL',
      errorDetails: 'Error details',
      bytes: '{value} bytes',
      none: 'None',
    };
    return (messages[key] ?? key).replace('{value}', String(values?.value));
  }),
}));

describe('request analytics page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUser).mockResolvedValue({ uid: 'user-1' } as never);
  });

  it('renders every required analytics field', async () => {
    vi.mocked(getRequestAnalytics).mockResolvedValue({
      id: 'request-1',
      duration: 87,
      statusCode: 404,
      timestamp: '2026-07-09T10:00:00.000Z',
      method: 'DELETE',
      requestSize: 128,
      responseSize: 64,
      errorDetails: '404 Not Found',
      endpoint: 'https://api.example.com/pets/42',
    });

    render(
      await RequestAnalyticsPage({
        params: Promise.resolve({ locale: 'en', id: 'request-1' }),
      })
    );

    expect(screen.getByRole('heading', { name: 'Request analytics' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to history' })).toHaveAttribute(
      'href',
      '/history'
    );
    for (const value of [
      '404',
      '87 ms',
      'DELETE',
      '128 bytes',
      '64 bytes',
      'https://api.example.com/pets/42',
      '404 Not Found',
    ]) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }
    expect(screen.getByText(/2026/)).toBeInTheDocument();
    expect(getRequestAnalytics).toHaveBeenCalledWith('user-1', 'request-1');
  });

  it('renders None when a request has no error details', async () => {
    vi.mocked(getRequestAnalytics).mockResolvedValue({
      id: 'request-1',
      duration: 10,
      statusCode: 200,
      timestamp: '2026-07-09T10:00:00.000Z',
      method: 'GET',
      requestSize: 0,
      responseSize: 2,
      errorDetails: null,
      endpoint: 'https://api.example.com/health',
    });

    render(
      await RequestAnalyticsPage({
        params: Promise.resolve({ locale: 'en', id: 'request-1' }),
      })
    );

    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('returns not found for a request that does not belong to the user', async () => {
    vi.mocked(getRequestAnalytics).mockResolvedValue(null);
    vi.mocked(notFound).mockImplementationOnce(() => {
      throw new Error('NEXT_NOT_FOUND');
    });

    await expect(
      RequestAnalyticsPage({
        params: Promise.resolve({ locale: 'en', id: 'missing' }),
      })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFound).toHaveBeenCalledOnce();
  });

  it('redirects guests before loading analytics', async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    vi.mocked(redirect).mockImplementationOnce(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(
      RequestAnalyticsPage({
        params: Promise.resolve({ locale: 'en', id: 'request-1' }),
      })
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/');
    expect(getRequestAnalytics).not.toHaveBeenCalled();
  });
});
