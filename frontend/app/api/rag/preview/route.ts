import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const mockMode = (process.env.NEXT_PUBLIC_ENABLE_MOCKS ?? '').toLowerCase() === 'true';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  if (mockMode) {
    const pageSlug = typeof body.page_slug === 'string' ? body.page_slug : 'home';
    const prompt = typeof body.prompt === 'string' ? body.prompt : '';

    return NextResponse.json({
      page: pageSlug,
      sections: [
        { heading: 'Existing content', body: `Mocked section for ${pageSlug}` },
        { heading: 'AI Draft', body: prompt || 'Mocked RAG suggestion' }
      ],
      metadata: { provider: 'mock', model: 'mock-rag', mock: true }
    });
  }

  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/rag/preview/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Draft failed' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
