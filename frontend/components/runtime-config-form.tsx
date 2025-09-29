"use client";

import { useMemo, useState, type FormEvent } from 'react';

type MissingVar = {
  key: string;
  label: string;
  description: string;
  example: string;
  value?: string;
};

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; updated: string[] }
  | { status: 'error'; message: string };

function buildInitialValues(missingVars: MissingVar[]): Record<string, string> {
  return missingVars.reduce<Record<string, string>>((acc, variable) => {
    acc[variable.key] = variable.value ?? '';
    return acc;
  }, {});
}

export function RuntimeConfigForm({
  missingVars
}: {
  missingVars: MissingVar[];
}) {
  const [values, setValues] = useState<Record<string, string>>(() => buildInitialValues(missingVars));
  const [state, setState] = useState<SubmitState>({ status: 'idle' });

  const requiredKeys = useMemo(() => missingVars.map((variable) => variable.key), [missingVars]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const payload: Record<string, string> = {};
    for (const key of requiredKeys) {
      const currentValue = values[key]?.trim();
      if (!currentValue) {
        setState({ status: 'error', message: `Debes completar el campo ${key} antes de continuar.` });
        return;
      }
      payload[key] = currentValue;
    }

    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/runtime-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido.' }));
        throw new Error(errorData.message ?? 'No se pudo sincronizar la configuración.');
      }

      const data = (await response.json()) as { updated: string[] };
      setState({ status: 'success', updated: data.updated });
    } catch (error) {
      setState({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo contactar al servidor de configuración. Intenta nuevamente.'
      });
    }
  }

  function updateValue(key: string, value: string): void {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        {missingVars.map((variable) => (
          <label key={variable.key} className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">{variable.label}</span>
            <input
              value={values[variable.key] ?? ''}
              onChange={(event) => updateValue(variable.key, event.target.value)}
              placeholder={variable.example}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            />
            <span className="block text-xs text-slate-500">{variable.description}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
        disabled={state.status === 'loading'}
      >
        {state.status === 'loading' ? 'Sincronizando…' : 'Guardar y sincronizar'}
      </button>

      {state.status === 'success' && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <p>Variables actualizadas: {state.updated.join(', ')}.</p>
          <p className="mt-2">
            Si el sitio seguía desplegado, lanza un redeploy desde Vercel para que los nuevos valores estén
            disponibles en las funciones serverless.
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p>{state.message}</p>
          <p className="mt-2">
            Verifica que el repositorio disponga de los secretos <code>VERCEL_TOKEN</code>,
            <code> VERCEL_PROJECT_ID</code> y <code>VERCEL_ORG_ID</code> en GitHub para permitir la
            sincronización automática.
          </p>
        </div>
      )}
    </form>
  );
}

export default RuntimeConfigForm;
