import { render, screen, within } from '@/__test__/test-utils';
import { describe, expect, it } from 'vitest';

import AboutPage from './page';

describe('AboutPage', () => {
  it('shows course, project, team, technologies and resource links', () => {
    render(<AboutPage />);

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
