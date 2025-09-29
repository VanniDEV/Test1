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
* API routes proxy form submissions, sincronizan credenciales con Vercel cuando faltan y proporcionan revalidación ISR asegurada por `REVALIDATION_TOKEN`.
* Technical SEO assets: OG metadata, sitemap config (`next-sitemap`), `robots.txt`, reusable GA4/GTM injection component, and security headers via `next.config.mjs`.

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Define las variables exportándolas en tu shell o asignándolas como secretos de GitHub antes de ejecutar los comandos anteriores (usa `backend/.env.sample` como referencia). Las claves incluyen las credenciales OAuth de Zoho, la cadena de conexión de Cloud SQL y los toggles de IA (`RAG_MODEL_NAME`, `RAG_PROVIDER`). El helper `create_lead` intercambia el refresh token por un access token y envía los leads a Zoho CRM con el owner configurado.

### Frontend

```bash
cd frontend
npm install
export NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
export NEXT_PUBLIC_GTM_ID="GTM-DEV"
export REVALIDATION_TOKEN="local-dev-token"
npm run dev
```

Set `NEXT_PUBLIC_BACKEND_URL` to your Cloud Run HTTPS host. Si alguno de los valores obligatorios está ausente en el despliegue, el `EnvironmentGuard` mostrará un formulario para sincronizarlos automáticamente con Vercel usando los secretos del entorno de GitHub.

### Deployment notes

The end-to-end GitHub → Vercel + Cloud Run process is documented in [DEPLOYMENT.md](./DEPLOYMENT.md). Highlights:

* **Vercel** – configure environment variables (`NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID`, `REVALIDATION_TOKEN`) and point the project at the `frontend/` directory. The included [`vercel.json`](./vercel.json) file tells Vercel to build the nested Next.js app automatically when you import the repository.
* **GitHub Actions** – the provided [`Deploy frontend to Vercel`](.github/workflows/vercel-deploy.yml) workflow now runs only on manual dispatch so the platform's automatic Git builds don't multiply into duplicate deployments.
* **Cloud Run** – build the backend Dockerfile, mount service account credentials for Cloud SQL/GCS, and schedule Cloud SQL backups.
* **Monitoring** – hook Cloud Logging/Monitoring for Django, Vercel Analytics + GA4 for the frontend, and configure uptime checks hitting `/api/health/`.

> Cloudflare hardening is optional and intentionally excluded from this iteration.

## Testing

* Django apps ship with API endpoints ready for DRF tests – run `python manage.py test` after adding fixtures.
* Frontend linting via `npm run lint`; add Playwright tests for Lighthouse guardrails as you iterate on design/content.

## Roadmap

* Wire the scraper into the RAG ingestion pipeline.
* Connect pgvector to store embeddings and drive context retrieval.
* Add CMS editing UI for curating hero/section copy inside Django Admin.
* Extend ISR revalidation webhook handling (e.g., from Django signals or Cloud Tasks).
