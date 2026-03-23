"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useCreateHackSpace } from "@/services/api/hack-spaces"
import { ARCHETYPES, ALL_SKILLS } from "@/lib/onboarding"
import {
  createHackSpaceSchema,
  type CreateHackSpaceInput,
  TRACKS,
  STAGES,
  EXPERIENCE_LEVELS,
  APPLICATION_TYPES,
  EVENT_TIMINGS,
} from "@/lib/schemas/hack-space"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { cn } from "@/lib/utils"

const TRACK_EMOJIS: Record<string, string> = {
  DeFi: "💰",
  "DAO tools": "🏛️",
  AI: "🤖",
  Social: "🌐",
  Gaming: "🎮",
  NFTs: "🖼️",
  Infrastructure: "⚙️",
  Other: "🔗",
}

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  prototype: "Prototype",
  in_development: "In Development",
}

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

const APPLICATION_TYPE_LABELS: Record<string, string> = {
  open: "Open — anyone can apply",
  invite_only: "Invite only",
  curated: "Curated — you review each applicant",
}

const EVENT_TIMING_LABELS: Record<string, string> = {
  before: "Before the event",
  during: "During the event",
  after: "After the event",
}

const LANGUAGES = ["English", "Spanish", "Portuguese", "French", "German", "Mandarin", "Japanese", "Other"]

const STEPS = ["Project", "Team", "Event", "Access"] as const
type Step = typeof STEPS[number]

export function CreateHackSpaceForm() {
  const router = useRouter()
  const createHackSpace = useCreateHackSpace()
  const [step, setStep] = useState<Step>("Project")
  const [serverError, setServerError] = useState<string | null>(null)

  const stepIndex = STEPS.indexOf(step)

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { isSubmitting },
  } = useForm<CreateHackSpaceInput>({
    resolver: zodResolver(createHackSpaceSchema),
    defaultValues: {
      title: "",
      description: "",
      track: undefined,
      stage: undefined,
      repo_url: "",
      looking_for: [],
      skills_needed: [],
      max_team_size: 5,
      experience_level: "intermediate",
      language: "English",
      timezone_region: "",
      application_type: "open",
      application_deadline: "",
      has_event: false,
      event_name: "",
      event_url: "",
      event_date: "",
      event_timing: undefined,
    },
  })

  const hasEvent = watch("has_event")

  const STEP_FIELDS: Record<Step, (keyof CreateHackSpaceInput)[]> = {
    Project: ["title", "description", "track", "stage"],
    Team: ["looking_for", "max_team_size", "experience_level", "language"],
    Event: [],
    Access: ["application_type"],
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step])
    if (valid) setStep(STEPS[stepIndex + 1])
  }

  async function onSubmit(values: CreateHackSpaceInput) {
    setServerError(null)
    try {
      const hs = await createHackSpace.mutateAsync(values)
      router.push(`/dashboard/hack-spaces/${hs.id}`)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong")
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all",
                i < stepIndex
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === stepIndex
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              {i < stepIndex ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "text-xs font-mono hidden sm:block",
                i === stepIndex ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn("h-px w-8 sm:w-12", i < stepIndex ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* ── STEP 1: PROJECT ── */}
        {step === "Project" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">About the project</h2>
              <p className="text-muted-foreground text-sm mt-1">What are you building?</p>
            </div>

            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Project name *</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. ZK Identity Protocol"
                    maxLength={80}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

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
                    placeholder="Describe what you're building and why it matters..."
                    maxLength={500}
                    rows={4}
                    className="resize-none"
                  />
                  <FieldDescription>{(field.value ?? "").length}/500</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="track"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Track *</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {TRACKS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                          field.value === t
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {TRACK_EMOJIS[t]} {t}
                      </button>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="stage"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Stage *</FieldLabel>
                  <div className="flex gap-2">
                    {STAGES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => field.onChange(s)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                          field.value === s
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {STAGE_LABELS[s]}
                      </button>
                    ))}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="repo_url"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Repo / links{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://github.com/..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
        )}

        {/* ── STEP 2: TEAM ── */}
        {step === "Team" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">About the team</h2>
              <p className="text-muted-foreground text-sm mt-1">Who are you looking for?</p>
            </div>

            <Controller
              name="looking_for"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Archetypes needed *</FieldLabel>
                  <div className="flex gap-2 flex-wrap">
                    {ARCHETYPES.map((a) => {
                      const value = field.value ?? []
                      const selected = value.includes(a.id)
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              selected ? value.filter((v) => v !== a.id) : [...value, a.id]
                            )
                          }
                          className="text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer"
                          style={
                            selected
                              ? {
                                  borderColor: `var(${a.colorVar})`,
                                  color: `var(${a.colorVar})`,
                                  backgroundColor: `color-mix(in oklch, var(${a.colorVar}) 15%, transparent)`,
                                }
                              : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                          }
                        >
                          {a.name}
                        </button>
                      )
                    })}
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="skills_needed"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    Skills needed{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map((skill) => {
                      const value = field.value ?? []
                      const selected = value.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            field.onChange(
                              selected ? value.filter((s) => s !== skill) : [...value, skill]
                            )
                          }
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-sm border font-mono transition-all cursor-pointer",
                            selected
                              ? "border-primary text-primary bg-primary/10"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          {selected ? "✓ " : ""}
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}
            />

            <Controller
              name="max_team_size"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Max team size *</FieldLabel>
                  <div className="flex gap-2">
                    {[2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => field.onChange(n)}
                        className={cn(
                          "w-10 h-9 rounded-sm border font-mono text-sm transition-all cursor-pointer",
                          field.value === n
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground hover:border-primary/40"
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

            <Controller
              name="experience_level"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Experience level *</FieldLabel>
                  <div className="flex gap-2">
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => field.onChange(lvl)}
                        className={cn(
                          "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                          field.value === lvl
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}
                      >
                        {EXPERIENCE_LABELS[lvl]}
                      </button>
                    ))}
                  </div>
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="language"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Working language *</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => field.onChange(lang)}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded-sm border font-mono transition-all cursor-pointer",
                            field.value === lang
                              ? "border-primary text-primary bg-primary/10"
                              : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="timezone_region"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Region{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. LATAM, Europe, GMT-5"
                    />
                  </Field>
                )}
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: EVENT ── */}
        {step === "Event" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">Related event</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Is this Hack Space tied to a hackathon or event?
              </p>
            </div>

            <Controller
              name="has_event"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                    field.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                      field.value ? "border-primary bg-primary" : "border-border"
                    )}
                  >
                    {field.value && <span className="text-primary-foreground text-xs font-bold">✓</span>}
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">Yes, linked to an event</p>
                    <p className="text-muted-foreground text-xs">
                      Appears highlighted on the map. The Hacker House shortcut will come pre-configured.
                    </p>
                  </div>
                </button>
              )}
            />

            {hasEvent && (
              <div className="flex flex-col gap-4 pl-2 border-l-2 border-primary/30">
                <Controller
                  name="event_name"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Event name</FieldLabel>
                      <Input {...field} id={field.name} placeholder="e.g. ETH Global Cannes 2026" />
                    </Field>
                  )}
                />

                <Controller
                  name="event_url"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Event link</FieldLabel>
                      <Input {...field} id={field.name} placeholder="https://lu.ma/..." />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="event_date"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Event date</FieldLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick event date"
                        className="w-full"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="event_timing"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>This Hack Space is for</FieldLabel>
                      <div className="flex gap-2">
                        {EVENT_TIMINGS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => field.onChange(t)}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-sm border font-mono transition-all cursor-pointer",
                              field.value === t
                                ? "border-primary text-primary bg-primary/10"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            )}
                          >
                            {EVENT_TIMING_LABELS[t]}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: ACCESS ── */}
        {step === "Access" && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">Access & applications</h2>
              <p className="text-muted-foreground text-sm mt-1">Who can apply and how?</p>
            </div>

            <Controller
              name="application_type"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Application type *</FieldLabel>
                  <div className="flex flex-col gap-2">
                    {APPLICATION_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => field.onChange(t)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          field.value === t
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
                            field.value === t ? "border-primary bg-primary" : "border-border"
                          )}
                        />
                        <span className="text-sm font-mono text-foreground">
                          {APPLICATION_TYPE_LABELS[t]}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>
              )}
            />

            <Controller
              name="application_deadline"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>
                    Application deadline{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FieldLabel>
                  <DatePicker
                    value={field.value}
                    onChange={(v) => field.onChange(v ?? "")}
                    placeholder="Pick a deadline"
                    fromDate={new Date()}
                    className="w-full"
                  />
                </Field>
              )}
            />

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => stepIndex > 0 ? setStep(STEPS[stepIndex - 1]) : router.back()}
            className="font-mono text-sm"
          >
            ← {stepIndex === 0 ? "Cancel" : "Back"}
          </Button>

          {step === "Access" ? (
            <Button
              key="submit"
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
            >
              {isSubmitting ? "Creating..." : "Launch Space →"}
            </Button>
          ) : (
            <Button
              key="continue"
              type="button"
              onClick={goNext}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
            >
              Continue →
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
