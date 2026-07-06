import { render, screen } from '@/__test__/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { SwaggerPage } from './swagger-page';

const saveSchemaToFirebase = vi.fn();
const authState = vi.hoisted(() => ({
  value: {
    isAuthenticated: true,
    loading: false,
  },
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: vi.fn(() => authState.value),
}));

vi.mock('@/hooks/use-swagger-schema', () => ({
  useSwaggerSchema: vi.fn(() => ({
    schema: 'openapi: 3.0.0',
    updateSchema: vi.fn(),
    errors: [],
    isValid: true,
    saveSchemaToFirebase,
  })),
}));

vi.mock('../swagger-editor', () => ({
  SwaggerEditor: () => <div>Mocked editor</div>,
}));

describe('SwaggerPage', () => {
  it('renders editor and preview panes with an enabled save button', async () => {
    authState.value = {
      isAuthenticated: true,
      loading: false,
    };

    const { user } = render(<SwaggerPage />);

    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Swagger UI Preview')).toBeInTheDocument();
    expect(screen.getByText('Mocked editor')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'save-schema' }));
    expect(saveSchemaToFirebase).toHaveBeenCalledTimes(1);
  });

  it('disables saving while authentication status is loading', () => {
    authState.value = {
      isAuthenticated: false,
      loading: true,
    };

    render(<SwaggerPage />);

    expect(screen.getByRole('button', { name: 'save-schema' })).toBeDisabled();
    expect(screen.getByText('', { selector: '.loading' })).toBeInTheDocument();
  });
});
