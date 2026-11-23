# Sightline

Self-hosted AI visibility tracking. See how AI answer engines mention, cite, and describe your brand.

Sightline asks your tracked prompts to ChatGPT, Google AI Mode and AI Overview, Gemini, Perplexity,
Copilot, Claude and other models, then records which brands each answer mentions, which sources it
cites, and how sentiment splits between competitors. A model can be reached two ways: scrape the
consumer surface through a scraping provider (what a real visitor sees), or call a model API directly.

This project began as a copy of [Elmo](https://github.com/elmohq/elmo) (MIT) and is developed
independently under its own name. See [NOTICE.md](NOTICE.md) for provenance and attribution.

## Requirements

- Node.js 24
- pnpm 12
- PostgreSQL 16+

## Quick start

Node 24 is pinned in `.nvmrc`:

```bash
nvm use
pnpm install
```

Copy the environment to both paths. The web app and worker read `apps/web/.env`
(the worker passes it with `--env-file`); repo tooling and migrations read the
root `.env`.

```bash
cp .env.example .env
cp .env.example apps/web/.env
```

Fill in `BETTER_AUTH_SECRET` and `APP_ENCRYPTION_KEY`, each with a fresh
`openssl rand -base64 32`. The default `SCRAPE_TARGETS` uses the stub provider,
so the app boots with no provider accounts.

A database, if you do not already have one:

```bash
docker run -d --name sightline-db -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sightline postgres:17
pnpm --filter @workspace/lib exec drizzle-kit migrate
```

Then:

```bash
pnpm dev                 # web on http://localhost:3000
WEB_PORT=3001 pnpm dev   # when 3000 is already taken
pnpm test
pnpm lint
```

To run the whole stack in Docker instead of from source:

```bash
pnpm sightline init
```

## Layout

- `apps/web` — product dashboard
- `apps/worker` — background jobs: evaluations, citations, reports
- `apps/cli` — Docker Compose deployment CLI
- `packages/lib` — shared logic, database schema and migrations
- `packages/config` — env validation and shared constants
- `packages/deployment` — deployment modes and billing hooks
- `packages/ui` — shared components

## License

MIT — see [LICENSE.md](LICENSE.md). Upstream provenance, copyright and attribution: [NOTICE.md](NOTICE.md).
