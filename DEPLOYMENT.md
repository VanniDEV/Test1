# GitHub + Vercel deployment guide

The project is designed for a split deployment: the Django backend runs on Google Cloud Run while the Next.js frontend is hosted on Vercel. This document explains how to publish both services starting from the code inside this repository.

> **Note**
> Cloudflare is optional for this release and is therefore omitted from the steps below.

## 1. Prepare local repository

1. Make sure all dependencies install locally (`pip install -r backend/requirements.txt`, `npm install --prefix frontend`).
2. Commit the state you want to publish and push it to your own GitHub organization/account.

### Create a new GitHub repository

```bash
# from the repo root
git remote remove origin 2>/dev/null || true
# replace ORG/REPO with your namespace
gh repo create ORG/REPO --private --source=. --push
```

If you prefer the manual workflow, create the repository from the GitHub UI and then run:

```bash
git remote add origin git@github.com:ORG/REPO.git
git push -u origin main
```

## 2. Django backend on Cloud Run

1. Enable the Cloud Run, Cloud Build, Secret Manager, Artifact Registry, and Cloud SQL Admin APIs in your Google Cloud project.
2. Provision a **Cloud SQL for PostgreSQL** instance and create a database/user pair. Note the connection string for later (update `DATABASE_URL`).
3. Create a **Google Cloud Storage** bucket for media uploads.
4. Build and deploy the service using the existing Dockerfile (deja `ENABLE_MOCKS=true` si quieres mantener datos simulados mientras publicas el backend por primera vez):

   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/marketing-backend ./backend
   gcloud run deploy marketing-backend \
     --image gcr.io/PROJECT_ID/marketing-backend \
     --region REGION \
     --allow-unauthenticated \
     --set-env-vars DJANGO_DEBUG=false,DJANGO_ALLOWED_HOSTS=frontend.vercel.app,NEXT_PUBLIC_BACKEND_URL=https://marketing-backend-xyz.a.run.app \
     --set-secrets=DJANGO_SECRET_KEY=projects/PROJECT_ID/secrets/DJANGO_SECRET_KEY:latest,ZOHO_CLIENT_SECRET=projects/PROJECT_ID/secrets/ZOHO_CLIENT_SECRET:latest,ZOHO_REFRESH_TOKEN=projects/PROJECT_ID/secrets/ZOHO_REFRESH_TOKEN:latest
   ```

5. Attach the Cloud SQL instance (either via the Cloud Run UI or `--add-cloudsql-instances` flag) and mount a service account with permissions for Cloud SQL and GCS.
6. Update the `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`, and `DJANGO_CORS_ALLOWED_ORIGINS` variables to include the Cloud Run hostname and the Vercel domain.
7. Run database migrations once the service is live:

   ```bash
   gcloud run jobs execute marketing-backend-migrate --image gcr.io/PROJECT_ID/marketing-backend --command "python" --args "manage.py,migrate"
   ```

## 3. Next.js frontend on Vercel

1. Sign in to Vercel and create a new project by importing the GitHub repository created in step 1.
2. Thanks to the root-level [`vercel.json`](./vercel.json), Vercel auto-detects that the Next.js app lives in `frontend/`. Confirm the detected root directory shows `frontend/` before continuing.
3. Configura los secretos `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID` y `REVALIDATION_TOKEN` en GitHub (Settings → Environments/Secrets). El workflow de GitHub Actions sincroniza estos valores con Vercel en cada ejecución y el formulario de bloqueo en el frontend permite cargarlos manualmente si están ausentes.

   | Variable | Description |
   | --- | --- |
   | `NEXT_PUBLIC_BACKEND_URL` | Public HTTPS URL of the backend (en local apunta a `http://localhost:8000`; en producción usa el dominio de Cloud Run o el host que exponga Django). |
   | `NEXT_PUBLIC_GTM_ID` | GTM container ID if you use Google Tag Manager (leave blank to disable). |
   | `NEXT_PUBLIC_ENABLE_MOCKS` | Ponlo en `true` para navegar la versión demo con APIs simuladas; deja `false` cuando el backend esté disponible. |
   | `REVALIDATION_TOKEN` | Shared secret for ISR revalidation; genera un valor aleatorio (por ejemplo con `openssl rand -hex 32`) y reutilízalo en el backend (`REVALIDATION_TOKEN`). |

4. Set the **Framework Preset** to Next.js and leave the default build/run commands (`npm install`, `npm run build`).
5. Trigger the first deployment. Vercel will expose a `*.vercel.app` domain once the build succeeds.
6. Record the Vercel-provided URL; this is the frontend link you can share.

### Automate Vercel deployments from GitHub Actions

This repository ships with `.github/workflows/vercel-deploy.yml`, which can build and release the frontend without leaving GitHub.

1. In your project settings on GitHub, add the secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` (you can copy these values from the **Settings → Tokens** and **Project Settings → General** sections inside Vercel).
2. Añade también `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_ENABLE_MOCKS` y `REVALIDATION_TOKEN` como secretos para que el paso de sincronización pueda publicarlos en Vercel.
3. Trigger the workflow manually via **Actions → Deploy frontend to Vercel → Run workflow** whenever you need to force a redeploy from GitHub.
4. The job sincroniza las variables, ejecuta `vercel pull`, construye con `vercel build --prod` y publica el artefacto con `vercel deploy --prebuilt --prod`, evitando duplicar builds con el flujo automático de Vercel.

When the workflow finishes, the URL reported by the final deployment step matches what you would see in the Vercel dashboard.

## 4. Connect frontend and backend

* In the Django admin, populate content (pages, services, ebooks, blog posts) so the marketing site has data to hydrate.
* Use the RAG workflow (`/api/rag/preview/` and `/api/rag/publish/`) to draft and publish updates as needed.
* Verify that the web forms deliver leads to Zoho CRM; check the API logs via Cloud Run and the submissions inside Zoho.

## 5. Optional hardening

Although Cloudflare is not part of this iteration, you can still:

* Enable HTTPS-only and security headers at both origins (already configured in the codebase).
* Configure automatic backups for Cloud SQL via the GCP console.
* Monitor logs through Cloud Logging/Monitoring and Vercel Analytics.

Once the steps above are complete you'll have a production-ready deployment reachable at the Vercel URL gathered in step 3.
