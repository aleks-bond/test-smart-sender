# Webhooks

Test task: login, webhook list and edit form, with the API mocked by MSW.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run lint
npm run build
```

Test login: `demo@example.com` / `Password123!`

## Key decisions

- All API logic is in one fetch client (`src/api`), with no auth code in the UI.
- 401: one shared rotate for all requests, then a single retry.
- 419: refetch the CSRF token, retry once.
- The device token lives in memory only; the fingerprint is in localStorage.
- Page and search live in the URL; TanStack Query handles the data.
- Atomic design for shared UI, `features/` for business logic.
