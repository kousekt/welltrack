# WellTrack API Reference

Base URL: `/api`

---

## Auth

### Register
`POST /api/auth/register` — no auth required

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "Jane Doe",
  "timezone": "America/New_York"
}
```

Fields: `email` and `password` (min 8 chars) and `displayName` are required. `timezone` defaults to `"UTC"`.

Response: `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Jane Doe",
    "timezone": "America/New_York"
  },
  "accessToken": "<jwt — expires 15m>",
  "refreshToken": "<opaque hex token — expires 7d>"
}
```

Errors:
- `400` — `{ "error": "VALIDATION_ERROR", "fields": { ... } }` — missing or invalid fields
- `409` — `{ "error": "EMAIL_IN_USE" }` — email already registered
