---
name: forms
description: Form implementation rules for Hacker House Protocol. Use before writing any form — covers react-hook-form + Zod patterns, field wrappers, validation, multi-step wizards, toggle pills, and common bugs.
---

# Forms — Hacker House Protocol

All forms use **react-hook-form 7** + **@hookform/resolvers 3** + **Zod v3**.

> Version lock: Do NOT upgrade resolvers to v5 or Zod to v4 — intentionally locked, incompatible.

---

## Architecture — pure presentation forms

Forms are **pure presentation components**. They receive data and callbacks — they never own mutations or API calls.

```tsx
// ✅ Form component — presentation only
interface MyFormProps {
  defaultValues?: Partial<MyInput>
  onFormSubmit: (values: MyInput) => Promise<void>
  submitLabel: string
  submittingLabel: string
}

export function MyForm({ defaultValues, onFormSubmit, submitLabel, submittingLabel }: MyFormProps) {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<MyInput>({
    resolver: zodResolver(mySchema),
    defaultValues: { field: "", ...defaultValues },
  })

  async function onSubmit(values: MyInput) {
    try {
      await onFormSubmit(values)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong"
      toast.error(message)
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

```tsx
// ✅ Page component — owns the mutation
export default function CreateThingPage() {
  const router = useRouter()
  const createThing = useCreateThing()

  async function handleSubmit(values: MyInput) {
    const result = await createThing.mutateAsync(values)
    toast.success("Thing created")
    router.push(`/dashboard/things/${result.id}`)
  }

  return <MyForm onFormSubmit={handleSubmit} submitLabel="Create →" submittingLabel="Creating..." />
}
```

This pattern lets one form component serve both create and edit pages — each page passes its own mutation via `onFormSubmit`.

---

## Schema rules

Schemas always go in `lib/schemas/<domain>.ts`. Never inline `z.object()` in a component or page. Export both schema and inferred type:

```ts
export const mySchema = z.object({ ... })
export type MyInput = z.infer<typeof mySchema>
```

For update schemas, use `.partial()` on the create schema:

```ts
export const updateMySchema = mySchema.partial().extend({
  status: z.enum(["open", "closed"]).optional(),
})
export type UpdateMyInput = z.infer<typeof updateMySchema>
```

**Never use `.default()` on Zod fields used with `useForm`** — it splits Zod's input/output types and breaks the `Resolver` type:

```ts
// ❌ breaks resolver typing
skills: z.array(z.string()).default([])

// ✅ correct — put defaults in useForm defaultValues
skills: z.array(z.string()).optional()
```

---

## useForm setup

Always pass the type generic explicitly:

```ts
import { mySchema, type MyInput } from "@/lib/schemas/my-domain"

const { control, handleSubmit, formState } = useForm<MyInput>({
  resolver: zodResolver(mySchema),
  defaultValues: { skills: [], bio: "", ...defaultValues },
})
```

---

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

---

## Textarea with character count

```tsx
<Controller
  name="description"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Description *</FieldLabel>
      <Textarea
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="..."
        maxLength={500}
        rows={4}
        className="resize-none"
      />
      <FieldDescription>{(field.value ?? "").length}/500</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Watching field values — useWatch, never watch()

```tsx
// ❌ wrong — causes stale UI (React Compiler warning)
const { watch } = useForm<MyInput>()
const value = watch("fieldName")

// ✅ correct
import { useWatch } from "react-hook-form"
const value = useWatch({ control, name: "fieldName" })
```

---

## Optional array fields — always nullish coalesce

When a field is `.optional()`, `field.value` is `T[] | undefined`. Never call array methods directly:

```ts
// ❌ crashes at runtime
const selected = field.value.includes(item)

// ✅ correct
const value = field.value ?? []
const selected = value.includes(item)
```

---

## Toggle pill — single select

For enum-like single-select fields, use `TogglePill` buttons. Define the pill component once per form file (colocated, not shared):

```tsx
function TogglePill({
  selected, onClick, children, className,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-xs px-3 py-1.5 rounded-md border font-mono transition-all cursor-pointer",
        selected
          ? "border-primary text-primary bg-primary/10"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      {children}
    </button>
  )
}
```

Usage for single select:

```tsx
<Controller
  name="stage"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Stage *</FieldLabel>
      <div className="flex gap-2 flex-wrap">
        {STAGES.map((s) => (
          <TogglePill key={s} selected={field.value === s} onClick={() => field.onChange(s)}>
            {STAGE_LABELS[s]}
          </TogglePill>
        ))}
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Toggle pill — multi select (array fields)

For multi-select arrays, use the same `TogglePill` with array toggle logic:

```tsx
<Controller
  name="skills_needed"
  control={control}
  render={({ field }) => {
    const value = field.value ?? []
    return (
      <Field>
        <FieldLabel>Skills needed</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => {
            const selected = value.includes(skill)
            return (
              <TogglePill
                key={skill}
                selected={selected}
                onClick={() =>
                  field.onChange(selected ? value.filter((s) => s !== skill) : [...value, skill])
                }
              >
                {selected ? "✓ " : ""}{skill}
              </TogglePill>
            )
          })}
        </div>
      </Field>
    )
  }}
/>
```

Alternative: use `<Button>` with `variant` for toggles when you need archetype-colored or themed pills:

```tsx
<Button
  type="button"
  size="sm"
  variant={isSelected ? archetypeVariants.filled : archetypeVariants.outline}
  onClick={() => toggleItem(item)}
  className="rounded-md font-mono"
>
  {isSelected ? "✓ " : ""}{item}
</Button>
```

---

## Number selector buttons

For numeric fields with a discrete set of values:

```tsx
<Controller
  name="max_team_size"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Max team size *</FieldLabel>
      <div className="flex gap-2">
        {[2, 3, 4, 5, 6, 8, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => field.onChange(n)}
            className={cn(
              "w-10 h-9 rounded-md border font-mono text-sm transition-all cursor-pointer",
              field.value === n
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## RadioGroup card pattern

For exclusive selection with descriptions (e.g. application type):

```tsx
<Controller
  name="application_type"
  control={control}
  render={({ field }) => (
    <Field>
      <FieldLabel>Application type *</FieldLabel>
      <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-2">
        {APPLICATION_TYPES.map((t) => (
          <label
            key={t}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
              field.value === t
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40",
            )}
          >
            <RadioGroupItem value={t} />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{LABELS[t].title}</span>
              <span className="text-xs text-muted-foreground font-mono">{LABELS[t].description}</span>
            </div>
          </label>
        ))}
      </RadioGroup>
    </Field>
  )}
/>
```

---

## Checkbox toggle card

For boolean fields that toggle a section of conditional fields:

```tsx
<Controller
  name="has_event"
  control={control}
  render={({ field }) => (
    <label
      className={cn(
        "w-full flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
        field.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
      )}
    >
      <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <p className="text-foreground text-sm font-medium">Title</p>
        <p className="text-muted-foreground text-xs">Description</p>
      </div>
    </label>
  )}
/>
```

---

## Conditional fields

Use `useWatch` for the condition, then render conditionally. Indent with a left border:

```tsx
const hasEvent = useWatch({ control, name: "has_event" })

// In JSX:
{hasEvent && (
  <div className="flex flex-col gap-4 pl-3 border-l-2 border-primary/30">
    {/* conditional fields */}
  </div>
)}
```

---

## Combobox field (searchable dropdown)

For fields with many options, use `Combobox` from `@/components/ui/combobox`:

```tsx
<Controller
  name="region"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>Region</FieldLabel>
      <Combobox
        items={REGIONS}
        value={field.value ?? ""}
        onValueChange={field.onChange}
      >
        <ComboboxInput placeholder="Search region..." showClear />
        <ComboboxContent>
          <ComboboxEmpty>No region found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item} className="font-mono text-sm">
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Cascading field resets

When one field's value invalidates downstream fields, use `setValue` to reset them:

```tsx
onValueChange={(val) => {
  field.onChange(val)
  setValue("country", "")
  setValue("city", "")
  setValue("timezone", "")
}}
```

---

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
        disableBefore={new Date()}
      />
    </Field>
  )}
/>
```

DatePicker props: `value`, `onChange`, `placeholder`, `className`, `disabled`, `disableBefore`, `startMonth`, `endMonth`.

---

## SectionCard — grouping fields

Wrap logically related fields in a card:

```tsx
function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
      {children}
    </div>
  )
}
```

Inside each card, add a header:

```tsx
<SectionCard>
  <div>
    <h2 className="font-display font-bold text-foreground text-xl">Section title</h2>
    <p className="text-muted-foreground text-sm mt-1">Section subtitle</p>
  </div>
  {/* fields */}
</SectionCard>
```

---

## Multi-step wizard

For complex forms, split into steps with per-step validation.

### Step definition

```tsx
const STEPS = ["Project", "Team", "Event", "Access"] as const
type Step = (typeof STEPS)[number]

const [step, setStep] = useState<Step>("Project")
const stepIndex = STEPS.indexOf(step)
```

### Fields-to-step mapping (for server error routing)

```tsx
const FIELD_TO_STEP: Partial<Record<keyof MyInput, Step>> = {
  title: "Project",
  description: "Project",
  looking_for: "Team",
  // ...
}
```

### Per-step validation fields

```tsx
const STEP_FIELDS: Record<Step, (keyof MyInput)[]> = {
  Project: ["title", "description", "track", "stage"],
  Team: ["looking_for", "max_team_size", "experience_level", "language"],
  Event: [],
  Access: ["application_type"],
}

async function goNext() {
  setServerError(null)
  const valid = await trigger(STEP_FIELDS[step])
  if (valid) setStep(STEPS[stepIndex + 1])
}
```

### Step indicator UI

```tsx
<div className="flex items-center w-full">
  {STEPS.map((s, i) => (
    <Fragment key={s}>
      <div className="flex items-center gap-2 shrink-0">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all",
          i < stepIndex ? "bg-primary border-primary text-primary-foreground"
            : i === stepIndex ? "border-primary text-primary"
            : "border-border text-muted-foreground",
        )}>
          {i < stepIndex ? "✓" : i + 1}
        </div>
        <span className={cn(
          "text-xs font-mono hidden sm:block",
          i === stepIndex ? "text-foreground font-medium" : "text-muted-foreground",
        )}>
          {s}
        </span>
      </div>
      {i < STEPS.length - 1 && (
        <div className={cn("h-px flex-1 mx-2", i < stepIndex ? "bg-primary" : "bg-border")} />
      )}
    </Fragment>
  ))}
</div>
```

### Server error routing to correct step

When a server error mentions a field name, jump to that step:

```tsx
async function onSubmit(values: MyInput) {
  setServerError(null)
  try {
    await onFormSubmit(values)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Something went wrong"
    toast.error(message)

    const matchedField = (Object.keys(FIELD_TO_STEP) as (keyof MyInput)[])
      .find((field) => message.toLowerCase().includes(field.toLowerCase()))

    if (matchedField && FIELD_TO_STEP[matchedField]) {
      setError(matchedField, { type: "server", message })
      setStep(FIELD_TO_STEP[matchedField]!)
    } else {
      setServerError(message)
    }
  }
}
```

### Navigation footer

```tsx
<div className="flex justify-between pt-2">
  <Button
    type="button"
    variant="ghost"
    onClick={() => stepIndex > 0 ? setStep(STEPS[stepIndex - 1]) : router.back()}
    className="font-mono text-sm"
  >
    ← {stepIndex === 0 ? "Cancel" : "Back"}
  </Button>

  {step === STEPS[STEPS.length - 1] ? (
    <Button type="submit" disabled={isSubmitting}
      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">
      {isSubmitting ? submittingLabel : submitLabel}
    </Button>
  ) : (
    <Button type="button" onClick={goNext}
      className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6">
      Continue →
    </Button>
  )}
</div>
```

---

## Submit button

Always use `isSubmitting` from formState with `Spinner`:

```tsx
import { Spinner } from "@/components/ui/spinner"

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? <><Spinner className="mr-2" /> {submittingLabel}</> : submitLabel}
</Button>
```

---

## Button types inside forms

Every `<button>` or `<Button>` inside a `<form>` that is NOT the submit button must have `type="button"`:

```tsx
<Button type="button" onClick={onCancel}>Cancel</Button>
<Button type="submit">Save</Button>
```

---

## Server errors

Server-side errors go into local `useState`, not react-hook-form. Always use the styled box:

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

Also show a `toast.error(message)` for immediate feedback.

---

## Archetype-colored elements

When rendering archetype data that uses dynamic CSS vars (from `colorVar`), inline `style={{}}` is acceptable since these colors come from data, not design tokens:

```tsx
style={selected ? {
  borderColor: `var(${a.colorVar})`,
  color: `var(${a.colorVar})`,
  backgroundColor: `color-mix(in oklch, var(${a.colorVar}) 15%, transparent)`,
} : undefined}
```

For static archetype references (known at build time), prefer Tailwind classes or Badge variants:

```tsx
const ARCHETYPE_VARIANT: Record<ArchetypeId, { filled: ButtonVariant; outline: ButtonVariant }> = {
  visionary: { filled: "visionary", outline: "visionary-outline" },
  strategist: { filled: "strategist", outline: "strategist-outline" },
  builder: { filled: "builder", outline: "builder-outline" },
}
```
