'use client';

import { useTranslations } from 'next-intl';
import { useOrientation } from '@/hooks/useOrientation';

export function SwaggerPage() {
  const t = useTranslations('swaggerPage');
  // const { user } = useAuth();
  const { isLandscape } = useOrientation();

  // const { schema, updateSchema, errors, isValid, saveSchemaToFirebase } = useSwaggerSchema();

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col">
      {/* Split View */}
      <div
        className={`flex h-full min-h-0 w-full flex-1 overflow-hidden ${
          isLandscape ? 'flex-row' : 'flex-col'
        }`}
      >
        {/* Swagger Editor */}
        <div
          className={`border-base-300 bg-swagger-dark text-swagger-light-grey relative flex min-h-0 min-w-0 flex-1 flex-col overflow-auto ${
            isLandscape ? 'w-1/2 border-r' : 'h-1/2 w-full border-b'
          }`}
        >
          <div className="flex-1 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                {t('editorTitle')}
              </span>

              <button
                // onClick={saveSchemaToFirebase}
                // disabled={!user || !isValid}
                className="btn btn-outline btn-sm border-swagger-green text-swagger-green hover:bg-swagger-green hover:text-swagger-dark bg-transparent"
              >
                {t('saveButton')}
              </button>
            </div>

            <div className="font-mono text-sm">SwaggerEditor Content</div>
          </div>
        </div>

        {/* Swagger UI */}
        <div
          className={`text-neutral flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-white p-4 ${
            isLandscape ? 'h-full w-1/2' : 'h-1/2 w-full'
          }`}
        >
          <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            {t('viewerTitle')}
          </span>

          <div className="text-sm">SwaggerViewer Content</div>
        </div>
      </div>
    </div>
  );
}
