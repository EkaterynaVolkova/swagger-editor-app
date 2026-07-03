'use client';

import { ValidationError } from '@/hooks/use-swagger-schema';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import '@scalar/api-reference-react/style.css';

interface Props {
  schema: string;
  errors: ValidationError[];
}

export function SwaggerViewer({ schema, errors }: Props) {
  let absoluteProxy: string | undefined = undefined;

  if (typeof window !== 'undefined') {
    absoluteProxy = new URL('/api/proxy', window.location.origin).href;
  }
  if (!schema || errors.length > 0)
    return (
      <div className="p-8 text-center text-slate-500">
        ❌ Waiting for a valid OpenAPI schema to populate endpoints...
      </div>
    );

  return (
    <ApiReferenceReact
      configuration={{
        content: schema ? JSON.parse(JSON.stringify(schema)) : undefined,
        theme: 'saturn',
        proxyUrl: absoluteProxy,
        // baseServerURL: typeof schema === 'object' ? schema?.servers?.[0]?.url : undefined,
        showSidebar: false,
        isEditable: false,
        showDeveloperTools: 'never',
        documentDownloadType: 'none',
        hideClientButton: true,
        agent: { disabled: true },
        hiddenClients: true,
      }}
    />
  );
}
