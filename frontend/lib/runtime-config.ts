import 'server-only';

const PUBLIC_ENABLE_MOCKS = (process.env.NEXT_PUBLIC_ENABLE_MOCKS ?? '').toLowerCase() === 'true';
const SERVER_ENABLE_MOCKS = (process.env.ENABLE_MOCKS ?? '').toLowerCase() === 'true';
const ENABLE_MOCKS = PUBLIC_ENABLE_MOCKS || SERVER_ENABLE_MOCKS;

function readBackendUrl(): string | null {
  const candidates = [
    process.env.NEXT_PUBLIC_BACKEND_URL,
    process.env.BACKEND_URL,
    process.env.DJANGO_BACKEND_URL
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
}

function sanitiseBaseUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (
    trimmed.length === 0 ||
    trimmed.toLowerCase() === 'undefined' ||
    trimmed.toLowerCase() === 'null' ||
    trimmed.toLowerCase() === 'false'
  ) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const path = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
    return `${url.origin}${path}`;
  } catch (error) {
    console.warn('Invalid backend base URL, falling back to mock data.', error);
    return null;
  }
}

export function isMockMode(): boolean {
  return ENABLE_MOCKS;
}

export function getBackendBaseUrl(): string | null {
  if (ENABLE_MOCKS) {
    return null;
  }

  return sanitiseBaseUrl(readBackendUrl());
}

export function hasBackendIntegration(): boolean {
  return getBackendBaseUrl() !== null;
}
