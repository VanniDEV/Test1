import React from 'react';

const REQUIRED_ENV_VARS = [
  {
    key: 'NEXT_PUBLIC_BACKEND_URL',
    label: 'NEXT_PUBLIC_BACKEND_URL',
    description:
      'URL base del backend de Django accesible públicamente para las llamadas desde Next.js.',
    example: 'http://localhost:8000',
    help: [
      'En local apunta a http://localhost:8000 mientras ejecutas `python manage.py runserver`.',
      'En producción usa la URL HTTPS pública del backend (por ejemplo, el dominio de Cloud Run: https://<servicio>.a.run.app).',
      'Si publicas detrás de un proxy propio, asegúrate de incluir el protocolo y evitar barras extra al final.'
    ]
  },
  {
    key: 'REVALIDATION_TOKEN',
    label: 'REVALIDATION_TOKEN',
    description:
      'Token compartido entre el backend y Next.js para revalidar rutas con ISR y webhooks.',
    example: 'openssl rand -hex 32',
    help: [
      'Genera una cadena aleatoria (por ejemplo con `openssl rand -hex 32`) y cópiala en ambos proyectos.',
      'Define el mismo valor como variable de entorno en Vercel y en el backend de Django (`REVALIDATION_TOKEN`).',
      'Cuando uses GitHub Actions, guarda el token como secreto para que la sincronización con Vercel funcione.'
    ]
  }
] as const;

type RequiredVar = (typeof REQUIRED_ENV_VARS)[number];

type MissingVar = RequiredVar & { value?: string };

function isMissing(value: string | undefined, key: string): boolean {
  if (!value || value.trim().length === 0) {
    return true;
  }

  const sanitized = value.trim();

  if (key === 'NEXT_PUBLIC_BACKEND_URL') {
    return sanitized.includes('example.com');
  }

  if (key === 'REVALIDATION_TOKEN') {
    return sanitized === 'change-me';
  }

  return false;
}

function collectMissingVariables(): MissingVar[] {
  return REQUIRED_ENV_VARS.reduce<MissingVar[]>((acc, variable) => {
    const rawValue = process.env[variable.key];
    if (isMissing(rawValue, variable.key)) {
      acc.push({ ...variable, value: rawValue });
    }
    return acc;
  }, []);
}

export async function EnvironmentGuard({
  children
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
  const missingVars = collectMissingVariables();

  if (missingVars.length === 0) {
    return <>{children}</>;
  }

  const { RuntimeConfigForm } = await import('./runtime-config-form');

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/95 px-6 py-16 text-white">
      <div className="w-full max-w-3xl space-y-8 rounded-2xl bg-white p-10 text-slate-900 shadow-2xl">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            Configura las variables de entorno obligatorias
          </h1>
          <p className="text-base text-slate-600">
            El repositorio toma las credenciales desde los secretos del entorno de GitHub. Si todavía no
            existen en Vercel puedes cargarlas directamente desde este formulario y el proyecto intentará
            sincronizarlas mediante la API de Vercel usando las credenciales de servicio configuradas en
            GitHub.
          </p>
        </header>

        <section className="space-y-6">
          {missingVars.map((envVar) => (
            <fieldset key={envVar.key} className="space-y-2 rounded-lg border border-slate-200 p-5">
              <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {envVar.label}
              </legend>
              <p className="text-sm text-slate-600">{envVar.description}</p>
              <p className="text-xs text-slate-500">
                Sugerencia para pruebas locales: <code>{envVar.example}</code>
              </p>
              {envVar.help && (
                <ul className="list-disc space-y-1 pl-5 text-xs text-slate-500">
                  {envVar.help.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {envVar.value ? (
                <p className="text-xs text-amber-600">
                  Valor detectado en el entorno actual: <code>{envVar.value}</code>
                </p>
              ) : (
                <p className="text-xs text-amber-600">No se detectó un valor configurado.</p>
              )}
            </fieldset>
          ))}
        </section>

        <p className="rounded-lg bg-indigo-50 p-4 text-sm text-slate-700">
          Completa los valores y pulsa “Guardar y sincronizar” para que queden almacenados como variables de
          entorno en tu proyecto de Vercel. El proceso requiere que existan los secretos
          <code> VERCEL_TOKEN</code> y <code>VERCEL_PROJECT_ID</code> (además de <code>VERCEL_ORG_ID</code> si
          el proyecto pertenece a un equipo) en GitHub.
        </p>

        <RuntimeConfigForm missingVars={missingVars} />
      </div>
    </div>
  );
}
