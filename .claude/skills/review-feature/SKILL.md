---
name: review-feature
description: Review code written for a new feature in Hacker House Protocol. Checks conventions, types, form rules, design system usage, security, and common bugs. Run after implement-feature or any significant code change.
---

You are reviewing code for **Hacker House Protocol**. Catch real bugs and convention violations — not style preferences or unnecessary refactors.

## Step 1 — Gather context

1. Read `CLAUDE.md`
2. Read `.claude/skills/ui-components/SKILL.md`
3. Read `.claude/skills/forms/SKILL.md`
4. Read `.claude/skills/service-layer/SKILL.md`
5. Read the files being reviewed in full (default: `git diff HEAD`)
6. Run `pnpm build` to catch TypeScript errors

## Step 2 — Checklist

Report only actual violations — skip items that pass.

### Naming & structure
- [ ] File and folder names are kebab-case English (no Spanish, no camelCase folders)
- [ ] Service files: one domain per file
- [ ] No standalone hook files outside service files
- [ ] New query keys added to `lib/query-keys.ts`
- [ ] Pages use `<PageContainer>` — no inline `max-w-* mx-auto px-* py-*` on `<main>`
- [ ] No `<header>` blocks in pages

### TypeScript
- [ ] No `any` — use `unknown` + narrowing or proper interfaces
- [ ] New entities typed in `lib/types.ts`
- [ ] Zod schemas in `lib/schemas/` — none inlined in components or pages
- [ ] Both schema and inferred type exported from schema files

### Forms
- [ ] No `.default()` on Zod fields used with `useForm`
- [ ] Every non-submit `<button>` inside `<form>` has `type="button"`
- [ ] Date fields use `DatePicker` — never `<Input type="date">`
- [ ] Optional array fields use `field.value ?? []` before `.includes()` / `.filter()` / spread
- [ ] `useForm<T>` has type generic passed explicitly
- [ ] `useWatch` used — never `watch()` from `useForm`

### API routes
- [ ] Every write route (POST, PATCH, DELETE) verifies Privy token before DB access
- [ ] Error responses: `{ message: "..." }` shape
- [ ] Success responses: domain object shape (`{ thing: data }`)
- [ ] No Supabase client imported in client components

### Service layer
- [ ] `genericAuthRequest` used — no raw `fetch` or imported axios in components
- [ ] `useAppQuery` / `useAppMutation` used — no raw `useQuery`/`useMutation`
- [ ] GET params passed as object, never interpolated in URL string
- [ ] `setQueryData` for single-entity mutations, `invalidateQueries` for list mutations

### UI / Design system
- [ ] No hardcoded hex/rgb — only CSS variable tokens (`var(--primary)`, etc.)
- [ ] No light mode classes
- [ ] Archetypes render only `name` — no `.emoji` access
- [ ] `Card` used instead of manual `<div className="bg-card border...rounded-xl">`
- [ ] `Separator` used instead of manual `h-px` dividers
- [ ] `Badge` used instead of manual `<span>` chips

### Security
- [ ] No SQL injection — all DB queries use Supabase parameterized methods
- [ ] No `process.env` in client code — use `env.ts`
- [ ] Creator-only operations check `creator_id === user.id`

## Step 3 — Report

---
### Review: <feature name>

**🔴 Bugs** (must fix — will break at runtime)
- `file:line` — description

**🟡 Violations** (convention breaks)
- `file:line` — description

**🟢 Passed** — sections with no issues

**Verdict**: PASS / NEEDS FIXES

---

If there are 🔴 bugs, fix them immediately. If only 🟡 violations, ask the user.
