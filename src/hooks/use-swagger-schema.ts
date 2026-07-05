'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import * as yaml from 'js-yaml';
import SwaggerParser from '@apidevtools/swagger-parser';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { User } from 'firebase/auth';

export interface ValidationError {
  line?: number;
  message: string;
}

const getFormat = (text: string): 'json' | 'yaml' => {
  const trimmed = text.trim();
  return trimmed.startsWith('{') || trimmed.startsWith('[') ? 'json' : 'yaml';
};

const parseText = (text: string, format: 'json' | 'yaml'): unknown => {
  return format === 'json' ? JSON.parse(text) : yaml.load(text);
};

const getSyntaxError = (err: unknown): ValidationError => {
  const full = err instanceof Error ? err.message : String(err);
  const message = full.split('\n')[0];
  const mark = (err as { mark?: { line?: number } }).mark;
  return { message, line: mark?.line != null ? mark.line + 1 : undefined };
};

const validateAsync = async (
  text: string,
  format: 'json' | 'yaml',
  isStale: () => boolean,
  setErrors: (errors: ValidationError[]) => void
) => {
  if (!text.trim()) {
    if (!isStale()) setErrors([]);
    return;
  }

  let parsed: unknown;
  try {
    parsed = parseText(text, format);
  } catch (err) {
    if (!isStale()) setErrors([getSyntaxError(err)]);
    return;
  }

  try {
    await SwaggerParser.validate(parsed as Parameters<typeof SwaggerParser.validate>[0]);
    if (!isStale()) setErrors([]);
  } catch (err) {
    if (isStale()) return;
    const message = err instanceof Error ? err.message.split('\n')[0] : String(err);
    setErrors([{ message }]);
  }
};

export function useSwaggerSchema(user: User | null) {
  const [schema, setSchema] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const validationKey = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadSchema = async () => {
      setIsLoadingSchema(true);
      try {
        const ref = doc(db, 'schemas', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const saved = snap.data().schema as string;
          setSchema((current) => {
            if (current.trim()) return current;
            const fmt = getFormat(saved);
            setFormat(fmt);
            const key = ++validationKey.current;
            const isStale = () => validationKey.current !== key;
            validateAsync(saved, fmt, isStale, setErrors);
            return saved;
          });
        }
      } catch {
        // TODO: подключить toast или pop-up когда будет готов
        setErrors([{ message: 'Failed to load saved schema' }]);
      } finally {
        setIsLoadingSchema(false);
      }
    };

    loadSchema();
  }, [user]);

  const validate = useCallback((text: string, fmt: 'json' | 'yaml', key: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const isStale = () => validationKey.current !== key;
      validateAsync(text, fmt, isStale, setErrors);
    }, 350);
  }, []);

  const updateSchema = useCallback(
    (value: string) => {
      const fmt = getFormat(value);
      setSchema(value);
      setFormat(fmt);
      const key = ++validationKey.current;
      validate(value, fmt, key);
    },
    [validate]
  );

  const toggleFormat = useCallback(
    (target?: 'json' | 'yaml') => {
      const nextFormat = target ?? (format === 'yaml' ? 'json' : 'yaml');
      if (nextFormat === format || !schema.trim() || errors.length > 0) return;

      try {
        const converted =
          nextFormat === 'json'
            ? JSON.stringify(yaml.load(schema), null, 2)
            : yaml.dump(JSON.parse(schema), { indent: 2 });

        setSchema(converted);
        setFormat(nextFormat);

        const key = ++validationKey.current;
        const isStale = () => validationKey.current !== key;
        validateAsync(converted, nextFormat, isStale, setErrors);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // TODO: подключить toast или pop-up когда будет готов
        setErrors([{ message: `Conversion failed: ${message}` }]);
      }
    },
    [schema, format, errors]
  );

  const saveSchemaToFirebase = useCallback(async (): Promise<boolean> => {
    if (!user || errors.length > 0 || !schema.trim()) return false;
    setIsSaving(true);
    try {
      const ref = doc(db, 'schemas', user.uid);
      await setDoc(ref, { schema, updatedAt: new Date(), userId: user.uid });
      return true;
    } catch {
      // TODO: подключить toast или pop-up когда будет готов
      setErrors([{ message: 'Failed to save schema' }]);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, schema, errors]);

  return {
    schema,
    updateSchema,
    errors,
    isValid: errors.length === 0 && !!schema.trim(),
    format,
    toggleFormat,
    saveSchemaToFirebase,
    isSaving,
    isLoadingSchema,
  };
}
