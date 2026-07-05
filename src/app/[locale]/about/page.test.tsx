import { render, screen, within } from '@/__test__/test-utils';
import messages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';

import AboutPage from './page';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn((namespace: keyof typeof messages) => {
    const namespaceMessages = messages[namespace];

    return (key: string) =>
      key.split('.').reduce<unknown>((current, segment) => {
        if (current && typeof current === 'object' && segment in current) {
          return current[segment as keyof typeof current];
        }

        return key;
      }, namespaceMessages) as string;
  }),
}));

describe('AboutPage', () => {
  it('shows course, project, team, technologies and resource links', async () => {
    render(await AboutPage());

    expect(screen.getByRole('heading', { name: 'Swagger Editor App' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RS School React course' })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    expect(screen.getByText(/OpenAPI schema editing/i)).toBeInTheDocument();

    const teamSection = screen
      .getByRole('heading', { name: 'Development team' })
      .closest('article');
    expect(teamSection).not.toBeNull();

    const team = within(teamSection as HTMLElement);
    expect(team.getByText('Ekaterina Volkova')).toBeInTheDocument();
    expect(team.getByText('Yuri Skrypal')).toBeInTheDocument();
    expect(team.getAllByRole('link', { name: 'GitHub profile' })).toHaveLength(2);

    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('Firebase')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'RS School' })).toHaveAttribute(
      'href',
      'https://rs.school/'
    );
    expect(screen.getByRole('link', { name: 'Project repository' })).toHaveAttribute(
      'href',
      'https://github.com/EkaterynaVolkova/swagger-editor-app'
    );
  });
});
