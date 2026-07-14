import '@testing-library/jest-dom';

import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { ComponentPropsWithoutRef } from 'react';

vi.mock('@/i18n/navigation', () => {
  const MockedLink = ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  );

  return {
    Link: MockedLink,
  };
});
