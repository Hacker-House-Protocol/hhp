# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

All product and design documentation lives in `docs/`. **Always read the relevant doc before implementing a feature or making design decisions.**

| Doc | Cuándo leerlo |
|---|---|
| [`docs/product-overview.md`](./docs/product-overview.md) | Visión general, arquetipos, tipos de usuario, stack, roadmap |
| [`docs/prd.md`](./docs/prd.md) | Scope del MVP, métricas, criterios de aceptación, Definition of Done |
| [`docs/open-questions.md`](./docs/open-questions.md) | Decisiones ya tomadas — consultar antes de proponer alternativas |
| [`docs/design-system.md`](./docs/design-system.md) | Tokens de color, tipografía, espaciado, componentes — **fuente de verdad visual** |
| [`docs/navigation.md`](./docs/navigation.md) | Rutas, bottom nav, estructura de pantallas |
| [`docs/data-models.md`](./docs/data-models.md) | TypeScript types de todas las entidades |
| [`docs/landing-page.md`](./docs/landing-page.md) | Brief completo de la landing page |
| [`docs/features/onboarding.md`](./docs/features/onboarding.md) | Flujo de registro, Cypher Identity, edge cases |
| [`docs/features/hack-spaces.md`](./docs/features/hack-spaces.md) | Feature principal — formularios, estados, UI card |
| [`docs/features/hacker-houses.md`](./docs/features/hacker-houses.md) | Hacker Houses — modalidades, flujo, UI card |
| [`docs/features/matching-and-feed.md`](./docs/features/matching-and-feed.md) | Algoritmo de matching, feed, Builder card, Cypher Identity |
| [`docs/features/notifications.md`](./docs/features/notifications.md) | Copy de notificaciones por trigger |

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
- **shadcn/ui** — components live in `components/ui/`. Add new ones with `pnpm dlx shadcn@latest add <component>`. **Before building a custom UI element, check `components/ui/` first — the component likely already exists.**

### Custom components in `components/ui/`

These are project-specific components built on top of shadcn primitives. **Always use these instead of raw `<input type="date">` or similar natives:**

| Component | Import | Use when |
|---|---|---|
| `DatePicker` | `@/components/ui/date-picker` | Any date field in a form. Accepts `value: string` (ISO `YYYY-MM-DD`), `onChange`, `placeholder`, `fromDate`. Works with react-hook-form `Controller`. |
- **Supabase** — used as DB only (no auth). Client singleton exported from `lib/supabase.ts`.
- **Privy** — wallet + email auth. `AppPrivyProvider` wraps the app in `layout.tsx`. Use the `usePrivy` hook in client components.
- **TanStack Query** — for server-state management in client components.
- **Zod v3** — for schema validation and env config (`env.ts`). Note: Zod v3 (not v4) is installed. Do NOT upgrade to v4 — incompatible with @hookform/resolvers v3.
- **react-hook-form 7 + @hookform/resolvers 3** — for all forms. See Forms section below. Do NOT upgrade resolvers to v5 — incompatible with Zod v3.
- Path alias `@/*` maps to the project root.
- **Archetypes have no emoji** — the `ARCHETYPES` constant in `lib/onboarding.ts` does not include an `emoji` field. Render only `name` and `colorVar`. Do not add emojis back.

### Provider hierarchy (layout.tsx)

```
AppPrivyProvider → QueryProvider → TooltipProvider → {children}
```

`QueryProvider` (`components/providers/query-provider.tsx`) mounts `ApiAuthSetup` internally, which calls `setTokenGetter(getAccessToken)` from Privy once — this is what gives `genericAuthRequest` its auth token without needing hooks.

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

## Data Fetching — Service Module Pattern

All client-side data fetching follows the **Service Module Pattern**: one file per domain in `services/api/`, containing everything related to that domain.

### Building blocks

- **`lib/api-client.ts`** — singleton axios instance. Auth token is injected via `setTokenGetter` (called once from `QueryProvider`). Never import the axios instance directly — always use `genericAuthRequest`.
- **`lib/query-hooks.ts`** — `useAppQuery` and `useAppMutation` wrappers around TanStack Query.
- **`lib/query-keys.ts`** — plain string constants. The array wrapper goes at the call site: `queryKey: [queryKeys.profile]`.

### Service file structure

One file per domain at `services/api/<domain>.ts`. Each file exports plain async functions and hooks — nothing else.

```ts
// services/api/my-domain.ts
"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"

// Plain async function (for one-off calls outside hooks)
export async function getThings(): Promise<Thing[]> {
  const { things } = await genericAuthRequest<{ things: Thing[] }>("get", "/api/things")
  return things
}

// Query hook
export const useThings = () => {
  return useAppQuery<Thing[]>({
    fetcher: async () => {
      const { things } = await genericAuthRequest<{ things: Thing[] }>("get", "/api/things")
      return things
    },
    queryKey: [queryKeys.things],
  })
}

// Mutation hook
export const useCreateThing = () => {
  const queryClient = useQueryClient()
  return useAppMutation<CreateThingInput, Thing>({
    fetcher: async (input) => {
      const { thing } = await genericAuthRequest<{ thing: Thing }>("post", "/api/things", input)
      return thing
    },
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKeys.things] })
      },
    },
  })
}
```

### Rules

1. **One file per domain** — `services/api/profile.ts`, `services/api/hack-spaces.ts`, etc. Never split a domain across multiple files.

2. **Never use raw `fetch` or import axios directly in components** — always go through `genericAuthRequest` inside a service file.

3. **Never create standalone hook files** (`hooks/queries/`, `hooks/mutations/`) — hooks live in their service file.

4. **Query keys are plain strings** in `lib/query-keys.ts`. Wrap in array at the call site:
   ```ts
   // ❌ wrong
   queryKey: queryKeys.profile          // not an array
   queryKey: queryKeys.profile.all()    // not a function

   // ✅ correct
   queryKey: [queryKeys.profile]
   ```

5. **Add the key to `lib/query-keys.ts`** whenever a new domain is created:
   ```ts
   export const queryKeys = {
     profile: "profile",
     hackSpaces: "hack-spaces",
     myNewDomain: "my-new-domain",  // ← add here
   }
   ```

6. **`onSuccess` with `setQueryData` vs `invalidateQueries`**:
   - Use `setQueryData` when the mutation returns the updated entity (avoids a refetch): patch profile, update item.
   - Use `invalidateQueries` when the mutation changes a list (triggers refetch): create/delete item in a list.

## Conventions

- **File and folder names** — always kebab-case **in English** — no exceptions, even when UI copy is in another language (`user-profile.tsx`, `use-auth.ts`, `get-users.ts`, `hack-spaces/create/`). **Never use Spanish or any other language** for file/folder names, even if the UI copy is in Spanish. No exceptions.
- **TypeScript** — never use `any`. Use `unknown` and narrow, or define a proper type/interface.
- **Data fetching** — always go through Next.js API routes (`app/api/**/route.ts`). Client components never call Supabase directly; they fetch from API routes instead.
- **Images** — use plain `<img>` tags. `next/image` is not used in this project (`@next/next/no-img-element` ESLint rule is disabled).
