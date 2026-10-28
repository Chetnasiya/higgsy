# Higgsy

Higgsy is a Bun/Turborepo workspace with a React frontend and an Express/Prisma
backend. Image generation uses the Google Gemini API; video generation uses
OpenRouter's video API.

## Requirements

- Bun 1.3.11 or newer
- A PostgreSQL database
- A Google AI API key for image generation
- An OpenRouter API key with access to `google/veo-3.1` for video generation

Generation APIs may incur charges. The database and API keys are external
services; they cannot be installed by the package manager.

## Setup

From the project root:

```powershell
bun install
Copy-Item apps\backend\.env.example apps\backend\.env
```

Edit `apps/backend/.env` and set `DATABASE_URL`, `GOOGLE_API_KEY`, and
`OPENROUTER_API_KEY`. The database URL should be a PostgreSQL connection string.
Apply the checked-in migrations from the backend directory:

```powershell
Set-Location apps\backend
bun run db:migrate
Set-Location ..\..
```

## Run

Start both the frontend and backend from the project root:

```powershell
bun run dev
```

The backend listens on port 3000 by default. To run just one app, use
`bun run --filter backend dev` or `bun run --filter bun-react-template dev`.

To build the frontend, run `bun run --filter bun-react-template build`. To
type-check the backend, run `bun run --filter backend check-types`.
