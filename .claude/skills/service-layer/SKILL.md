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

Plain strings in `lib/query-keys.ts`. Always add a key for every new domain.

For entities with both list and single views, add **two keys** — one for the list, one for the single entity:

```ts
export const queryKeys = {
  profile: "profile",
  hackSpaces: "hack-spaces",    // list
  hackSpace: "hack-space",      // single entity
  myDomains: "my-domains",      // list
  myDomain: "my-domain",        // single entity
}
```

Array wrapper goes at the call site: `queryKey: [queryKeys.things]` — never `queryKeys.things.all()`.

## Paginated lists — useInfiniteQuery

For filterable list pages with "load more", use `useInfiniteQuery` directly (NOT wrapped in `useAppQuery`):

```ts
import { useInfiniteQuery } from "@tanstack/react-query"

const PAGE_SIZE = 12

export const useFilteredItems = (filters: ItemListParams) => {
  return useInfiniteQuery<ItemListResponse, Error>({
    queryKey: [queryKeys.items, "filtered", filters],
    queryFn: async ({ pageParam }) => {
      const offset = typeof pageParam === "number" ? pageParam : 0
      return genericAuthRequest<ItemListResponse>("get", "/api/items", {
        ...filters,
        limit: PAGE_SIZE,
        offset,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const fetched = lastPage.offset + lastPage.items.length
      return fetched < lastPage.total ? fetched : undefined
    },
  })
}
```

API response shape for paginated lists:

```ts
// GET /api/items response
{ items: Item[], total: number, offset: number }
```

In the component:

```tsx
const items = data?.pages.flatMap((p) => p.items) ?? []
const total = data?.pages[0]?.total ?? 0
```

## onSuccess: setQueryData vs invalidateQueries

- **`setQueryData`** — when the mutation returns the updated entity (avoids refetch): patch profile, update single item.
- **`invalidateQueries`** — when the mutation changes a list (triggers refetch): create/delete item.

When a mutation affects multiple caches (e.g. accepting an application changes the application list AND the parent entity's member count), invalidate all affected query keys:

```ts
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [queryKeys.hackSpaceApplications, hackSpaceId] })
  queryClient.invalidateQueries({ queryKey: [queryKeys.hackSpace, hackSpaceId] })
  queryClient.invalidateQueries({ queryKey: [queryKeys.hackSpaces] })
}
```

## File upload via FormData

For endpoints that accept file uploads, pass `FormData` directly to `genericAuthRequest`:

```ts
export const useUploadImage = () => {
  return useAppMutation<File, { image_url: string }>({
    fetcher: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      return genericAuthRequest<{ image_url: string }>("post", "/api/domain/upload-image", formData)
    },
  })
}
```

## Nested sub-resource routes

For sub-resources (apply, applications), use nested URL segments:

```ts
// Apply to an entity
POST /api/hack-spaces/${id}/apply

// List sub-resources
GET /api/hack-spaces/${id}/applications

// Update a sub-resource
PATCH /api/hack-spaces/${hackSpaceId}/applications/${appId}
```

## Auth helper — reusable in API routes

Extract Privy auth to a local helper in each route file:

```ts
async function getPrivyUserId(req: NextRequest): Promise<string | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  try {
    const claims = await privy.utils().auth().verifyAccessToken(token)
    return claims.user_id
  } catch {
    return null
  }
}
```

## Rules

1. One file per domain — never split or merge domains across files.
2. Never use raw `fetch` or import axios directly in components.
3. Never create standalone hook files (`hooks/queries/`, `hooks/mutations/`) — hooks live in their service file.
4. Never call `useQuery`/`useMutation` directly — always use `useAppQuery`/`useAppMutation` (except `useInfiniteQuery` for paginated lists).

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
