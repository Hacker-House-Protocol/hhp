---
name: service-layer
description: Service module pattern for Hacker House Protocol. Use before writing any data fetching, API routes, or service hooks — covers genericAuthRequest, useAppQuery/useAppMutation, query keys, and API route conventions.
---

# Service Layer — Hacker House Protocol

## Architecture

- **`lib/api-client.ts`** — singleton axios instance. Auth token injected via `setTokenGetter` (called once from `QueryProvider`). Never import axios directly in components.
- **`lib/query-hooks.ts`** — `useAppQuery` and `useAppMutation` wrappers around TanStack Query.
- **`lib/query-keys.ts`** — plain string constants. Array wrapper goes at call site.
- **`services/api/<domain>.ts`** — one file per domain. All hooks and async functions for that domain live here.

## Service file template

```ts
"use client"

import { useQueryClient } from "@tanstack/react-query"
import { genericAuthRequest } from "@/lib/api-client"
import { useAppQuery, useAppMutation } from "@/lib/query-hooks"
import { queryKeys } from "@/lib/query-keys"

// Plain async function — for one-off calls outside hooks
export async function getThings(): Promise<Thing[]> {
  const { things } = await genericAuthRequest<{ things: Thing[] }>("get", "/api/things")
  return things
}

// Query hook
export const useThings = () =>
  useAppQuery<Thing[]>({
    fetcher: async () => {
      const { things } = await genericAuthRequest<{ things: Thing[] }>("get", "/api/things")
      return things
    },
    queryKey: [queryKeys.things],
  })

// Mutation hook
export const useCreateThing = () => {
  const queryClient = useQueryClient()
  return useAppMutation<CreateThingInput, Thing>({
    fetcher: async (input) => {
      const { thing } = await genericAuthRequest<{ thing: Thing }>("post", "/api/things", input)
      return thing
    },
    options: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKeys.things] }),
    },
  })
}
```

## genericAuthRequest rules

- First arg: HTTP method (`"get"`, `"post"`, `"patch"`, `"delete"`)
- Third arg for `GET`: sent as **URL query params** — never interpolate manually:

```ts
// ❌ wrong
genericAuthRequest("get", `/api/things?creator_id=${id}`)

// ✅ correct
genericAuthRequest("get", "/api/things", { creator_id: id })
```

- Third arg for other methods: sent as **request body**.

## Query keys

Plain strings in `lib/query-keys.ts`. Always add a key for every new domain:

```ts
export const queryKeys = {
  profile: "profile",
  hackSpaces: "hack-spaces",
  myNewDomain: "my-new-domain",  // ← add here
}
```

Array wrapper goes at the call site: `queryKey: [queryKeys.things]` — never `queryKeys.things.all()`.

## onSuccess: setQueryData vs invalidateQueries

- **`setQueryData`** — when the mutation returns the updated entity (avoids refetch): patch profile, update single item.
- **`invalidateQueries`** — when the mutation changes a list (triggers refetch): create/delete item.

## Rules

1. One file per domain — never split or merge domains across files.
2. Never use raw `fetch` or import axios directly in components.
3. Never create standalone hook files (`hooks/queries/`, `hooks/mutations/`) — hooks live in their service file.
4. Never call `useQuery`/`useMutation` directly — always use `useAppQuery`/`useAppMutation`.

## API route conventions (`app/api/<domain>/route.ts`)

**Auth — every write operation must verify the Privy token first:**

```ts
const token = req.headers.get("authorization")?.replace("Bearer ", "")
const { userId } = await privy.utils().auth().verifyAccessToken(token!)
```

**Response shapes:**

```ts
// Error
return NextResponse.json({ message: "Not authorized" }, { status: 401 })

// Success — return domain object
return NextResponse.json({ hack_space: data })
return NextResponse.json({ application: data })
```

**Client components never call Supabase directly** — only through `app/api/` routes. Supabase client only in `app/api/` and `lib/`.
