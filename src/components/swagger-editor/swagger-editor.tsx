'use client';

import { ValidationError } from '@/hooks/use-swagger-schema';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { useEffect, useRef, useState } from 'react';

interface SwaggerEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors?: ValidationError[];
}

export function SwaggerEditor({ value, onChange, errors }: SwaggerEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState('100%');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      setEditorHeight(height > 0 ? `${height}px` : '100%');
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      <div
        ref={containerRef}
        className="border-swagger-border min-h-0 flex-1 overflow-hidden rounded border bg-[#1e1e1e]"
      >
        <CodeMirror
          value={value}
          theme="dark"
          height={editorHeight}
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
