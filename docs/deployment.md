# Adventa Deployment Checklist

## Required Accounts

- Supabase project
- Vercel project

## Environment Variables

Set these locally and in Vercel:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
DATA_SOURCE_MODE="database"
NEXT_PUBLIC_APP_URL="https://your-vercel-url.vercel.app"
OPERATOR_SESSION_SECRET="<random-32+-char-string>"
```

`DIRECT_URL` is required by Supabase/Prisma workflows that need a direct database connection.

`OPERATOR_SESSION_SECRET` signs the operator dashboard cookie. If unset, a known dev
fallback is used (insecure) — always set a real value before deploying.

> Without a real `DATABASE_URL`, the app runs entirely on the bundled in-memory
> dataset (`DATA_SOURCE_MODE="auto"` downgrades a placeholder URL to memory).

## Database Setup

Run after `DATABASE_URL` is configured:

```bash
npm run db:push
npm run db:seed
```

## Local Production Verification

```bash
npm run db:generate
npm run build
npm run start
```

Verify:

```text
Plan (or Discover)
→ Best Match recommendation
→ Book
→ Confirm
→ Operator dashboard inventory/revenue update
```

## Vercel Verification

After deploy, open production URL and verify:

```text
/
/plan?duration=weekend&budget=5000&vibe=nature&origin=Pune
/operator/login
```

Then book an adventure and refresh the operator dashboard.

## Demo Route

Use `docs/demo-script.md` as the source of truth for the judging flow.
