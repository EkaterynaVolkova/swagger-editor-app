import { act, renderHook } from '@/__test__/test-utils';
import { describe, expect, it } from 'vitest';

import { useSwaggerSchema } from './use-swagger-schema';

vi.mock('@/lib/firebase/client', () => ({
  auth: {},
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  setDoc: vi.fn(),
}));

describe('useSwaggerSchema', () => {
  it('updates schema text and detects JSON or YAML format', () => {
    const { result } = renderHook(() => useSwaggerSchema(null));

    act(() => result.current.updateSchema('{"openapi":"3.0.0"}'));
    expect(result.current.schema).toBe('{"openapi":"3.0.0"}');
    expect(result.current.format).toBe('json');
    expect(result.current.isValid).toBe(true);

    act(() => result.current.updateSchema('openapi: 3.0.0'));
    expect(result.current.format).toBe('yaml');
  });

  it('converts between YAML and JSON formats', () => {
    const { result } = renderHook(() => useSwaggerSchema(null));

    act(() =>
      result.current.updateSchema('openapi: "3.0.0"\ninfo:\n  title: Test\n  version: "1.0.0"')
    );
    expect(result.current.format).toBe('yaml');

    act(() => result.current.toggleFormat());
    expect(result.current.format).toBe('json');
    expect(result.current.schema).toContain('"openapi"');

    act(() => result.current.toggleFormat());
    expect(result.current.format).toBe('yaml');
    expect(result.current.schema).toContain('openapi:');
  });

  it('keeps empty schema unchanged when toggling format', () => {
    const { result } = renderHook(() => useSwaggerSchema(null));

    act(() => result.current.toggleFormat());

    expect(result.current.schema).toBe('');
    expect(result.current.format).toBe('yaml');
  });

  it('stores a conversion error for invalid JSON', () => {
    const { result } = renderHook(() => useSwaggerSchema(null));

    act(() => result.current.updateSchema('{'));
    act(() => result.current.toggleFormat());

    expect(result.current.errors[0].message).toContain('Conversion failed');
    expect(result.current.isValid).toBe(false);
  });
});
