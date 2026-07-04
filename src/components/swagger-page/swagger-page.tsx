'use client';

import { useSwaggerSchema } from '@/hooks/use-swagger-schema';
import { useTranslations } from 'next-intl';
import { SwaggerEditor } from '../swagger-editor';
import { useAuth } from '@/hooks/use-auth';

export function SwaggerPage() {
  const t = useTranslations('swaggerPage');
  const { isAuthenticated, loading } = useAuth();

  const { schema, updateSchema, errors, isValid, format, toggleFormat, saveSchemaToFirebase } =
    useSwaggerSchema();

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      {/* Split View */}
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden landscape:flex-row">
        {/* Swagger Editor */}
        <div className="bg-swagger-dark text-swagger-light-grey border-swagger-border flex min-h-0 min-w-0 flex-1 basis-1/2 flex-col overflow-hidden border-b landscape:basis-1/2 landscape:border-r landscape:border-b-0">
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                {t('editorTitle')}
              </span>

              <button
                onClick={saveSchemaToFirebase}
                disabled={loading || !isAuthenticated || !isValid}
                className="btn btn-outline btn-success btn-sm hover:bg-success bg-transparent hover:text-white"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-xs text-success"></span>
                ) : (
                  t('saveButton')
                )}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden font-mono text-sm">
              <SwaggerEditor
                value={schema}
                onChange={updateSchema}
                format={format}
                onFormatChange={toggleFormat}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Swagger UI */}
        <div className="text-neutral flex min-h-0 min-w-0 flex-1 basis-1/2 flex-col overflow-hidden bg-white landscape:basis-1/2">
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-2 shrink-0">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                {t('viewerTitle')}
              </span>
            </div>

            <div className="flex-1 overflow-auto text-sm">SwaggerViewer Content</div>
          </div>
        </div>
      </div>
    </div>
  );
}
