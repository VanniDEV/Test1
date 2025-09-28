import { NextResponse } from 'next/server';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: Request) {
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
