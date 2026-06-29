import '@testing-library/jest-dom';

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { ComponentPropsWithoutRef } from 'react';
import { Link } from '@/i18n/navigation';

vi.mock('@/i18n/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/i18n/navigation')>();

  const MockedLink = ({ href, children, ...props }: ComponentPropsWithoutRef<typeof Link>) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  );

  return {
    ...actual,
    Link: MockedLink,
  };
});
