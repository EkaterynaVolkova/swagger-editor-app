'use client';

import { ValidationError } from '@/hooks/use-swagger-schema';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';

interface SwaggerEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: ValidationError[];
}

export function SwaggerEditor({ value, onChange, errors }: SwaggerEditorProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-2">
      <div className="border-swagger-border min-h-0 flex-1 rounded border bg-[#1e1e1e]">
        <CodeMirror
          value={value}
          theme="dark"
          height={'100%'}
          extensions={[json(), yaml()]}
          onChange={(newValue) => onChange(newValue)}
          className="h-full font-mono text-sm"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>

      {errors && errors.length > 0 && (
        <div className="text-error text-xs">Errors count: {errors.length}</div>
      )}
    </div>
  );
}
