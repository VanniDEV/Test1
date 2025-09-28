import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const token = process.env.REVALIDATION_TOKEN;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.headers.get('x-secret-token');

  if (!token || secret !== token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = body.path ?? '/';
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
