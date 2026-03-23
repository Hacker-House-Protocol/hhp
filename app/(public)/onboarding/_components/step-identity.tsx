"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { identitySchema, type IdentityInput } from "@/lib/schemas/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"

type FormValues = IdentityInput

interface StepIdentityProps {
  onNext: (handle: string, bio: string) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

export function StepIdentity({
  onNext,
  onBack,
  loading,
  error,
}: StepIdentityProps) {
  const { control, handleSubmit } = useForm<IdentityInput>({
    resolver: zodResolver(identitySchema),
    defaultValues: { handle: "", bio: "" },
  })

  function onSubmit(values: FormValues) {
    onNext(values.handle, values.bio ?? "")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display font-bold text-foreground text-3xl sm:text-4xl">
          Claim your identity.
        </h1>
        <p className="text-muted-foreground text-lg">
          Your handle is how the protocol knows you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 max-w-md"
      >
        <Controller
          name="handle"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Handle *</FieldLabel>
              <div className="flex items-center border border-input rounded-md bg-transparent focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-[color,box-shadow]">
                <span className="pl-3 text-muted-foreground font-mono text-sm select-none">
                  @
                </span>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="your_handle"
                  maxLength={20}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                    )
                  }
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 font-mono"
                />
              </div>
              <FieldDescription>
                3–20 chars. Lowercase letters, numbers, and underscores only.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Bio{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="What are you building?"
                maxLength={160}
                rows={3}
                className="resize-none"
              />
              <FieldDescription>
                {(field.value ?? "").length}/160
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={loading}
          >
            ← Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
          >
            {loading ? "Saving..." : "Enter the Protocol →"}
          </Button>
        </div>
      </form>
    </div>
  )
}
