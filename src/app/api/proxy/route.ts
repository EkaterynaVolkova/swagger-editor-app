import { NextRequest, NextResponse } from 'next/server';

export async function createProxyHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('scalar_url') || searchParams.get('proxyUrl');

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
    }

    const headers = new Headers();
    req.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        !['host', 'connection', 'cookie', 'content-length', 'accept-encoding'].includes(lowerKey)
      ) {
        headers.set(key, value);
      }
    });

    const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
      cache: 'no-store',
    });

    const resHeaders = new Headers();
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');
    resHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Proxy error', details: error instanceof Error ? error.message : 'Unknown rrror' },
      { status: 500 }
    );
  }
}

export {
  createProxyHandler as GET,
  createProxyHandler as POST,
  createProxyHandler as PUT,
  createProxyHandler as DELETE,
  createProxyHandler as PATCH,
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
