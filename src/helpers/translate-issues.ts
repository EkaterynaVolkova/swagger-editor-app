import { FieldValues, Resolver } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import type { GenericSchema, GenericSchemaAsync } from 'valibot';

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

export function createTranslatedResolver<TFieldValues extends FieldValues>(
  schema: GenericSchema<TFieldValues> | GenericSchemaAsync<TFieldValues>,
  t: TranslateFn
): Resolver<TFieldValues> {
  const baseResolver = valibotResolver(schema);

  return async (values, context, options) => {
    const result = await baseResolver(values, context, options);

    if (result.errors) {
      Object.keys(result.errors).forEach((field) => {
        const error = result.errors[field];
        if (error && typeof error.message === 'string') {
          const rawMessage = error.message;
          if (rawMessage.includes(':')) {
            const [key, value] = rawMessage.split(':');
            error.message = t(key, { length: value });
          } else {
            error.message = t(rawMessage);
          }
        }
      });
    }
    return result;
  };
}
