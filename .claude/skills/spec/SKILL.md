---
name: spec
description: Single entry point for any idea — from trivial tweaks to complex features. Evaluates complexity, triages automatically, and routes to the right pipeline. Always use this before doing any work.
user_invocable: true
---

# Skill: spec

The universal entry point for any idea. You evaluate what's needed and route accordingly:

- **Trivial** → execute directly, no spec needed
- **Small** → light spec, then build
- **Complex** → full spec doc, user approval, then build

---

## Step 1 — Parse the idea

The argument is the idea. Extract:
- **Feature name** — kebab-case for files/branches, Title Case for headings
- **Description** — what the user wants

If the argument is too vague (one word, no context), ask ONE clarifying question with AskUserQuestion. Otherwise, proceed.

---

## Step 2 — Read context and evaluate complexity

Read these to understand the current state:

1. `docs/product/prd.md` — MVP scope
2. `docs/product/data-models.md` — existing types and tables
3. `docs/features/` — list existing feature docs
4. The codebase areas most related to the idea (Glob/Grep for relevant files)

Then classify the idea into one of three tiers:

### Tier 1 — Trivial

The idea does NOT need:
- New database table or columns
- New API route
- New page/route
- New service hooks

Examples: change a color, fix text, adjust layout, add a CSS class, rename something.

**Action**: Skip all remaining steps. Just do the change directly — edit the files, done. Output:

```
## Done

**Change**: <what was changed>
**Files**: <list of modified files>
```

### Tier 2 — Small

The idea needs SOME of these but is clearly scoped:
- A few new columns on an existing table
- 1-2 new API routes on an existing domain
- A new component but no new page
- New service hooks on existing patterns

Examples: add bookmarks to Hack Spaces, add a share button with link generation, add tags to profiles.

**Action**: Generate a **light spec** (Step 3b), then auto-launch `/build-feature`.

### Tier 3 — Complex

The idea needs MOST of these:
- New database table(s)
- New API route group (`/api/<new-domain>/`)
- New page(s) or route(s)
- New service module (`services/api/<new>.ts`)
- Multiple UI components
- Interactions with several existing features

Examples: chat system, event check-in with QR, reputation/review system, marketplace.

**Action**: Generate a **full spec** (Step 3c), show to user for approval, then `/build-feature`.

---

## Step 3a — Trivial: Execute directly

Make the change. No spec, no branch, no issue. Just edit the files and report what you did.

---

## Step 3b — Small: Light spec

Write `docs/features/<feature-name>.md` with only these sections:

```markdown
# Feature: <Feature Name> — Hacker House Protocol

> One-line description.

**Status**: Spec written — <today's date>
**Complexity**: Small

---

## Overview

What it does and why.

## Scope (MVP)

### In scope
- Acceptance criteria as bullets

### Out of scope (Phase 2)
- Deferred items (if any)

## Changes needed

- **DB**: <columns to add / "none">
- **API**: <routes to add or modify>
- **UI**: <components or pages affected>
- **Service hooks**: <new hooks needed>

## Notes

- Assumptions
- Related features
```

Then:
1. Create branch `feat/<feature-name>`
2. Commit the spec
3. Tell the user what was classified and why
4. Ask: "Proceed with implementation?" — if yes, invoke `/build-feature <feature name>`

---

## Step 3c — Complex: Full spec

Write `docs/features/<feature-name>.md` with all sections:

```markdown
# Feature: <Feature Name> — Hacker House Protocol

> One-line description of what this feature does and why.

**Status**: Spec written — <today's date>
**Complexity**: Complex

---

## Overview

What this feature does, the problem it solves, and how it fits into the platform.

---

## Scope (MVP)

### In scope
- Acceptance criterion 1
- Acceptance criterion 2

### Out of scope (Phase 2)
- Deferred item 1

---

## Users

Who uses this feature, when, and why. Reference archetypes from `docs/product/overview.md`.

---

## Data Model

Draft TypeScript interfaces — may evolve during planning.

```typescript
interface FeatureEntity {
  id: string;
  // ...fields
  created_at: string;
  updated_at: string;
}
```

### DB columns

| Column | Type | Constraints | Notes |
|---|---|---|---|

---

## Form / Flow

> Remove this section if no user input flow.

### Step 1 — ...
- Field (`db_column`) — type, validation, notes

---

## UI

- Page route: `/dashboard/<feature>`
- Card component: layout, fields shown, actions
- List/grid: filters, pagination, empty state
- Responsive notes

---

## API Routes

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/<feature>` | List all | Yes |
| POST | `/api/<feature>` | Create | Yes |

---

## Service Hooks

| Hook | Description |
|---|---|
| `use<Feature>s()` | Fetch list with filters |
| `useCreate<Feature>()` | Create mutation |

---

## Notes

- Assumptions made
- Open questions
- Related features
```

Then:
1. Create branch `feat/<feature-name>`
2. Commit the spec
3. Show the full spec to the user
4. Ask: "Review the spec. When ready, I'll run `/build-feature` to implement."
5. Wait for user approval before proceeding

---

## Step 4 — Linear issue (Small and Complex only)

After creating the spec, ask:

> Create a Linear issue for tracking?

If yes, use Linear MCP tools:
- **Title**: `<Feature Name>` (no "Spec:" prefix)
- **Description**: Overview + in-scope acceptance criteria
- **Labels**: add `spec` label if it exists

---

## Step 5 — Summary

For Small and Complex tiers, output:

```
## Spec created

**Feature**: <Feature Name>
**Complexity**: Small / Complex
**Spec**: `docs/features/<feature-name>.md`
**Branch**: `feat/<feature-name>`
**Linear**: <issue link or "skipped">

Next: `/build-feature <feature name>`
```
