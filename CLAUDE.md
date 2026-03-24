# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Documentation

All product and design documentation lives in `docs/`. **Always read the relevant doc before implementing a feature.**

| Doc | When to read |
|---|---|
| [`docs/product-overview.md`](./docs/product-overview.md) | Vision, archetypes, user types, stack, roadmap |
| [`docs/prd.md`](./docs/prd.md) | MVP scope, acceptance criteria, Definition of Done |
| [`docs/open-questions.md`](./docs/open-questions.md) | Decisions already made — check before proposing alternatives |
| [`docs/design-system.md`](./docs/design-system.md) | Color tokens, typography, spacing — **visual source of truth** |
| [`docs/navigation.md`](./docs/navigation.md) | Routes, bottom nav, page structure |
| [`docs/data-models.md`](./docs/data-models.md) | TypeScript types for all entities |
| [`docs/landing-page.md`](./docs/landing-page.md) | Landing page brief |
| [`docs/features/onboarding.md`](./docs/features/onboarding.md) | Registration flow, Cypher Identity, edge cases |
| [`docs/features/profile.md`](./docs/features/profile.md) | Own and public profile, edit mode, on-chain, POAPs |
| [`docs/features/hack-spaces.md`](./docs/features/hack-spaces.md) | Main feature — forms, states, UI card |
| [`docs/features/hacker-houses.md`](./docs/features/hacker-houses.md) | Hacker Houses — modalities, flow, UI card |
| [`docs/features/matching-and-feed.md`](./docs/features/matching-and-feed.md) | Matching algorithm, feed, Builder card |
| [`docs/features/notifications.md`](./docs/features/notifications.md) | Notification copy per trigger |

## Skills — detailed rules for implementation

For detailed rules, read the relevant skill before writing code:

| Task | Skill |
|---|---|
| Building any UI component or page | `.claude/skills/ui-components/SKILL.md` |
| Writing any form | `.claude/skills/forms/SKILL.md` |
| Writing service hooks or API routes | `.claude/skills/service-layer/SKILL.md` |
| Implementing a full feature | Use `/implement-feature` |
| Reviewing code | Use `/review-feature` |

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm lint       # Run ESLint
```

## Architecture

**Next.js 16 App Router** — TypeScript strict mode, Tailwind CSS v4, React 19, pnpm.

### Directory layout

- `app/` — App Router routes. `layout.tsx` is the root layout.
- `app/_components/landing/` — Landing page components (route-colocated, not shared).
- `components/ui/` — shadcn/ui component library. **Check here before building any custom UI element.**
- `components/providers/` — Client-side React context providers.
- `lib/` — Shared utilities: `utils.ts`, `supabase.ts`.
- `services/api/` — One file per domain. All data fetching hooks live here.
- `env.ts` — Zod-validated **client-safe** env vars. Never use `process.env` directly in client code.
- `env.server.ts` — Server-only env vars. Only import from API routes or server-side `lib/` files.

### Key tech

- **Tailwind CSS v4** — `@import "tailwindcss"` in `globals.css`, tokens in `@theme` inline.
- **Supabase** — DB only (no auth). Singleton client in `lib/supabase.ts`.
- **Privy** — wallet + email auth. Use `usePrivy` hook in client components.
- **TanStack Query** — server-state in client components.
- **Zod v3** — locked. Do NOT upgrade to v4.
- **react-hook-form 7 + @hookform/resolvers 3** — locked. Do NOT upgrade resolvers to v5.
- Path alias `@/*` maps to the project root.

### Provider hierarchy

```
AppPrivyProvider → QueryProvider → TooltipProvider → {children}
```

`QueryProvider` mounts `ApiAuthSetup` internally — this calls `setTokenGetter(getAccessToken)` once, giving `genericAuthRequest` its auth token.

## Conventions

- **File and folder names** — kebab-case English always. Never Spanish or any other language. No exceptions.
- **TypeScript** — never use `any`. Use `unknown` + narrowing or proper interfaces.
- **Data fetching** — client components never call Supabase directly. Always through `app/api/` routes.
- **Pages** — use `<PageContainer>` from `app/(protected)/dashboard/_components/page-container` as the `<main>` wrapper. No `<header>` blocks in pages.
- **Images** — plain `<img>` tags. `next/image` is not used.
- **Archetypes** — `ARCHETYPES` in `lib/onboarding.ts` has no `emoji` field. Render only `name` and `colorVar`.
