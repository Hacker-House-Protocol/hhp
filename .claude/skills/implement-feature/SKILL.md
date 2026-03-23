---
name: implement-feature
description: Implement a new feature end-to-end for Hacker House Protocol. Reads the relevant docs, plans all layers (DB, API, service, UI), and executes. Use when adding any new feature to the app.
---

You are implementing a feature for **Hacker House Protocol** — a Next.js 16 / Supabase / Privy app for Web3 builders.

## Step 1 — Read before writing

Before touching any code, read ALL of these in order:

1. `CLAUDE.md` — conventions, rules, form patterns, service module pattern
2. `docs/prd.md` — MVP scope, acceptance criteria, what's OUT of scope
3. `docs/data-models.md` — TypeScript types and Supabase table shapes
4. `docs/design-system.md` — color tokens, typography, component rules
5. `docs/navigation.md` — routes and page structure
6. The specific feature doc in `docs/features/<feature>.md` if it exists

Then read the existing code most related to what you're building (e.g. if adding Hacker Houses, read all of `app/hack-spaces/`, `services/api/hack-spaces.ts`, `app/api/hack-spaces/`).

## Step 2 — Plan all layers

For any non-trivial feature, every layer must be considered:

| Layer | Location | Notes |
|---|---|---|
| DB migration | Supabase MCP `apply_migration` | Always check existing tables first with `list_tables` |
| Types | `lib/types.ts` | No `any`. Use proper union types |
| Zod schema | `lib/schemas/<domain>.ts` | Export schema + inferred type. No `.default()` in form schemas |
| API routes | `app/api/<domain>/route.ts` | Always verify auth via Privy token before writing to DB |
| Service hooks | `services/api/<domain>.ts` | Follow Service Module Pattern from CLAUDE.md |
| Query keys | `lib/query-keys.ts` | Add key for every new domain |
| UI pages | `app/<route>/page.tsx` | Follow navigation.md for route names — always English |
| UI components | `app/<route>/_components/` | Colocated, kebab-case, English names |

Skip layers that genuinely don't apply. Never skip the DB or types layer if data is involved.

## Step 3 — Implement

Follow these rules without exception:

**Naming**
- All file and folder names: kebab-case, English. Never Spanish or any other language.
- One domain per service file. Never split or merge domains.

**Forms**
- All forms: react-hook-form + zodResolver + Zod v3 (NOT v4)
- Every `<button>` inside a `<form>` needs explicit `type="button"` unless it's the submit button
- When swapping between a navigation button and a submit button at the same DOM position, add distinct `key` props to prevent browser auto-submit on re-render
- Use `DatePicker` from `@/components/ui/date-picker` for ALL date fields — never `<Input type="date">`
- No `.default()` in Zod schemas used with react-hook-form. Use `defaultValues` in `useForm` instead

**Design system**
- Always dark. Never add a light mode class.
- Use CSS variable tokens: `var(--primary)`, `var(--card)`, `var(--border)`, `var(--muted-foreground)`, etc.
- Archetype colors: `var(--visionary)`, `var(--strategist)`, `var(--builder-archetype)`
- Archetypes have NO emoji field — render only `name` and `colorVar`
- `font-display` for headings, `font-mono` for labels/metadata/badges, default sans for body

**API routes**
- Always call `privy.utils().auth().verifyAccessToken(token)` before any write operation
- Return `{ message: "..." }` for errors, domain object for success: `{ hack_space: data }`

**Data fetching**
- Client components never call Supabase directly — always through `app/api/` routes
- Use `genericAuthRequest` inside service files, never raw fetch or axios in components

## Step 4 — Verify

After implementing, run `pnpm build` and fix any TypeScript or lint errors before finishing.

Report what was built: layers touched, files created/modified, any decisions made.
