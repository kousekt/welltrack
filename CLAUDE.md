# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WellTrack — a health/wellness tracking REST API. Backend only; no frontend exists yet. All server code lives in `server/`.

## Commands

All commands run from `server/`:

```bash
npm run dev          # start dev server (ts-node, watches src/)
npm run build        # compile TypeScript to dist/
npm run lint         # ESLint on src/
npm test             # all tests
npm run test:unit    # unit tests only (src/__tests__/unit/)
npm run test:integration  # integration tests only
npm run test:coverage
npx jest --testPathPattern=auth  # run a single test file by name pattern
npx tsc --noEmit     # type-check without emitting

# Database (requires running Postgres and DATABASE_URL in .env)
npx prisma migrate dev --name <migration-name>
npx prisma db seed
npx prisma studio    # GUI for browsing data
```

## Architecture

### Layer order

```
Route → validate() middleware → authenticate() middleware → Controller → Prisma → DB
```

- **`src/routes/index.ts`** — `registerRoutes(app)` mounts all 9 routers under `/api/`; called from `app.ts` before the error handler
- **`src/routes/*.routes.ts`** — define method + path + middleware chain for each endpoint
- **`src/controllers/*.controller.ts`** — one file per domain; all use try/catch and call `next(err)` on failure
- **`src/schemas/*.schemas.ts`** — Zod schemas; passed to `validate()` in route definitions
- **`src/lib/validate.ts`** — `validate(schema)` middleware factory; returns 400 with `{ error: 'VALIDATION_ERROR', fields }` on failure
- **`src/middleware/authenticate.ts`** — reads `Authorization: Bearer <token>`, calls `verifyAccessToken`, attaches `req.user`
- **`src/middleware/errorHandler.ts`** — 4-arg Express error handler; maps Prisma P2025 → 404, P2002 → 409, ZodError → 400, default → 500; must remain last middleware in `app.ts`
- **`src/db.ts`** — singleton `PrismaClient` imported by all controllers

### Auth token design

Raw token = `crypto.randomBytes(32).toString('hex')`. Only the SHA-256 hash is stored in the DB (`tokenHash`). On lookup, the incoming raw token is re-hashed and queried by hash. This applies to both `RefreshToken` and `PasswordResetToken` models.

Access tokens live 15 min; refresh tokens 7 days. `logout` sets `isRevoked: true`; `resetPassword` bulk-revokes all refresh tokens for the user.

### System vs. user-owned entities

`Symptom` and `Habit` records with `userId: null` are system defaults visible to all users. Controllers query `{ OR: [{ userId: null }, { userId: req.user.id }] }` on GET. PATCH/DELETE on system records (userId null) returns 403.

### Log ownership

All log controllers verify the parent record belongs to `req.user.id` before creating a log entry (e.g. `symptom.findFirst({ where: { id, OR: [{ userId: null }, { userId }] } })`). Log delete checks `log.userId === req.user.id`, returning 403 otherwise.

## Testing

Tests use Jest + ts-jest + supertest. Prisma is mocked via `jest-mock-extended`.

**Mock pattern** — every integration test file:
```typescript
jest.mock('../../db');                          // replaces db module with __mocks__/db.ts
import prismaMock, { mockReset } from '../../db'; // import the mock instance via the mocked path
beforeEach(() => mockReset(prismaMock));
```

Importing from `'../../__mocks__/db'` directly creates a different module instance and breaks mocking — always import from `'../../db'` after calling `jest.mock`.

**Auth in integration tests** — call `signAccessToken({ id, email })` at module scope to produce a real JWT; pass as `Authorization: Bearer <token>`.

**`src/__tests__/setup.ts`** sets required env vars (`JWT_SECRET`, etc.) via `setupFiles` in `jest.config.ts`. It is not a test file — `testMatch: ['**/__tests__/**/*.test.ts']` excludes it.

**`src/__mocks__/node-crypto.js`** shims `node:crypto` → `crypto` for Node 14 compatibility (supertest's dependency chain uses the `node:` protocol prefix which isn't available until Node 14.18).

## Key constraints

- **Node 14.15.5** — `node:` protocol imports not available; use the `moduleNameMapper` shim in `jest.config.ts` if adding dependencies that use them
- **Prisma 3.15.2** — `findUniqueOrThrow` does not exist; use `findUnique` + explicit null check returning 404
- **`@types/express@5` with Express 4** — `req.params` types include `string[]`; access as `req.params['id'] as string`
- **TypeScript 6 (beta)** — ts-jest warns about unsupported version; suppressed via `diagnostics: false`
