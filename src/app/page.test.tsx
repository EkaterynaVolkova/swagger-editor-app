import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';

import RootPage from './page';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('RootPage', () => {
  it('redirects to the default locale', () => {
    RootPage();

    expect(redirect).toHaveBeenCalledWith('/en');
  });
});
