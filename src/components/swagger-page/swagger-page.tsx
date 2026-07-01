'use client';

import { useTranslations } from 'next-intl';

export function SwaggerPage() {
  const t = useTranslations('swaggerPage');
  // const { user } = useAuth();

  // const { schema, updateSchema, errors, isValid, saveSchemaToFirebase } = useSwaggerSchema();

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
                // onClick={saveSchemaToFirebase}
                // disabled={!user || !isValid}
                className="btn btn-outline btn-xs border-swagger-green text-swagger-green hover:bg-swagger-green hover:text-swagger-dark bg-transparent"
              >
                {t('saveButton')}
              </button>
            </div>

            <div className="flex-1 overflow-auto font-mono text-sm">SwaggerEditor Content</div>
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
