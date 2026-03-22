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
- **Zod v3** — for schema validation and env config (`env.ts`). Note: Zod v3 (not v4) is installed. Do NOT upgrade to v4 — incompatible with @hookform/resolvers v3.
- **react-hook-form 7 + @hookform/resolvers 3** — for all forms. See Forms section below. Do NOT upgrade resolvers to v5 — incompatible with Zod v3.
- Path alias `@/*` maps to the project root.

### Provider hierarchy (layout.tsx)

```
AppPrivyProvider → TooltipProvider → {children}
```

### Environment variables

- **`env.ts`** — client-safe vars (`NEXT_PUBLIC_*` only). Safe to import anywhere.
- **`env.server.ts`** — server-only vars (no `NEXT_PUBLIC_` prefix). Only import from API routes, server components, or `lib/` files used server-side.

Add new vars to the appropriate file and to `.env.local`.

## Forms

All forms use **react-hook-form 7** + **@hookform/resolvers 3** + **Zod v3**.
Do NOT upgrade resolvers to v5 or Zod to v4 — they are version-locked intentionally.

### Rules

1. **Schemas always in `lib/schemas/`** — never inline a `z.object()` in a component or page. One file per domain. Export both schema and inferred type:
   ```ts
   // lib/schemas/my-domain.ts
   export const mySchema = z.object({ ... })
   export type MyInput = z.infer<typeof mySchema>
   ```

2. **Always pass the type generic to `useForm`** — use the exported type, never omit it:
   ```ts
   import { mySchema, type MyInput } from "@/lib/schemas/my-domain"

   const { control, handleSubmit } = useForm<MyInput>({
     resolver: zodResolver(mySchema),
     defaultValues: { ... },
   })
   ```

3. **Never use `.default()` in form schemas** — `z.default()` splits Zod's input/output types causing a `Resolver` type mismatch. Put defaults in `defaultValues` instead:
   ```ts
   // ❌ breaks resolver typing
   skills: z.array(z.string()).default([])

   // ✅ correct
   skills: z.array(z.string()).optional()
   // + in useForm: defaultValues: { skills: [] }
   ```

4. **Optional array fields: always use `field.value ?? []`** — when a field is `.optional()` in the schema, `field.value` is `string[] | undefined`. Never call `.includes()`, `.filter()`, or spread directly on it:
   ```ts
   // ❌ crashes — field.value is possibly undefined
   const selected = field.value.includes(item)

   // ✅ correct
   const value = field.value ?? []
   const selected = value.includes(item)
   ```

5. **Always use `Controller`** with shadcn `Field` components for every input:
   ```tsx
   <Controller
     name="fieldName"
     control={control}
     render={({ field, fieldState }) => (
       <Field data-invalid={fieldState.invalid}>
         <FieldLabel htmlFor={field.name}>Label</FieldLabel>
         <Input
           {...field}
           id={field.name}
           aria-invalid={fieldState.invalid}
           placeholder="..."
         />
         <FieldDescription>Helper text.</FieldDescription>
         {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
       </Field>
     )}
   />
   ```

6. **`aria-invalid={fieldState.invalid}`** on every `Input` and `Textarea` — triggers error styles automatically via shadcn.

7. **`isSubmitting` from `formState`** replaces manual loading state for submit buttons.

8. **Server errors** (e.g. "handle already taken") go into local `useState`, not react-hook-form — display them near the relevant field or at the bottom of the form.

## Conventions

- **File names** — always kebab-case (`user-profile.tsx`, `use-auth.ts`, `get-users.ts`). No exceptions.
- **TypeScript** — never use `any`. Use `unknown` and narrow, or define a proper type/interface.
- **Data fetching** — always go through Next.js API routes (`app/api/**/route.ts`). Client components never call Supabase directly; they fetch from API routes instead.
- **Images** — use plain `<img>` tags. `next/image` is not used in this project (`@next/next/no-img-element` ESLint rule is disabled).
