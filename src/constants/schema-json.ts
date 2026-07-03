export const schemaJson = {
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
