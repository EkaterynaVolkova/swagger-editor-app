import { render, screen } from '@/__test__/test-utils';
import { describe, expect, it, vi } from 'vitest';

import Page from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(() => (key: string) => (key === 'title' ? 'Swagger Editor App' : key)),
}));

vi.mock('@/components/swagger-page', () => ({
  SwaggerPage: () => <div>Swagger page content</div>,
}));

describe('locale home page', () => {
  it('renders the Swagger editor workspace', async () => {
    render(await Page());

    expect(screen.getByRole('heading', { name: 'Swagger Editor App' })).toBeInTheDocument();
    expect(screen.getByText('Swagger page content')).toBeInTheDocument();
  });
});
