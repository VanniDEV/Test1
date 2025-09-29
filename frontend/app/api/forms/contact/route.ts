import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const mockMode = (process.env.NEXT_PUBLIC_ENABLE_MOCKS ?? '').toLowerCase() === 'true';

export async function POST(request: Request) {
  if (mockMode) {
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      // ignore
    }

    const email = typeof body.email === 'string' ? body.email : 'mock@example.com';

    return NextResponse.json({
      data: [
        {
          code: 'MOCK_SUCCESS',
          details: { id: 'mock-lead', email },
          message: 'Lead stored locally (mock mode)',
          status: 'success'
        }
      ]
    });
  }

  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const body = await request.json();
  const endpoint = query ? `${backendUrl}/api/forms/contact/?${query}` : `${backendUrl}/api/forms/contact/`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Submission failed' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
