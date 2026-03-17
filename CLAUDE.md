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

This is a **Next.js App Router** project using TypeScript, Tailwind CSS v4, and pnpm as the package manager.

- **`app/`** — App Router root. `layout.tsx` is the root layout (fonts, metadata). `page.tsx` is the home route. Add new routes as folders with `page.tsx` files.
- **`public/`** — Static assets served at `/`.
- Path alias `@/*` maps to the project root.

### Key tech details
- Next.js App Router (server components by default — add `"use client"` only when needed)
- Tailwind CSS v4 — configured via `@import "tailwindcss"` in `globals.css`, theme tokens defined with `@theme` inline syntax
- TypeScript strict mode enabled
- Geist font loaded via `next/font/google` in the root layout
