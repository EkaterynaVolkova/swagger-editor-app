import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth/get-user';
import { recordRequestAnalytics, type RequestAnalytics } from '@/lib/request-history';

function byteSize(value: string) {
  return Buffer.byteLength(value, 'utf8');
}

export async function createProxyHandler(req: NextRequest) {
  const startedAt = performance.now();
  const user = await getUser();
  let targetUrl = '';
  let requestBody = '';

  const saveAnalytics = async (
    analytics: Omit<RequestAnalytics, 'duration' | 'method' | 'endpoint'>
  ) => {
    if (!user) return;

    try {
      await recordRequestAnalytics(user, {
        ...analytics,
        duration: Math.round(performance.now() - startedAt),
        method: req.method,
        endpoint: targetUrl,
      });
    } catch (error) {
      console.error('Failed to record request analytics', error);
    }
  };

  try {
    const { searchParams } = new URL(req.url);
    targetUrl = searchParams.get('scalar_url') || searchParams.get('proxyUrl') || '';

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
    requestBody = hasBody ? await req.text() : '';
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? requestBody : undefined,
      cache: 'no-store',
    });

    const resHeaders = new Headers();
    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');
    resHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    const responseBody = await response.text();
    await saveAnalytics({
      statusCode: response.status,
      requestSize: byteSize(requestBody),
      responseSize: byteSize(responseBody),
      errorDetails: response.ok ? null : `${response.status} ${response.statusText}`.trim(),
    });

    return new NextResponse(responseBody, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error: unknown) {
    const errorDetails = error instanceof Error ? error.message : 'Unknown error';
    await saveAnalytics({
      statusCode: 500,
      requestSize: byteSize(requestBody),
      responseSize: 0,
      errorDetails,
    });

    return NextResponse.json({ error: 'Proxy error', details: errorDetails }, { status: 500 });
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
