---
name: review-feature
description: Review code written for a new feature in Hacker House Protocol. Checks conventions, types, form rules, design system usage, security, and common bugs. Run after implement-feature or any significant code change.
---

You are reviewing code for **Hacker House Protocol**. Your job is to catch real bugs and convention violations — not suggest style preferences or unnecessary refactors.

## What to review

The user will tell you which files or feature to review. If not specified, review all files modified since the last commit (`git diff HEAD`).

## Step 1 — Gather context

1. Read `CLAUDE.md` to load all project rules
2. Read the files being reviewed in full
3. Run `pnpm build` to catch TypeScript errors

## Step 2 — Checklist

Go through every item. Report only actual violations found — skip items that pass.

### Naming & structure
- [ ] All file and folder names are kebab-case **English** (no Spanish, no camelCase folders)
- [ ] Service files follow one-domain-per-file rule
- [ ] No standalone hook files outside service files (`hooks/queries/` etc. don't exist)
- [ ] New query keys added to `lib/query-keys.ts`

### TypeScript
- [ ] No `any` types — use `unknown` + narrowing, or proper interfaces
- [ ] New entities have types defined in `lib/types.ts`
- [ ] Zod schemas live in `lib/schemas/` — none inlined in components or pages
- [ ] Both schema and inferred type are exported from schema files

### Forms (react-hook-form)
- [ ] No `.default()` on Zod fields used with `useForm` — defaults go in `defaultValues`
- [ ] Every `<button>` inside a `<form>` has explicit `type="button"` unless it IS the submit button
- [ ] Navigation/submit buttons that swap at the same DOM position have distinct `key` props
- [ ] Date fields use `DatePicker` from `@/components/ui/date-picker` — never `<Input type="date">`
- [ ] Optional array fields use `field.value ?? []` before calling `.includes()`, `.filter()`, or spread
- [ ] `useForm<T>` always has the type generic passed explicitly

### API routes
- [ ] Every write route (POST, PATCH, DELETE) verifies the Privy token before DB access
- [ ] Error responses return `{ message: "..." }` shape
- [ ] Success responses return the domain object: `{ hack_space: data }`, `{ application: data }`, etc.
- [ ] No Supabase client imported in client components — only in `app/api/` and `lib/`

### Service layer
- [ ] `genericAuthRequest` used for all fetches — no raw `fetch` or imported axios in components
- [ ] `useAppQuery` / `useAppMutation` used — no raw `useQuery`/`useMutation` in service files
- [ ] `onSuccess` uses `setQueryData` for single-entity mutations, `invalidateQueries` for list mutations

### Design system
- [ ] No hardcoded hex/rgb colors — only CSS variable tokens (`var(--primary)`, etc.)
- [ ] No light mode classes or `light:` variants
- [ ] Archetype badges render only `name` — no `emoji` field access (it doesn't exist)
- [ ] `font-display` on headings, `font-mono` on labels/metadata/badges

### Security
- [ ] No SQL injections — all DB queries use Supabase parameterized methods
- [ ] No secrets or env vars referenced directly from `process.env` in client code — use `env.ts`
- [ ] Creator-only operations check `creator_id === user.id` before executing

## Step 3 — Report

Format your report as:

---
### Review: <feature name>

**🔴 Bugs** (must fix — will break at runtime)
- `file:line` — description

**🟡 Violations** (convention breaks from CLAUDE.md)
- `file:line` — description

**🟢 Passed** — list the checklist sections that had no issues

**Verdict**: PASS / NEEDS FIXES
---

If there are 🔴 bugs, fix them immediately after the report without waiting. If only 🟡 violations, ask the user if they want them fixed.
