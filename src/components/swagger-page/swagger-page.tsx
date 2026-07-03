'use client';

import { useSwaggerSchema } from '@/hooks/use-swagger-schema';
import { useTranslations } from 'next-intl';
import { SwaggerEditor } from '../swagger-editor';
import { useAuth } from '@/hooks/use-auth';
import { SwaggerViewer } from '@/components/swagger-viewer';

const schemaJson = {
  openapi: '3.0.0',
  info: {
    title: 'JSONPlaceholder Test API',
    version: '1.0.0',
    description: 'Working template for making real HTTP requests',
  },
  servers: [
    { url: 'https://jsonplaceholder.typicode.com', description: 'Real public server for tests' },
  ],
  paths: {
    '/users': {
      get: {
        summary: 'Get user list',
        description: 'Makes a real GET request and returns an array of users.',
        responses: {
          '200': {
            description: 'Successful request',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer', example: 1 },
                      name: { type: 'string', example: 'Leanne Graham' },
                      username: { type: 'string', example: 'Bret' },
                      email: { type: 'string', example: 'Sincere@april.biz' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export function SwaggerPage() {
  const t = useTranslations('swaggerPage');
  const { isAuthenticated, loading } = useAuth();

  const { schema, updateSchema, errors, isValid, saveSchemaToFirebase } = useSwaggerSchema(
    JSON.stringify(schemaJson, null, 2)
  );

  return (
    <>
      {/* Split View */}
      <div className="flex min-h-0 w-full flex-1 flex-col landscape:flex-row">
        {/* Swagger Editor */}
        <div className="bg-swagger-dark text-swagger-light-grey border-swagger-border flex min-h-0 min-w-0 flex-1 basis-1/2 flex-col border-b landscape:basis-1/2 landscape:border-r landscape:border-b-0">
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

            <div className="min-h-0 flex-1 font-mono text-sm">
              <SwaggerEditor value={schema} onChange={updateSchema} errors={errors} />
            </div>
          </div>
        </div>

        {/* Swagger UI */}
        <div className="text-neutral flex min-h-0 min-w-0 flex-1 basis-1/2 flex-col bg-white landscape:basis-1/2">
          <div className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-2 shrink-0">
              <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                {t('viewerTitle')}
              </span>
            </div>

            <div className="flex-1 text-sm">
              <SwaggerViewer errors={errors} schema={schema} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
