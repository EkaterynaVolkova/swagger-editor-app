'use client';

import { ApiReferenceReact } from '@scalar/api-reference-react';
import { useTranslations } from 'next-intl';

import { hiddenClients } from '@/constants/hide-clients';
import { ValidationError } from '@/hooks/use-swagger-schema';
import '@scalar/api-reference-react/style.css';

interface Props {
  schema: string;
  errors: ValidationError[];
}

export function SwaggerViewer({ schema, errors }: Props) {
  const t = useTranslations('SwaggerViewer');
  let absoluteProxy: string | undefined = undefined;

  if (typeof window !== 'undefined') {
    absoluteProxy = new URL('/api/proxy', window.location.origin).href;
  }

  if (!schema || errors.length > 0)
    return <div className="p-8 text-center text-slate-500">{t('idle')}</div>;

  return (
    <ApiReferenceReact
      configuration={{
        content: schema,
        theme: 'saturn',
        proxyUrl: absoluteProxy,
        isEditable: false,
        showDeveloperTools: 'never',
        documentDownloadType: 'none',
        hiddenClients: hiddenClients,
        hideSearch: true,
        hideDarkModeToggle: true,
        agent: { disabled: true },
        mcp: { disabled: true },
      }}
    />
  );
}
