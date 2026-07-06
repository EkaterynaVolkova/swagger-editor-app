import { render, screen } from '@/__test__/test-utils';
import messages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';

import { Footer } from './footer';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: keyof typeof messages.footer) => {
    return messages.footer[key];
  }),
}));

describe('Footer', () => {
  it('renders copyright and an about link', async () => {
    render(await Footer());

    expect(screen.getByText(/Swagger Editor App/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
  });
});
