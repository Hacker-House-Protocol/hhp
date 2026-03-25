---
name: sync-docs
description: Sync a doc file in docs/ to reflect what is actually implemented in the codebase. Run after implementing a feature or making significant changes to any layer.
---

You are syncing documentation for **Hacker House Protocol**. Your job is to make docs reflect reality — not to redesign or expand them.

## Usage

`/sync-docs <doc-name>`

Examples:
- `/sync-docs navigation` → syncs `docs/navigation.md`
- `/sync-docs hacker-houses` → syncs `docs/features/hacker-houses.md`
- `/sync-docs data-models` → syncs `docs/data-models.md`
- `/sync-docs all` → syncs every doc file

---

## Step 1 — Identify the doc

Map the argument to a file:

| Argument | File |
|---|---|
| `navigation` | `docs/navigation.md` |
| `data-models` | `docs/data-models.md` |
| `hacker-houses` | `docs/features/hacker-houses.md` |
| `hack-spaces` | `docs/features/hack-spaces.md` |
| `onboarding` | `docs/features/onboarding.md` |
| `profile` | `docs/features/profile.md` |
| `matching` | `docs/features/matching-and-feed.md` |
| `notifications` | `docs/features/notifications.md` |
| `design-system` | `docs/design-system.md` |
| `all` | Every file above |

---

## Step 2 — Read the doc and the code

1. Read the full doc file
2. Find and read the relevant code:
   - Pages: `app/(protected)/dashboard/<feature>/`
   - API routes: `app/api/<feature>/`
   - Service hooks: `services/api/<feature>.ts`
   - Types: `lib/types.ts`
   - Schemas: `lib/schemas/`
   - Navigation/layout: `app/(protected)/_components/`, `app/(protected)/layout.tsx`

3. Compare doc vs code. Look for:
   - Routes that exist in code but not in doc
   - Routes in doc that don't exist yet (mark as `— pendiente`)
   - Data model fields that differ (added, removed, renamed)
   - UI components or flows described in doc that work differently in code
   - Features described as future/planned that are now implemented

---

## Step 3 — Update the doc

**Rules:**
- Keep the doc's existing structure, tone, and language (Spanish sections stay in Spanish)
- Only change what is factually wrong or missing — do not rewrite for style
- For things not yet built, add `— pendiente` next to the item instead of removing it
- For things that changed significantly, update the description to match the code
- Add a `## Estado actual` section at the bottom (or update it if it exists) with the date and a brief summary of what changed

**Do NOT:**
- Expand the doc with new sections that weren't there
- Add implementation details that belong in code comments
- Remove planned features — mark them as pending instead
- Change the overall structure of the doc

---

## Step 4 — Report

After updating, output:

```
## Sync: docs/<filename>

**Updated:**
- <what changed and why>

**Marked pending:**
- <items in doc not yet implemented>

**No changes needed:**
- <sections that were already accurate>
```
