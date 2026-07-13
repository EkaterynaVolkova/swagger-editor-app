import { render, screen, within } from '@/__test__/test-utils';
import messages from '@/messages/en.json';
import ruMessages from '@/messages/ru.json';
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
  it('shows RS School course and project information', async () => {
    render(await AboutPage());

    expect(screen.getByRole('heading', { name: 'Swagger Editor App' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'RS School course' })).toBeInTheDocument();
    expect(screen.getByText(/OpenAPI schema editing/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Swagger UI preview/i)).toBeInTheDocument();
  });

  it('shows team members with roles and safe GitHub links', async () => {
    render(await AboutPage());

    const teamSection = screen
      .getByRole('heading', { name: 'Development team' })
      .closest('article');
    expect(teamSection).not.toBeNull();

    const team = within(teamSection as HTMLElement);
    expect(team.getByText('Ekaterina Volkova')).toBeInTheDocument();
    expect(team.getByText(messages.about.team.ekaterina.role)).toBeInTheDocument();
    expect(team.getByText('Yuri Skrypal')).toBeInTheDocument();
    expect(team.getByText(messages.about.team.yuri.role)).toBeInTheDocument();

    const githubLinks = team.getAllByRole('link', { name: 'GitHub profile' });
    expect(githubLinks).toHaveLength(3);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/EkaterynaVolkova');
    expect(githubLinks[1]).toHaveAttribute('href', 'https://github.com/Sepulator');
    githubLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });
  });

  it('shows technologies and external resource links', async () => {
    render(await AboutPage());

    expect(screen.getByRole('link', { name: 'RS School React course' })).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
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
    expect(screen.getByRole('link', { name: 'OpenAPI Specification' })).toHaveAttribute(
      'href',
      'https://spec.openapis.org/oas/latest.html'
    );
  });

  it('has translated About page copy for English and Russian locales', () => {
    expect(messages.about.courseTitle).toBe('RS School course');
    expect(ruMessages.about.courseTitle).toBe('Курс RS School');
    expect(ruMessages.about.team.github).toBe('Профиль GitHub');
    expect(ruMessages.about.resources.repository).toBe('Репозиторий проекта');
  });
});
