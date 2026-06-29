import React, { type ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { render, type RenderOptions } from '@testing-library/react';

import messages from '@/messages/en.json';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return { user: userEvent.setup(), ...render(ui, { wrapper: AllTheProviders, ...options }) };
};

export * from '@testing-library/react';
export { customRender as render };
