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

## API route auth pattern — Privy ID → Supabase UUID

**Critical:** `getPrivyUserId` returns the Privy string ID. The DB stores a separate internal UUID in `users.id`. Every write route must do a two-step resolution — verify Privy, then resolve to the internal user:

```ts
export async function POST(req: NextRequest) {
  // Step 1 — verify Privy JWT
  const privyUserId = await getPrivyUserId(req)
  if (!privyUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

  // Step 2 — resolve internal Supabase UUID (never use privyUserId for DB queries)
  const { data: user } = await supabaseServer
    .from("users")
    .select("id")
    .eq("privy_id", privyUserId)
    .single()

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 })

  // From here, use user.id (UUID) for all inserts and ownership checks
}
```

Never use `privyUserId` directly in DB queries — `creator_id`, `applicant_id` etc. store the Supabase UUID, not the Privy string.

## Ownership guard — re-fetch before checking

For PATCH/DELETE on owned resources, always re-fetch the entity to verify ownership. Never trust `creator_id` from the client:

```ts
// Minimal select — only fetch what you need for the guard
const { data: entity } = await supabaseServer
  .from("hack_spaces")
  .select("id, creator_id")
  .eq("id", id)
  .single()

if (!entity) return NextResponse.json({ message: "Not found" }, { status: 404 })
if (entity.creator_id !== user.id) return NextResponse.json({ message: "Forbidden" }, { status: 403 })
```

For mutation routes that also need business logic fields (e.g. checking capacity before accepting), add those to the select: `"id, creator_id, max_team_size, status"`.

## Auto-status promotion on accept

When accepting an application, re-count accepted members and auto-promote the parent entity to `"full"` if capacity is reached. Use `{ count: "exact", head: true }` to avoid fetching rows:

```ts
// After updating application status to "accepted":
const { count } = await supabaseServer
  .from("applications")
  .select("*", { count: "exact", head: true })
  .eq("hack_space_id", hackSpaceId)
  .eq("status", "accepted")

if (count !== null && count >= hackSpace.max_team_size) {
  await supabaseServer
    .from("hack_spaces")
    .update({ status: "full" })
    .eq("id", hackSpaceId)
}
```

## Data enrichment patterns

### List endpoint — bulk post-query enrichment

For list endpoints, do NOT join participants inline (causes N+1). Instead, run one bulk query after the main list, group in JS, then merge:

```ts
async function enrichWithParticipants(spaces: { id: string; creator: Participant }[]) {
  if (!spaces.length) return spaces
  const ids = spaces.map((s) => s.id)

  const { data: apps } = await supabaseServer
    .from("applications")
    .select("hack_space_id, applicant:users!applicant_id(id, handle, archetype, avatar_url)")
    .in("hack_space_id", ids)
    .eq("status", "accepted")

  const bySpace: Record<string, Participant[]> = {}
  for (const app of apps ?? []) {
    const sid = app.hack_space_id as string
    if (!bySpace[sid]) bySpace[sid] = []
    bySpace[sid].push(app.applicant as Participant)
  }

  return spaces.map((hs) => {
    const accepted = bySpace[hs.id] ?? []
    return {
      ...hs,
      participants: [hs.creator, ...accepted].slice(0, 6),
      member_count: accepted.length + 1,  // creator counts as member #1
    }
  })
}
```

### Single entity endpoint — nested join

For single-entity GET, use a nested join and filter in JS. Strip the raw join field before returning:

```ts
const { data } = await supabaseServer
  .from("hack_spaces")
  .select(`
    *,
    creator:users!creator_id(id, handle, archetype, avatar_url),
    all_applications:applications!hack_space_id(
      status,
      applicant:users!applicant_id(id, handle, archetype, avatar_url)
    )
  `)
  .eq("id", id)
  .single()

const participants = (data.all_applications ?? [])
  .filter((a) => a.status === "accepted")
  .map((a) => a.applicant)

const result = {
  ...data,
  participants: [data.creator, ...participants],
  member_count: participants.length + 1,
  all_applications: undefined,  // strip — never expose raw applications to client
}
```

## Supabase select — FK disambiguator

When a table has multiple FK relationships to the same table (e.g. `users` referenced by both `creator_id` and `applicant_id`), PostgREST requires the `!fk_column_name` disambiguator:

```ts
// ❌ ambiguous — PostgREST 400 error
.select("creator:users(id, handle)")

// ✅ correct — explicit FK column
.select("creator:users!creator_id(id, handle, archetype, avatar_url)")
.select("applicant:users!applicant_id(id, handle, archetype, avatar_url)")
```

Always use `!fk_column_name` for any join involving `users` (since both `creator_id` and `applicant_id` point to it).

## has_event — UI-only flag, strip before DB

`has_event` exists only in the form schema. Never add a `has_event` column to the DB. In POST/PATCH routes, destructure it out and use it to null event fields when toggled off:

```ts
const { has_event, ...fields } = parsed.data

const insertData = {
  // ...other fields
  event_name: has_event ? (fields.event_name || null) : null,
  event_url: has_event ? (fields.event_url || null) : null,
  event_start_date: has_event ? (fields.event_start_date || null) : null,
  event_end_date: has_event ? (fields.event_end_date || null) : null,
  event_timing: has_event ? (fields.event_timing ?? null) : null,
}
```

For PATCH, explicitly null all event fields if `has_event === false`:

```ts
if (has_event === false) {
  cleaned.event_name = null
  cleaned.event_url = null
  cleaned.event_start_date = null
  cleaned.event_end_date = null
  cleaned.event_timing = null
}
```

## useProfile — get current user's Supabase ID

To get the current user's internal Supabase UUID on the client, use `useProfile({ enabled: true })`:

```ts
import { useProfile } from "@/services/api/profile"

const { data: profile } = useProfile({ enabled: true })
// profile.id is the Supabase UUID — use this for ownership checks
```

Never use `usePrivy().user.id` for ownership comparisons — that's the Privy string ID, not the DB UUID.

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
