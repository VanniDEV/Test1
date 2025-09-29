# Changelog

## v1.0.0 - Initial release
- Initial marketing platform scaffolding for Django backend and Next.js frontend.
- Zoho CRM integration helpers, RAG publishing services, and ISR-ready marketing pages.
- Deployment-ready configuration for Vercel frontend and Cloud Run backend.

## v1.0.1 - Vercel monorepo support
- Added `vercel.json` so Vercel builds the nested `frontend/` Next.js app without manual configuration.
- Updated documentation to explain the new auto-detection during deployments.

## v1.0.2 - Runtime environment sync
- Replaced the `.env` driven frontend guard with a Vercel API-backed form that sincronizes missing variables desde los secretos de GitHub.
- Added an API route and client helper to push runtime configuration to Vercel directly from the UI.
- Enhanced the GitHub Actions workflow and deployment guide to propagar valores obligatorios sin depender de archivos `.env`.
