'use client';

import { ValidationError } from '@/hooks/use-swagger-schema';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { lintGutter } from '@codemirror/lint';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

interface SwaggerEditorProps {
  value: string;
  format: 'json' | 'yaml';
  onFormatChange: (format: 'json' | 'yaml') => void;
  onChange: (value: string) => void;
  errors?: ValidationError[];
}

const baseExtensions = [json(), yaml(), lintGutter()];

function XCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4 shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

export function SwaggerEditor({
  value,
  format,
  onFormatChange,
  onChange,
  errors,
}: SwaggerEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('editor');

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-2 overflow-hidden">
      {/* Format toggle */}
      <div className="flex shrink-0 items-center gap-1 self-end">
        <button
          onClick={() => onFormatChange('json')}
          className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
            format === 'json'
              ? 'bg-swagger-green text-swagger-dark'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          JSON
        </button>
        <span className="text-gray-600">/</span>
        <button
          onClick={() => onFormatChange('yaml')}
          className={`rounded px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
            format === 'yaml'
              ? 'bg-swagger-green text-swagger-dark'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          YAML
        </button>
      </div>

      {/* Editor */}
      <div
        ref={containerRef}
        className="border-swagger-border min-h-0 flex-1 overflow-hidden rounded border bg-[#1e1e1e]"
      >
        <CodeMirror
          value={value}
          theme="dark"
          height={'100%'}
          extensions={[...baseExtensions]}
          onChange={(newValue) => onChange(newValue)}
          className="h-full font-mono text-sm"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>

      {/* Errors */}
      {errors && errors.length > 0 && (
        <div className="max-h-40 shrink-0 overflow-y-auto rounded border border-red-800 bg-red-950/30 p-3 font-mono text-xs">
          <div className="mb-2 flex items-center gap-2 text-red-400">
            <XCircleIcon />
            <span className="font-semibold">
              {t('errorsTitle')} ({errors.length})
            </span>
          </div>
          <div className="space-y-1">
            {errors.map((err, i) => (
              <div key={i} className="flex items-start gap-2 py-0.5">
                {err.line != null && (
                  <span className="badge badge-error badge-xs shrink-0 text-[10px] leading-none">
                    Ln {err.line}
                  </span>
                )}
                <span className="text-red-200">{err.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
