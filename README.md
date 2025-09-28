# Marketing Platform Starter

Full-stack starter that connects a branded Next.js marketing site with a Django + DRF backend, Zoho CRM EU integration, and a Retrieval-Augmented Generation (RAG) workflow for managing content updates.

## Monorepo structure

```
.
├── backend/        # Django project packaged for Cloud Run
└── frontend/       # Next.js 14 (App Router) marketing experience
```

### Backend (`backend/`)

* Django 5 + DRF with apps for marketing content, Zoho CRM powered lead capture, and a RAG publishing API.
* PostgreSQL connectivity via `DATABASE_URL` (Cloud SQL ready) and Google Cloud Storage support through `django-storages`.
* REST endpoints:
  * `/api/pages/<slug>/` – hydrate layout content.
  * `/api/services/`, `/api/ebooks/`, `/api/blog-posts/` – ISR-friendly feeds consumed by the front end.
  * `/api/forms/contact/`, `/api/forms/ebook/` – lead capture flows that forward submissions to Zoho CRM (EU stack) with UTM + consent metadata hooks.
  * `/api/rag/preview/` + `/api/rag/publish/` – generate drafts and persist approved updates.
* Cloud Run ready `Dockerfile`, `.env.sample`, and secure headers/HSTS defaults.

### Frontend (`frontend/`)

* Next.js 14 App Router, TypeScript, and Tailwind CSS theme reflecting the provided brand brief (Home, Services, eBooks, Blog).
* Server components fetch CMS data via ISR-enabled requests; client components manage forms, Zoho submissions, and RAG publishing controls.
* API routes proxy form submissions and provide on-demand ISR revalidation secured by `REVALIDATION_TOKEN`.
* Technical SEO assets: OG metadata, sitemap config (`next-sitemap`), `robots.txt`, reusable GA4/GTM injection component, and security headers via `next.config.mjs`.

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Environment variables cover Zoho OAuth credentials, Cloud SQL connection string, and AI provider toggles (`RAG_MODEL_NAME`, `RAG_PROVIDER`). The `create_lead` helper exchanges the refresh token for an access token and posts Zoho CRM leads under the configured owner.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_BACKEND_URL` to your Cloud Run HTTPS host. The marketing pages will hydrate from the Django APIs, submit leads through `/api/forms/*`, and surface the RAG “Publish to site” workflow that hits the backend adapter.

### Deployment notes

* **Vercel** – configure environment variables (`NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID`, `REVALIDATION_TOKEN`). Connect to the `frontend` directory.
* **Cloud Run** – build the backend Dockerfile, mount service account credentials for Cloud SQL/GCS, and schedule Cloud SQL backups.
* **Cloudflare** – front the Vercel + Cloud Run origins with WAF, enabling HTTP/3 and security headers pass-through.
* **Monitoring** – hook Cloud Logging/Monitoring for Django, Vercel Analytics + GA4 for the frontend, and configure uptime checks hitting `/api/health/`.

## Testing

* Django apps ship with API endpoints ready for DRF tests – run `python manage.py test` after adding fixtures.
* Frontend linting via `npm run lint`; add Playwright tests for Lighthouse guardrails as you iterate on design/content.

## Roadmap

* Wire the scraper into the RAG ingestion pipeline.
* Connect pgvector to store embeddings and drive context retrieval.
* Add CMS editing UI for curating hero/section copy inside Django Admin.
* Extend ISR revalidation webhook handling (e.g., from Django signals or Cloud Tasks).
