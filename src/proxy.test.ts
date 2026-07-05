import { NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

import { proxy } from './proxy';

vi.mock('next-intl/middleware', () => ({
  default: vi.fn(() => () => NextResponse.next()),
}));

function createRequest(pathname: string, session?: string) {
  return {
    cookies: {
      get: vi.fn(() => (session ? { value: session } : undefined)),
    },
    nextUrl: {
      pathname,
    },
    url: `http://localhost${pathname}`,
  };
}

describe('proxy', () => {
  it('redirects guests away from protected routes', () => {
    const response = proxy(createRequest('/en/history') as never);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/en/sign-in');
  });

  it('redirects authenticated users away from auth routes', () => {
    const response = proxy(createRequest('/en/sign-in', 'session') as never);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/en/');
  });

  it('allows public routes through i18n routing', () => {
    const response = proxy(createRequest('/en/about') as never);

    expect(response.status).toBe(200);
  });

  it('uses the default locale when a request has no locale prefix', () => {
    const response = proxy(createRequest('/history') as never);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/en/sign-in');
  });
});
