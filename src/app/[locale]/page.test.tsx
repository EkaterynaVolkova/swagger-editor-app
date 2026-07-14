import { render, screen, waitFor } from '@/__test__/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => (key === 'title' ? 'Swagger Editor App' : key)),
}));

vi.mock('@/components/swagger-page', () => ({
  SwaggerPage: () => <h1>Swagger page content</h1>,
}));

describe('locale home page', () => {
  it('renders the Swagger editor workspace', async () => {
    render(await Page());

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Swagger page content' })).toBeInTheDocument();
      expect(screen.getByText('Swagger page content')).toBeInTheDocument();
    });
  });
});
