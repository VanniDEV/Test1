import React from 'react';

const REQUIRED_ENV_VARS = [
  {
    key: 'NEXT_PUBLIC_BACKEND_URL',
    label: 'NEXT_PUBLIC_BACKEND_URL',
    description:
      'URL base del backend de Django accesible públicamente para las llamadas desde Next.js.',
    example: 'http://localhost:8000'
  },
  {
    key: 'REVALIDATION_TOKEN',
    label: 'REVALIDATION_TOKEN',
    description:
      'Token compartido entre el backend y Next.js para revalidar rutas con ISR y webhooks.',
    example: 'genera-un-token-seguro'
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

export function EnvironmentGuard({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const missingVars = collectMissingVariables();

  if (missingVars.length === 0) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/95 px-6 py-16 text-white">
      <form className="w-full max-w-3xl space-y-8 rounded-2xl bg-white p-10 text-slate-900 shadow-2xl">
        <header className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900">
            Configura las variables de entorno obligatorias
          </h1>
          <p className="text-base text-slate-600">
            Antes de continuar debes completar el archivo <code>frontend/.env.local</code> con los
            valores requeridos. Este formulario es informativo y te guía sobre qué valores faltan.
            Una vez actualices el archivo, reinicia el servidor de desarrollo de Next.js.
          </p>
        </header>

        <section className="space-y-6">
          {missingVars.map((envVar) => (
            <fieldset key={envVar.key} className="space-y-2 rounded-lg border border-slate-200 p-5">
              <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {envVar.label}
              </legend>
              <p className="text-sm text-slate-600">{envVar.description}</p>
              <label className="block space-y-2">
                <span className="text-xs font-medium uppercase text-slate-500">
                  Valor sugerido para desarrollo local
                </span>
                <input
                  readOnly
                  value={envVar.example}
                  className={
                    'w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700 shadow-inner focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                  }
                />
              </label>
              {envVar.value ? (
                <p className="text-xs text-amber-600">
                  Valor actual detectado: <code>{envVar.value}</code>
                </p>
              ) : (
                <p className="text-xs text-amber-600">Actualmente no se detectó ningún valor configurado.</p>
              )}
              <p className="text-xs text-slate-500">
                Edita <code>frontend/.env.local</code>, guarda los cambios y reinicia con
                <code> npm run dev</code>.
              </p>
            </fieldset>
          ))}
        </section>

        <footer className="space-y-3 rounded-lg bg-indigo-50 p-4 text-sm text-slate-700">
          <p>
            Si los valores ya fueron actualizados, detén el servidor de desarrollo, vuelve a iniciar
            <code> npm run dev</code> e intenta recargar la página.
          </p>
          <p>
            Recuerda mantener estas variables sincronizadas con los entornos de staging y producción
            antes del despliegue en Vercel.
          </p>
        </footer>
      </form>
    </div>
  );
}
