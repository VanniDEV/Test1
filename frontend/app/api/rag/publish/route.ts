import { NextResponse } from 'next/server';

import { getBackendBaseUrl, isMockMode } from '@/lib/runtime-config';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (isMockMode()) {
    const pageSlug = typeof body.page_slug === 'string' ? body.page_slug : 'home';
    return NextResponse.json({ page: pageSlug, mock: true }, { status: 202 });
  }

  const backendUrl = getBackendBaseUrl();
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/rag/publish/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Publish failed' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
