'use client';

import { ValidationError } from '@/hooks/use-swagger-schema';

interface SwaggerEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: ValidationError[];
}

export function SwaggerEditor({ value, onChange, errors }: SwaggerEditorProps) {
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-swagger-border text-swagger-light-grey w-full flex-1 border bg-[#1e1e1e] p-2 font-mono text-sm"
        placeholder="Temporary editor..."
      />

      {errors && errors.length > 0 && (
        <div className="text-error text-xs">Errors count: {errors.length}</div>
      )}
    </div>
  );
}
