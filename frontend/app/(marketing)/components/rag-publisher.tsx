'use client';

import { useState } from 'react';

type DraftSection = {
  heading: string;
  body: string;
  order?: number;
};

type DraftResponse = {
  page: string;
  sections: DraftSection[];
  metadata: Record<string, unknown>;
};

export function RagPublisher() {
  const [pageSlug, setPageSlug] = useState('home');
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState<DraftResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle');
  const [message, setMessage] = useState('');

  async function createDraft() {
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/rag/preview/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_slug: pageSlug, prompt })
      });
      if (!response.ok) {
        throw new Error('Failed to generate draft');
      }
      const data = (await response.json()) as DraftResponse;
      setDraft(data);
      setStatus('ready');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
    }
  }

  async function publishDraft() {
    if (!draft) return;
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/rag/publish/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_slug: draft.page, sections: draft.sections })
      });
      if (!response.ok) {
        throw new Error('Failed to publish draft');
      }
      setStatus('idle');
      setMessage('Changes queued for publish. Trigger on-demand revalidation to update the site.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
    }
  }

  return (
    <section className="rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="text-2xl font-semibold text-slate-900">AI-assisted publishing</h2>
      <p className="mt-2 text-sm text-slate-600">
        Draft content updates via Retrieval-Augmented Generation and publish approved sections to the live site.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,2fr]">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Page slug
            <input
              value={pageSlug}
              onChange={(event) => setPageSlug(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Prompt / goal
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={createDraft}
              className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
              disabled={status === 'loading'}
            >
              Generate draft
            </button>
            <button
              type="button"
              onClick={publishDraft}
              className="rounded-full border border-primary-600 px-5 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
              disabled={status !== 'ready'}
            >
              Publish to site
            </button>
          </div>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Draft preview</h3>
          {draft ? (
            <div className="mt-4 space-y-6">
              {draft.sections.map((section, index) => (
                <article key={index} className="rounded-xl bg-white p-5 shadow-sm">
                  <h4 className="text-lg font-semibold text-slate-900">{section.heading}</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{section.body}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Generate a draft to preview suggested updates.</p>
          )}
        </div>
      </div>
    </section>
  );
}
