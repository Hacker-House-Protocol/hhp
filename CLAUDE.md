# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Run production build
pnpm lint       # Run ESLint
```

## Architecture

**Next.js 16 App Router** project — TypeScript strict mode, Tailwind CSS v4, React 19, pnpm.

### Directory layout

- **`app/`** — App Router routes. `layout.tsx` is the root layout (fonts, providers, metadata).
- **`app/_components/landing/`** — Route-colocated components for the landing page (not shared). Underscore prefix keeps them out of the routing system.
- **`components/ui/`** — shadcn/ui component library (radix-ui primitives + CVA).
- **`components/providers/`** — Client-side React context providers (e.g. `privy-provider.tsx`).
- **`lib/`** — Shared utilities: `utils.ts` (cn helper), `supabase.ts` (singleton Supabase client).
- **`env.ts`** — Zod-validated environment variables. **Always import env vars from here, never from `process.env` directly.**

### Key tech details

- **Tailwind CSS v4** — configured via `@import "tailwindcss"` in `globals.css`, theme tokens defined with `@theme` inline syntax.
- **shadcn/ui** — components live in `components/ui/`. Add new ones with `pnpm dlx shadcn@latest add <component>`.
- **Supabase** — used as DB only (no auth). Client singleton exported from `lib/supabase.ts`.
- **Privy** — wallet + email auth. `AppPrivyProvider` wraps the app in `layout.tsx`. Use the `usePrivy` hook in client components.
- **TanStack Query** — for server-state management in client components.
- **Zod** — for schema validation and env config (`env.ts`).
- Path alias `@/*` maps to the project root.

### Provider hierarchy (layout.tsx)

```
AppPrivyProvider → TooltipProvider → {children}
```

### Environment variables

- **`env.ts`** — client-safe vars (`NEXT_PUBLIC_*` only). Safe to import anywhere.
- **`env.server.ts`** — server-only vars (no `NEXT_PUBLIC_` prefix). Only import from API routes, server components, or `lib/` files used server-side.

Add new vars to the appropriate file and to `.env.local`.

## Conventions

- **File names** — always kebab-case (`user-profile.tsx`, `use-auth.ts`, `get-users.ts`). No exceptions.
- **TypeScript** — never use `any`. Use `unknown` and narrow, or define a proper type/interface.
- **Data fetching** — always go through Next.js API routes (`app/api/**/route.ts`). Client components never call Supabase directly; they fetch from API routes instead.
- **Images** — use plain `<img>` tags. `next/image` is not used in this project (`@next/next/no-img-element` ESLint rule is disabled).
