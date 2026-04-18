# WellTrack - Implementation Tasks

## Phase 1: Backend Foundation (Weeks 1–3)

- [x] Initialize Node.js/Express project with TypeScript, ESLint, and folder structure (`routes/`, `controllers/`, `middleware/`, `prisma/`)
- [x] Set up PostgreSQL connection and define Prisma schema for all models: User, Symptom, SymptomLog, MoodLog, Medication, MedicationLog, Habit, HabitLog
- [ ] Write and run database migrations; create seed file for default symptoms (Headache, Fatigue, etc.) and default habits (Sleep Duration, Water Intake, etc.)
- [ ] Implement auth endpoints: `POST /api/auth/register` and `POST /api/auth/login` with bcrypt password hashing and JWT access + refresh token issuance
- [ ] Implement `POST /api/auth/refresh` to validate refresh tokens and issue new access tokens, and `POST /api/auth/logout` to invalidate refresh tokens
- [ ] Implement password reset flow: `POST /api/auth/forgot-password` (sends email token) and `POST /api/auth/reset-password` (validates token, updates hash)
- [ ] Add `authenticate` middleware that validates JWT on protected routes and attaches `req.user`
- [ ] Implement user profile endpoints: `GET /api/users/me`, `PATCH /api/users/me` (name, timezone), `DELETE /api/users/me` (cascade delete all user data)
- [ ] Implement symptom endpoints: `GET /api/symptoms` (system + user's custom), `POST /api/symptoms`, `PATCH /api/symptoms/:id`, `DELETE /api/symptoms/:id`
- [ ] Implement symptom log endpoints: `GET /api/symptom-logs` (with `startDate`, `endDate`, `limit`, `offset` query params), `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Implement mood log endpoints: `GET /api/mood-logs` (with date range params), `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Implement medication endpoints: `GET /api/medications`, `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Implement medication log endpoints: `GET /api/medication-logs` (with date range params), `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Implement habit endpoints: `GET /api/habits` (system + user's custom), `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Implement habit log endpoints: `GET /api/habit-logs` (with date range params), `POST`, `PATCH /:id`, `DELETE /:id`
- [ ] Add request validation middleware using zod (or express-validator) on all POST/PATCH endpoints
- [ ] Add a global error handler that returns consistent `{ error, message }` JSON responses with appropriate HTTP status codes
- [ ] Add database indexes on `(user_id, logged_at)` for all log tables in the Prisma schema

---

## Phase 2: Frontend Foundation (Weeks 4–6)

- [ ] Initialize React + TypeScript app with Vite; install and configure Tailwind CSS with a soft color palette (teal, sage)
- [ ] Set up React Router with a public layout (unauthenticated routes) and a protected layout (redirects to login if no token)
- [ ] Build Register page: email/password form with validation and API integration
- [ ] Build Login page: email/password form, store access token in memory and refresh token in httpOnly cookie (or localStorage with awareness of tradeoffs)
- [ ] Build Forgot Password and Reset Password pages
- [ ] Build auth context and custom hook (`useAuth`) exposing user state, login, logout; add an axios interceptor that auto-refreshes expired tokens
- [ ] Build Dashboard layout: display today's date, streak/days-logged-this-week indicator, and a summary of what has been logged today
- [ ] Build quick-add buttons on Dashboard that open the correct log modal
- [ ] Build Symptom log modal: symptom selector, severity slider (1–10), optional notes, date picker defaulting to now
- [ ] Build Mood log modal: mood score (1–5), optional energy level, stress level, notes, date picker
- [ ] Build Medication log modal: medication selector, taken checkbox, optional taken-at time and notes
- [ ] Build Habit log modal: habit selector, value input that adapts to tracking type (boolean toggle / number input / duration input), optional notes
- [ ] Build reusable `RatingPicker` component (1–5 scale with large tap targets) and `SeveritySlider` component (1–10)
- [ ] Build reusable `DateTimePicker` component that defaults to now and supports selecting past dates for backfilling

---

## Phase 3: Full Features (Weeks 7–9)

- [ ] Build History view: fetch and display log entries grouped by day in a scrollable list
- [ ] Add expand-to-edit behavior on History entries (inline edit form or modal pre-filled with existing data)
- [ ] Add delete confirmation and API call for removing log entries from History
- [ ] Add filter controls on History to show only selected log types (symptoms / mood / meds / habits)
- [ ] Build Trends page with a line chart for symptom severity supporting 7/30/90-day range toggle (use Recharts or Chart.js)
- [ ] Add mood, energy, and stress line charts to the Trends page
- [ ] Build calendar heatmap on Trends page showing which days had logged entries (color-coded by activity level)
- [ ] Build Settings > Symptoms screen: list active symptoms, add custom symptom, toggle hide/show system symptoms, delete custom symptoms
- [ ] Build Settings > Habits screen: list active habits, add custom habit (with tracking type selection), toggle hide/show system habits, delete custom habits
- [ ] Build Settings > Medications screen: add medication (name, dosage, frequency), edit, mark inactive
- [ ] Build Settings > Profile screen: edit display name and timezone (with timezone selector)
- [ ] Implement `GET /api/insights/trends` endpoint that returns aggregated data for a given type and day range
- [ ] Implement `GET /api/export/csv` endpoint that streams a CSV of all user log data for a date range
- [ ] Add Export Data button in Settings that calls the export endpoint and triggers a file download in the browser

---

## Phase 4: Polish & Launch (Weeks 10–12)

- [ ] Responsive layout pass: ensure all screens are usable on mobile viewports (375px+), with large tap targets on rating controls
- [ ] Accessibility audit: add ARIA labels to all icon buttons and rating controls, verify keyboard navigation through forms and modals
- [ ] Write integration tests for the auth flow (register → login → refresh → logout)
- [ ] Write integration tests for each log type's CRUD endpoints (create, read with filters, update, delete)
- [ ] Implement delete account endpoint and UI confirmation flow (type email to confirm, then cascade delete all user data)
- [ ] Deploy backend to Railway or Render: configure environment variables (`DATABASE_URL`, `JWT_SECRET`, `EMAIL_*`), run migrations on deploy
- [ ] Deploy frontend to Vercel: set `VITE_API_BASE_URL` env var pointing to the deployed backend
- [ ] Smoke test all critical flows on production: register, log each type, view history, view trends, export CSV
- [ ] Onboard first beta users: share link, confirm signup works end-to-end
