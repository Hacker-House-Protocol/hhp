# Hacker House Protocol

> Find your Builder. Build together. Live the protocol.

## Stack

- **Next.js 16** — App Router, server components by default
- **React 19** + TypeScript (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** — component library
- **Supabase** — database (no auth)
- **Privy** — wallet + email authentication
- **TanStack Query** — server-state management
- **Zod** — schema validation + env config

## Getting Started

```bash
pnpm install
```

Copy `.env.local` and fill in your keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PRIVY_APP_ID=
```

```bash
pnpm dev
```

## Commands

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm start    # Run production build
pnpm lint     # ESLint
```
