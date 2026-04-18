# WellTrack

REST API for symptom and wellness tracking. Built with Node.js, Express, TypeScript, PostgreSQL, and Prisma.

## Prerequisites

- Node.js 14+
- Docker (for the database)

## Quick Start

**1. Start the database**
```bash
docker-compose up -d
```

**2. Install dependencies**
```bash
cd server && npm install
```

**3. Configure environment**
```bash
cp .env.example .env   # then fill in values
```

**4. Run migrations**
```bash
cd server && npx prisma migrate dev
```

**5. Start the dev server**
```bash
npm run dev
```

The API is available at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://welltrack:welltrack@localhost:5432/welltrack` |
| `JWT_SECRET` | Secret for signing access tokens | any long random string |
| `JWT_EXPIRES_IN` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens | any long random string |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `PORT` | Port to listen on (optional) | `3000` |

## Scripts

All commands run from `server/`:

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server |
| `npm test` | Run all tests |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | Run ESLint |

## API

See [docs/api.md](docs/api.md) for the full endpoint reference.
