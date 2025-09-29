import { NextResponse } from 'next/server';

type RuntimeConfigPayload = Partial<Record<'NEXT_PUBLIC_BACKEND_URL' | 'NEXT_PUBLIC_GTM_ID' | 'REVALIDATION_TOKEN', string>>;

const REQUIRED_KEYS = ['NEXT_PUBLIC_BACKEND_URL', 'REVALIDATION_TOKEN'] as const;
const OPTIONAL_KEYS = ['NEXT_PUBLIC_GTM_ID'] as const;
const ALLOWED_KEYS = [...REQUIRED_KEYS, ...OPTIONAL_KEYS] as const;

const TARGETS = ['production', 'preview', 'development'];

type VercelEnv = {
  id: string;
  key: string;
};

type VercelEnvResponse = {
  envs: VercelEnv[];
};

function buildApiUrl(path: string): string {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const orgId = process.env.VERCEL_ORG_ID;

  if (!projectId) {
    throw new Error('VERCEL_PROJECT_ID no está configurado.');
  }

  const url = new URL(`https://api.vercel.com${path.replace('{projectId}', projectId)}`);
  if (orgId) {
    url.searchParams.set('teamId', orgId);
  }
  return url.toString();
}

function sanitizePayload(payload: RuntimeConfigPayload): [string, string][] {
  const rawEntries = Object.entries(payload)
    .filter(([key]) => ALLOWED_KEYS.includes(key as (typeof ALLOWED_KEYS)[number]))
    .map(([key, value]) => [key, value?.trim() ?? ''] as [string, string]);

  const providedKeys = new Set(rawEntries.map(([key]) => key));
  const missingRequired = REQUIRED_KEYS.filter((required) => !providedKeys.has(required));
  if (missingRequired.length > 0) {
    throw new Error(`Debes completar todos los campos: ${missingRequired.join(', ')}.`);
  }

  const sanitized: [string, string][] = [];

  for (const [key, value] of rawEntries) {
    if (value.length === 0) {
      if (REQUIRED_KEYS.includes(key as (typeof REQUIRED_KEYS)[number])) {
        throw new Error(`Debes completar todos los campos: ${key}.`);
      }

      // Optional keys con valor vacío se omiten para no sobrescribir el existente.
      continue;
    }

    sanitized.push([key, value]);
  }

  if (sanitized.length === 0) {
    throw new Error('No se proporcionaron variables válidas para sincronizar.');
  }

  return sanitized;
}

async function fetchExistingEnvMap(token: string): Promise<Map<string, VercelEnv>> {
  const response = await fetch(buildApiUrl('/v9/projects/{projectId}/env'), {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener la configuración actual del proyecto en Vercel.');
  }

  const data = (await response.json()) as VercelEnvResponse;
  return new Map(data.envs.map((env) => [env.key, env]));
}

async function createOrUpdateEnv(
  token: string,
  existing: Map<string, VercelEnv>,
  key: string,
  value: string
): Promise<void> {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const current = existing.get(key);

  if (current) {
    const response = await fetch(buildApiUrl(`/v10/projects/{projectId}/env/${current.id}`), {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        value,
        target: TARGETS,
        type: 'encrypted'
      })
    });

    if (!response.ok) {
      throw new Error(`No se pudo actualizar la variable ${key} en Vercel.`);
    }

    return;
  }

  const response = await fetch(buildApiUrl('/v10/projects/{projectId}/env'), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key,
      value,
      target: TARGETS,
      type: 'encrypted'
    })
  });

  if (!response.ok) {
    throw new Error(`No se pudo crear la variable ${key} en Vercel.`);
  }
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.VERCEL_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        message:
          'VERCEL_TOKEN no está definido. Configura los secretos de Vercel en GitHub para permitir la sincronización.'
      },
      { status: 500 }
    );
  }

  let payload: RuntimeConfigPayload;

  try {
    payload = (await request.json()) as RuntimeConfigPayload;
  } catch {
    return NextResponse.json({ message: 'El cuerpo de la solicitud no es válido.' }, { status: 400 });
  }

  let entries: [string, string][];
  try {
    entries = sanitizePayload(payload);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Datos inválidos.' },
      { status: 400 }
    );
  }

  try {
    const existing = await fetchExistingEnvMap(token);

    for (const [key, value] of entries) {
      await createOrUpdateEnv(token, existing, key, value);
    }

    return NextResponse.json({ updated: entries.map(([key]) => key) }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado al sincronizar las variables en Vercel.'
      },
      { status: 500 }
    );
  }
}
