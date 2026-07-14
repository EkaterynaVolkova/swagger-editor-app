import { render, screen } from '@/__test__/test-utils';
import { getUser } from '@/lib/auth/get-user';
import { getRequestHistory, type RequestHistoryEntry } from '@/lib/request-history';
import { redirect } from 'next/navigation';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('@/lib/auth/get-user', () => ({
  getUser: vi.fn(),
}));

vi.mock('@/lib/request-history', () => ({
  getRequestHistory: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string, values?: Record<string, number>) => {
    const messages: Record<string, string> = {
      eyebrow: 'History & Analytics',
      title: 'Request history',
      description: 'Review your executed API requests.',
      emptyTitle: "You haven't executed any requests yet",
      emptyDescription: 'Run an API request from the viewer.',
      editorLink: 'Go to Editor',
      viewerLink: 'Go to Viewer',
      duration: '{value} ms',
      responseSize: '{value} B response',
    };

    return (messages[key] ?? key).replace('{value}', String(values?.value));
  }),
}));

const user = { uid: 'user-1', email: 'user@example.com' } as never;

function historyEntry(overrides: Partial<RequestHistoryEntry> = {}): RequestHistoryEntry {
  return {
    id: 'request-1',
    duration: 125,
    statusCode: 200,
    timestamp: '2026-07-09T10:00:00.000Z',
    method: 'GET',
    requestSize: 0,
    responseSize: 512,
    errorDetails: null,
    endpoint: 'https://api.example.com/pets',
    ...overrides,
  };
}

describe('history page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects guests home without querying their history', async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    vi.mocked(redirect).mockImplementationOnce(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(Page({ params: Promise.resolve({ locale: 'en' }) })).rejects.toThrow(
      'NEXT_REDIRECT'
    );

    expect(redirect).toHaveBeenCalledWith('/');
    expect(getRequestHistory).not.toHaveBeenCalled();
  });

  it('shows the empty state with links to the editor and viewer', async () => {
    vi.mocked(getUser).mockResolvedValue(user);
    vi.mocked(getRequestHistory).mockResolvedValue([]);

    render(await Page({ params: Promise.resolve({ locale: 'en' }) }));

    expect(screen.getByRole('heading', { name: 'Request history' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: "You haven't executed any requests yet" })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Editor' })).toHaveAttribute('href', '/#editor');
    expect(screen.getByRole('link', { name: 'Go to Viewer' })).toHaveAttribute('href', '/#viewer');
    expect(getRequestHistory).toHaveBeenCalledWith('user-1');
  });

  it('renders request summaries in the server-provided newest-first order', async () => {
    vi.mocked(getUser).mockResolvedValue(user);
    vi.mocked(getRequestHistory).mockResolvedValue([
      historyEntry({
        id: 'newest',
        endpoint: 'https://api.example.com/newest',
        method: 'POST',
        statusCode: 201,
        duration: 42,
        responseSize: 256,
        timestamp: '2026-07-09T12:00:00.000Z',
      }),
      historyEntry({
        id: 'oldest',
        endpoint: 'https://api.example.com/oldest',
        statusCode: 503,
        timestamp: '2026-07-08T12:00:00.000Z',
      }),
    ]);

    render(await Page({ params: Promise.resolve({ locale: 'en' }) }));

    const requestLinks = [
      screen.getByText('https://api.example.com/newest').closest('a'),
      screen.getByText('https://api.example.com/oldest').closest('a'),
    ];
    expect(requestLinks).toHaveLength(2);
    expect(requestLinks[0]).toHaveAttribute('href', '/history/newest');
    expect(requestLinks[1]).toHaveAttribute('href', '/history/oldest');
    expect(
      requestLinks[0]?.compareDocumentPosition(requestLinks[1] as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('201')).toBeInTheDocument();
    expect(screen.getByText('42 ms')).toBeInTheDocument();
    expect(screen.getByText('256 B response')).toBeInTheDocument();
    expect(screen.getByText('503')).toHaveClass('badge-error');
    expect(
      screen.queryByRole('heading', { name: "You haven't executed any requests yet" })
    ).not.toBeInTheDocument();
  });
});
