# Backend

See the project [setup instructions](../../README.md) for installing workspace
dependencies and configuring PostgreSQL and image/video API keys.

From the project root, run `bun run --filter backend dev` to start the backend.
The development command generates the Prisma client before starting the server.
Run `bun run db:migrate` from this directory after configuring `DATABASE_URL`
to apply database migrations.
