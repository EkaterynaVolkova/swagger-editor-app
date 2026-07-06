import { render, screen } from '@/__test__/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { SwaggerEditor } from './swagger-editor';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      aria-label="swagger editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('@codemirror/lang-json', () => ({
  json: () => 'json-extension',
}));

vi.mock('@codemirror/lang-yaml', () => ({
  yaml: () => 'yaml-extension',
}));

describe('SwaggerEditor', () => {
  it('renders editor text and reports validation errors', async () => {
    const onChange = vi.fn();
    const onFormatChange = vi.fn();

    const { user } = render(
      <SwaggerEditor
        value="openapi: 3.0.0"
        format="yaml"
        onFormatChange={onFormatChange}
        onChange={onChange}
        errors={[{ message: 'Invalid', line: 1 }]}
      />
    );

    expect(screen.getByLabelText('swagger editor')).toHaveValue('openapi: 3.0.0');
    expect(screen.getByText(/Errors\s*\(\s*1\s*\)/)).toBeInTheDocument();

    await user.clear(screen.getByLabelText('swagger editor'));
    await user.type(screen.getByLabelText('swagger editor'), 'info');

    expect(onChange).toHaveBeenCalled();
  });
});
