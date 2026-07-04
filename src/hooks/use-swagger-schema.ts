'use client';

import { useState, useCallback, useRef, useEffect, RefObject } from 'react';
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
  key: number,
  validationKey: RefObject<number>,
  setErrors: (errors: ValidationError[]) => void
) => {
  if (!text.trim()) {
    if (validationKey.current === key) setErrors([]);
    return;
  }

  let parsed: unknown;
  try {
    parsed = parseText(text, format);
  } catch (err) {
    if (validationKey.current === key) setErrors([getSyntaxError(err)]);
    return;
  }

  try {
    await SwaggerParser.validate(parsed as Parameters<typeof SwaggerParser.validate>[0]);
    if (validationKey.current === key) setErrors([]);
  } catch (err) {
    if (validationKey.current !== key) return;
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
            const format = getFormat(saved);
            setFormat(format);
            const key = ++validationKey.current;
            validateAsync(saved, format, key, validationKey, setErrors);
            return saved;
          });
        }
      } catch (err) {
        throw new Error(`Failed to load schema from Firebase: ${err}`);
      } finally {
        setIsLoadingSchema(false);
      }
    };

    loadSchema();
  }, [user]);

  const validate = useCallback((text: string, fmt: 'json' | 'yaml', key: number) => {
    validateAsync(text, fmt, key, validationKey, setErrors);
  }, []);

  const updateSchema = useCallback(
    (value: string) => {
      const format = getFormat(value);
      setSchema(value);
      setFormat(format);
      const key = ++validationKey.current;
      validate(value, format, key);
    },
    [validate]
  );

  const toggleFormat = useCallback(() => {
    if (!schema.trim() || errors.length > 0) return;
    try {
      if (format === 'yaml') {
        const converted = JSON.stringify(yaml.load(schema), null, 2);
        setSchema(converted);
        setFormat('json');
      } else {
        const converted = yaml.dump(JSON.parse(schema), { indent: 2 });
        setSchema(converted);
        setFormat('yaml');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrors([{ message: `Conversion failed: ${message}` }]);
    }
  }, [schema, format, errors]);

  const saveSchemaToFirebase = useCallback(async () => {
    if (!user || errors.length > 0 || !schema.trim()) return;
    setIsSaving(true);
    try {
      const ref = doc(db, 'schemas', user.uid);
      await setDoc(ref, { schema, updatedAt: new Date() });
    } catch (err) {
      throw new Error(`Failed to save schema: ${err}`);
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
