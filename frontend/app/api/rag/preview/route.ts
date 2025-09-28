import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: Request) {
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
  }

  const body = await request.json();
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
