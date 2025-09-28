'use client';

import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
  consent: z.boolean().refine(Boolean, 'Consent is required')
});

type Status = 'idle' | 'loading' | 'success' | 'error';

type Props = {
  endpoint: string;
};

export function LeadCaptureForm({ endpoint }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse({
      ...data,
      consent: formData.get('consent') === 'on'
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid data');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStatus('success');
      event.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unexpected error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-8 shadow-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          First name
          <input
            name="first_name"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Last name
          <input
            name="last_name"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Email
          <input
            name="email"
            type="email"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
            required
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Company
          <input
            name="company"
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        How can we help?
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
          required
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-slate-600">
        <input type="checkbox" name="consent" className="h-4 w-4 rounded border-slate-300" required />
        I agree to receive communications and confirm I have read the privacy notice.
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Let’s talk'}
      </button>
      {status === 'success' ? (
        <p className="text-sm font-medium text-primary-600">Thank you! We will be in touch shortly.</p>
      ) : null}
    </form>
  );
}
