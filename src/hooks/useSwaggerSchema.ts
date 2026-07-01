'use client';

import { useState, useCallback } from 'react';
import yaml from 'js-yaml';

export interface ValidationError {
  line?: number;
  message: string;
}

export function useSwaggerSchema(initialValue: string = '') {
  const [schema, setSchema] = useState<string>(initialValue);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [format, setFormat] = useState<'json' | 'yaml'>('yaml');

  const getFormat = (text: string): 'json' | 'yaml' => {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return 'json';
    }

    return 'yaml';
  };

  const validateSchema = (text: string, currentFormat: 'json' | 'yaml') => {
    if (!text.trim()) {
      setErrors([]);
      return true;
    }

    if (currentFormat === 'json') {
    } else {
    }

    return true;
  };

  const updateSchema = useCallback((value: string) => {
    setSchema(value);
    const format = getFormat(value);
    setFormat(format);
    validateSchema(value, format);
  }, []);

  const toggleFormat = useCallback(() => {
    if (!schema.trim() || errors.length > 0) return;

    try {
      if (format === 'yaml') {
        // from YAML to JSON
        const parsed = yaml.load(schema);
        const jsonText = JSON.stringify(parsed, null, 2);
        setSchema(jsonText);
        setFormat('json');
      } else {
        // from JSON to YAML
        const parsed = JSON.parse(schema);
        const yamlText = yaml.dump(parsed, { indent: 2 });
        setSchema(yamlText);
        setFormat('yaml');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setErrors([{ message: `Conversion failed: ${message}` }]);
    }
  }, [schema, format, errors]);

  const saveSchemaToFirebase = useCallback(async () => {
    if (errors.length > 0) return;
    // Saving to Firebase...
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
