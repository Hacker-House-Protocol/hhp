---
name: forms
description: Form implementation rules for Hacker House Protocol. Use before writing any form — covers react-hook-form + Zod patterns, field wrappers, validation, and common bugs.
---

# Forms — Hacker House Protocol

All forms use **react-hook-form 7** + **@hookform/resolvers 3** + **Zod v3**.

> ⚠️ Version lock: Do NOT upgrade resolvers to v5 or Zod to v4 — intentionally locked, incompatible.

## Schema rules

Schemas always go in `lib/schemas/<domain>.ts`. Never inline `z.object()` in a component or page. Export both schema and inferred type:

```ts
export const mySchema = z.object({ ... })
export type MyInput = z.infer<typeof mySchema>
```

**Never use `.default()` on Zod fields used with `useForm`** — it splits Zod's input/output types and breaks the `Resolver` type:

```ts
// ❌ breaks resolver typing
skills: z.array(z.string()).default([])

// ✅ correct — put defaults in useForm defaultValues
skills: z.array(z.string()).optional()
```

## useForm setup

Always pass the type generic explicitly:

```ts
import { mySchema, type MyInput } from "@/lib/schemas/my-domain"

const { control, handleSubmit, formState } = useForm<MyInput>({
  resolver: zodResolver(mySchema),
  defaultValues: { skills: [], bio: "" },
})
```

## Field pattern — always use Controller + Field wrapper

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

`aria-invalid={fieldState.invalid}` is required on every `Input` and `Textarea` — triggers error styles.

## Watching field values — useWatch, never watch()

```tsx
// ❌ wrong — causes stale UI (React Compiler warning)
const { watch } = useForm<MyInput>()
const value = watch("fieldName")

// ✅ correct
import { useWatch } from "react-hook-form"
const value = useWatch({ control, name: "fieldName" })
```

## Optional array fields — always nullish coalesce

When a field is `.optional()`, `field.value` is `T[] | undefined`. Never call array methods directly:

```ts
// ❌ crashes at runtime
const selected = field.value.includes(item)

// ✅ correct
const value = field.value ?? []
const selected = value.includes(item)
```

## Submit button

Use `formState.isSubmitting` — never manual loading state:

```tsx
<Button type="submit" disabled={formState.isSubmitting}>
  {formState.isSubmitting ? <><Spinner className="mr-2" /> Saving...</> : "Save →"}
</Button>
```

## Button types inside forms

Every `<button>` or `<Button>` inside a `<form>` that is NOT the submit button must have `type="button"`:

```tsx
<Button type="button" onClick={onCancel}>Cancel</Button>
<Button type="submit">Save</Button>
```

## Server errors

Server-side errors (e.g. "handle already taken") go into local `useState`, not react-hook-form. Display near the relevant field or at the bottom:

```tsx
const [serverError, setServerError] = useState<string | null>(null)

// In onSubmit catch:
setServerError(err instanceof Error ? err.message : "Something went wrong")

// In JSX:
{serverError && (
  <p className="text-sm font-mono text-destructive border border-destructive/30 rounded-lg px-4 py-2.5 bg-destructive/5">
    {serverError}
  </p>
)}
```

## Date fields

Always use `DatePicker` from `@/components/ui/date-picker` — never `<Input type="date">`:

```tsx
<Controller
  name="deadline"
  control={control}
  render={({ field }) => (
    <Field>
      <FieldLabel>Deadline</FieldLabel>
      <DatePicker
        value={field.value ?? ""}
        onChange={field.onChange}
        placeholder="Pick a date"
      />
    </Field>
  )}
/>
```
