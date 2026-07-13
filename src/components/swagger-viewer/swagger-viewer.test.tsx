import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SwaggerViewer } from './swagger-viewer';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => (key === 'idle' ? 'No schema loaded' : key),
}));

vi.mock('@scalar/api-reference-react', () => ({
  ApiReferenceReact: () => <div data-testid="scalar-mock">Scalar Rendered Successfully</div>,
}));

describe('SwaggerViewer', () => {
  it('renders idle state message when schema is empty', () => {
    render(<SwaggerViewer schema="" errors={[]} />);

    expect(screen.getByText('No schema loaded')).toBeInTheDocument();
    expect(screen.queryByTestId('scalar-mock')).not.toBeInTheDocument();
  });

  it('renders idle state message when there are validation errors', () => {
    const mockErrors = [{ message: 'Invalid YAML', line: 1 }];
    render(<SwaggerViewer schema="openapi: 3.0.0" errors={mockErrors} />);

    expect(screen.getByText('No schema loaded')).toBeInTheDocument();
    expect(screen.queryByTestId('scalar-mock')).not.toBeInTheDocument();
  });

  it('renders Scalar wrapper when a valid schema is provided', () => {
    render(<SwaggerViewer schema="openapi: 3.0.0" errors={[]} />);

    expect(screen.getByTestId('scalar-mock')).toBeInTheDocument();
    expect(screen.queryByText('No schema loaded')).not.toBeInTheDocument();
  });
});
