"use client"

import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type ProfileInput } from "@/lib/schemas/onboarding"
import { LANGUAGES } from "@/lib/constants/languages"
import {
  REGIONS,
  getCountriesForRegion,
  getCitiesForCountry,
} from "@/lib/constants/location"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox"

export interface ProfileExtras {
  languages: string[]
  region: string
  country: string
  city: string
  timezone: string
  github_url: string
  twitter_url: string
}

interface StepProfileProps {
  onNext: (handle: string, bio: string, extras: ProfileExtras) => void
  onBack: () => void
  loading: boolean
  error: string | null
}

export function StepProfile({ onNext, onBack, loading, error }: StepProfileProps) {
  const { control, handleSubmit, setValue, formState } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      handle: "",
      bio: "",
      languages: [],
      region: "",
      country: "",
      city: "",
      timezone: "",
      github_url: "",
      twitter_url: "",
    },
  })

  const watchedRegion = useWatch({ control, name: "region" })
  const watchedCountry = useWatch({ control, name: "country" })

  const availableCountries = getCountriesForRegion(watchedRegion ?? "")
  const availableCities = getCitiesForCountry(watchedRegion ?? "", watchedCountry ?? "")

  function onSubmit(values: ProfileInput) {
    onNext(values.handle, values.bio ?? "", {
      languages: values.languages ?? [],
      region: values.region ?? "",
      country: values.country ?? "",
      city: values.city ?? "",
      timezone: values.timezone ?? "",
      github_url: values.github_url ?? "",
      twitter_url: values.twitter_url ?? "",
    })
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Step header */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em]">
          04 — Profile
        </p>
        <h1 className="font-display font-bold text-foreground text-4xl leading-tight">
          Build your identity.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Your handle is permanent. Location and languages are optional.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Section 1 — Identity (required) */}
        <div className="flex flex-col gap-6">
          {/* Handle */}
          <Controller
            name="handle"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Handle{" "}
                  <span className="text-muted-foreground font-normal">(required)</span>
                </FieldLabel>
                <div
                  className="flex items-center rounded-lg border bg-transparent dark:bg-input/30 transition-[border-color,box-shadow]"
                  style={{
                    borderColor: fieldState.invalid
                      ? "var(--destructive)"
                      : "var(--border)",
                  }}
                >
                  <span className="pl-3 pr-1 text-muted-foreground font-mono text-sm select-none">
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
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 font-mono pl-0"
                  />
                </div>
                <FieldDescription>
                  3–20 chars. Lowercase, numbers and underscores only.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Bio */}
          <Controller
            name="bio"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Bio{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="What are you building?"
                  maxLength={160}
                  rows={3}
                  className="resize-none font-mono text-sm"
                />
                <FieldDescription className="text-right tabular-nums">
                  {(field.value ?? "").length} / 160
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Divider — optional section */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0 whitespace-nowrap">
            Optional — helps match you with builders
          </p>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Section 2 — Optional context */}
        <div className="flex flex-col gap-6">
          {/* Languages */}
          <Controller
            name="languages"
            control={control}
            render={({ field }) => {
              const value = field.value ?? []
              return (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0">
                      Languages
                    </p>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => {
                      const active = value.includes(lang)
                      return (
                        <Button
                          key={lang}
                          type="button"
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={() =>
                            field.onChange(
                              active
                                ? value.filter((l) => l !== lang)
                                : [...value, lang],
                            )
                          }
                          className="rounded-md font-mono"
                        >
                          {active ? "✓ " : ""}
                          {lang}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )
            }}
          />

          {/* Location — cascading selects */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0">
                Location
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex flex-col gap-3">
              {/* Region */}
              <Controller
                name="region"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-xs font-mono text-muted-foreground">
                      Region
                    </FieldLabel>
                    <Combobox
                      items={REGIONS}
                      value={field.value ?? ""}
                      onValueChange={(val) => {
                        field.onChange(val)
                        setValue("country", "")
                        setValue("city", "")
                        setValue("timezone", "")
                      }}
                    >
                      <ComboboxInput placeholder="Search region..." showClear />
                      <ComboboxContent>
                        <ComboboxEmpty>No region found.</ComboboxEmpty>
                        <ComboboxList>
                          {(r: string) => (
                            <ComboboxItem key={r} value={r} className="font-mono text-sm">
                              {r}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Country — shown only if region is selected */}
              {watchedRegion && availableCountries.length > 0 && (
                <Controller
                  name="country"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs font-mono text-muted-foreground">
                        Country
                      </FieldLabel>
                      <Combobox
                        items={availableCountries.map((c) => c.name)}
                        value={field.value ?? ""}
                        onValueChange={(val) => {
                          field.onChange(val)
                          setValue("city", "")
                          setValue("timezone", "")
                        }}
                      >
                        <ComboboxInput placeholder="Search country..." showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No country found.</ComboboxEmpty>
                          <ComboboxList>
                            {(name: string) => (
                              <ComboboxItem key={name} value={name} className="font-mono text-sm">
                                {name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}

              {/* City — shown only if country is selected */}
              {watchedCountry && availableCities.length > 0 && (
                <Controller
                  name="city"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-xs font-mono text-muted-foreground">
                        City
                      </FieldLabel>
                      <Combobox
                        items={availableCities.map((c) => c.name)}
                        value={field.value ?? ""}
                        onValueChange={(val) => {
                          field.onChange(val)
                          const cityData = availableCities.find((c) => c.name === val)
                          if (cityData) setValue("timezone", cityData.timezone)
                        }}
                      >
                        <ComboboxInput placeholder="Search city..." showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No city found.</ComboboxEmpty>
                          <ComboboxList>
                            {(name: string) => (
                              <ComboboxItem key={name} value={name} className="font-mono text-sm">
                                {name}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-[0.15em] shrink-0">
                Links
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {/* GitHub */}
              <Controller
                name="github_url"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="github_url"
                      className="text-xs font-mono text-muted-foreground"
                    >
                      GitHub
                    </FieldLabel>
                    <div
                      className="flex items-center rounded-lg border bg-transparent dark:bg-input/30 transition-[border-color]"
                      style={{
                        borderColor: fieldState.invalid
                          ? "var(--destructive)"
                          : "var(--border)",
                      }}
                    >
                      <span className="pl-3 pr-1 text-xs font-mono text-muted-foreground select-none whitespace-nowrap">
                        github.com/
                      </span>
                      <Input
                        {...field}
                        id="github_url"
                        placeholder="username"
                        aria-invalid={fieldState.invalid}
                        value={field.value ?? ""}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 font-mono text-sm pl-0"
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Twitter / X */}
              <Controller
                name="twitter_url"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="twitter_url"
                      className="text-xs font-mono text-muted-foreground"
                    >
                      Twitter / X
                    </FieldLabel>
                    <div
                      className="flex items-center rounded-lg border bg-transparent dark:bg-input/30 transition-[border-color]"
                      style={{
                        borderColor: fieldState.invalid
                          ? "var(--destructive)"
                          : "var(--border)",
                      }}
                    >
                      <span className="pl-3 pr-1 text-xs font-mono text-muted-foreground select-none whitespace-nowrap">
                        x.com/
                      </span>
                      <Input
                        {...field}
                        id="twitter_url"
                        placeholder="username"
                        aria-invalid={fieldState.invalid}
                        value={field.value ?? ""}
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 font-mono text-sm pl-0"
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm font-mono text-destructive border border-destructive/30 rounded-lg px-4 py-2.5 bg-destructive/5">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={loading}
            className="rounded-xl font-mono"
          >
            ← Back
          </Button>
          <Button
            key="submit"
            type="submit"
            size="lg"
            disabled={loading || formState.isSubmitting}
            className="rounded-xl font-mono font-semibold px-6"
          >
            {loading ? (
              <>
                <Spinner className="mr-2" /> Saving...
              </>
            ) : (
              "Enter the Protocol →"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
