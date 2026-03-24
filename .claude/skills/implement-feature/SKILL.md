---
name: implement-feature
description: Implement a new feature end-to-end for Hacker House Protocol. Reads the relevant docs, plans all layers (DB, API, service, UI), and executes. Use when adding any new feature to the app.
---

You are implementing a feature for **Hacker House Protocol** — a Next.js 16 / Supabase / Privy app for Web3 builders.

## Step 1 — Read before writing

Before touching any code, read ALL of these in order:

1. `CLAUDE.md` — architecture, conventions, file naming rules
2. `docs/prd.md` — MVP scope, acceptance criteria, what's OUT of scope
3. `docs/data-models.md` — TypeScript types and Supabase table shapes
4. `docs/navigation.md` — routes and page structure
5. The specific feature doc in `docs/features/<feature>.md` if it exists
6. Existing code most related to what you're building (e.g. if adding Hacker Houses, read `app/hack-spaces/`, `services/api/hack-spaces.ts`, `app/api/hack-spaces/`)

Then load the relevant skills for what you're building:
- **Any UI work** → read `.claude/skills/ui-components/SKILL.md`
- **Any form** → read `.claude/skills/forms/SKILL.md`
- **Any data fetching / API route** → read `.claude/skills/service-layer/SKILL.md`

## Step 2 — Plan all layers

For any non-trivial feature, every layer must be considered:

| Layer | Location | Skill to read |
|---|---|---|
| DB migration | Supabase MCP `apply_migration` | Check existing tables first with `list_tables` |
| Types | `lib/types.ts` | No `any`. Proper union types. |
| Zod schema | `lib/schemas/<domain>.ts` | `forms` skill |
| API routes | `app/api/<domain>/route.ts` | `service-layer` skill |
| Service hooks | `services/api/<domain>.ts` | `service-layer` skill |
| Query keys | `lib/query-keys.ts` | `service-layer` skill |
| UI pages | `app/(protected)/dashboard/<route>/page.tsx` | `ui-components` skill |
| UI components | `app/(protected)/dashboard/<route>/_components/` | `ui-components` skill |

Skip layers that genuinely don't apply. Never skip DB or types if data is involved.

## Step 3 — Implement

**Naming — non-negotiable:**
- All file and folder names: kebab-case, English. Never Spanish or any other language.
- One domain per service file.

**Every page must:**
- Use `<PageContainer>` from `@/app/(protected)/dashboard/_components/page-container` as the `<main>` wrapper
- NOT have a `<header>` block — headers have been removed from all pages

**Security:**
- Every write API route (POST, PATCH, DELETE) must verify the Privy token before any DB operation
- Creator-only operations must check `creator_id === user.id`
- Never reference `process.env` in client code — use `env.ts`

**Key patterns from Hack Spaces (apply to all similar features):**
- Filterable list pages → `useInfiniteQuery` + `nuqs` `useQueryStates` for URL-synced filters + debounced search
- Detail pages → `use(params)` to unwrap the `Promise<{ id }>` param (Next.js 16)
- Query keys → two per domain: list key (`hackSpaces`) and single key (`hackSpace`)
- Paginated list API response shape: `{ items: T[], total: number, offset: number }`
- Status visual config → `STATUS_CONFIG` object mapping status → `{ label, badgeCls, textCls, dotCls, colorVar }`
- Archetype backgrounds → `color-mix(in oklch, var(--token) 10%, transparent)`
- Sub-resource routes → `/api/domain/${id}/apply`, `/api/domain/${id}/sub-resources/${subId}`
- Auth helper in API routes → local `getPrivyUserId(req)` that returns `null` on failure
- Multi-cache invalidation when sub-resource mutations affect the parent entity

## Step 4 — Verify

Run `pnpm build` and fix all TypeScript and lint errors before finishing.

Report: layers touched, files created/modified, decisions made.
