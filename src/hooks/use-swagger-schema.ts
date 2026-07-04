'use client';

import { useState, useCallback, useRef } from 'react';
import * as yaml from 'js-yaml';
import SwaggerParser from '@apidevtools/swagger-parser';

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

export function useSwaggerSchema(initialValue: string = '') {
  const [schema, setSchema] = useState(initialValue);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');
  const validationKey = useRef(0);

  const validateAsync = async (text: string, format: 'json' | 'yaml', key: number) => {
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

      const message = err instanceof Error ? err.message : String(err);
      setErrors([{ message, line: 1 }]);
    }
  };

  const validate = useCallback((text: string, format: 'json' | 'yaml', key: number) => {
    validateAsync(text, format, key);
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
    if (errors.length > 0) return;
    // TODO
  }, [errors]);

  return {
    schema,
    updateSchema,
    errors,
    isValid: errors.length === 0,
    format,
    toggleFormat,
    saveSchemaToFirebase,
  };
}
