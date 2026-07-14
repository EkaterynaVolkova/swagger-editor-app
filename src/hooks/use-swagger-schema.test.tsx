import { act, renderHook, waitFor } from '@/__test__/test-utils';
import { describe, expect, it } from 'vitest';
import type { DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useSwaggerSchema } from './use-swagger-schema';
import { User } from 'firebase/auth';

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

  it('stores a conversion error for invalid JSON', async () => {
    const { result } = renderHook(() => useSwaggerSchema(null));

    act(() => result.current.updateSchema('{'));

    await waitFor(
      () => {
        expect(result.current.errors.length).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );

    act(() => result.current.toggleFormat());

    expect(result.current.schema).toBe('{');
    expect(result.current.isValid).toBe(false);
  });

  it('saves schema to firebase successfully', async () => {
    const mockSetDoc = vi.fn().mockResolvedValue(undefined);
    vi.mocked(setDoc).mockImplementation(mockSetDoc);
    vi.mocked(doc).mockReturnValue({} as DocumentReference);

    const { result } = renderHook(() => useSwaggerSchema({ uid: 'user-123' } as User));

    act(() =>
      result.current.updateSchema('openapi: "3.0.0"\ninfo:\n  title: Test\n  version: "1.0.0"')
    );

    const saved = await result.current.saveSchemaToFirebase();

    expect(saved).toBe(true);
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('restores schema from firebase on login', async () => {
    const savedSchema = 'openapi: "3.0.0"\ninfo:\n  title: Test\n  version: "1.0.0"';

    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => ({ schema: savedSchema }),
    } as unknown as DocumentSnapshot);

    vi.mocked(doc).mockReturnValue({} as DocumentReference);

    const { result } = renderHook(() => useSwaggerSchema({ uid: 'user-123' } as User));

    await waitFor(() => {
      expect(result.current.schema).toBe(savedSchema);
      expect(result.current.format).toBe('yaml');
    });
  });
});
