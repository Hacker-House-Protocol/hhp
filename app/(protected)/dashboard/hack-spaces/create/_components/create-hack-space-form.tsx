"use client"

import { Fragment, useState } from "react"
import { useForm, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const APPLICATION_TYPE_LABELS: Record<
  string,
  { title: string; description: string }
> = {
  open: { title: "Open", description: "Anyone can apply" },
  invite_only: {
    title: "Invite only",
    description: "You invite builders directly",
  },
  curated: {
    title: "Curated",
    description: "You review each applicant manually",
  },
}

const EVENT_TIMING_LABELS: Record<string, string> = {
  before: "Before",
  during: "During",
  after: "After",
}

const LANGUAGES = [
  "English",
  "Spanish",
  "Portuguese",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Other",
]

const STEPS = ["Project", "Team", "Event", "Access"] as const
type Step = (typeof STEPS)[number]

const FIELD_TO_STEP: Partial<Record<keyof CreateHackSpaceInput, Step>> = {
  title: "Project",
  description: "Project",
  track: "Project",
  stage: "Project",
  repo_url: "Project",
  looking_for: "Team",
  skills_needed: "Team",
  max_team_size: "Team",
  experience_level: "Team",
  language: "Team",
  timezone_region: "Team",
  has_event: "Event",
  event_name: "Event",
  event_url: "Event",
  event_date: "Event",
  event_timing: "Event",
  application_type: "Access",
  application_deadline: "Access",
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
      {children}
    </div>
  )
}

function TogglePill({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
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

interface HackSpaceFormProps {
  defaultValues?: Partial<CreateHackSpaceInput>
  onFormSubmit: (values: CreateHackSpaceInput) => Promise<void>
  submitLabel: string
  submittingLabel: string
}

export function HackSpaceForm({
  defaultValues,
  onFormSubmit,
  submitLabel,
  submittingLabel,
}: HackSpaceFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>("Project")
  const [serverError, setServerError] = useState<string | null>(null)

  const stepIndex = STEPS.indexOf(step)

  const {
    control,
    handleSubmit,
    trigger,
    setError,
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
      ...defaultValues,
    },
  })

  const hasEvent = useWatch({ control, name: "has_event" })

  const STEP_FIELDS: Record<Step, (keyof CreateHackSpaceInput)[]> = {
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

  async function onSubmit(values: CreateHackSpaceInput) {
    setServerError(null)
    try {
      await onFormSubmit(values)
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong"
      toast.error(message)
      const matchedField = (
        Object.keys(FIELD_TO_STEP) as (keyof CreateHackSpaceInput)[]
      ).find((field) => message.toLowerCase().includes(field.toLowerCase()))

      if (matchedField && FIELD_TO_STEP[matchedField]) {
        setError(matchedField, { type: "server", message })
        setStep(FIELD_TO_STEP[matchedField]!)
      } else {
        setServerError(message)
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Step indicator */}
      <div className="flex items-center w-full">
        {STEPS.map((s, i) => (
          <Fragment key={s}>
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all",
                  i < stepIndex
                    ? "bg-primary border-primary text-primary-foreground"
                    : i === stepIndex
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {i < stepIndex ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-mono hidden sm:block",
                  i === stepIndex
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                key={`connector-${i}`}
                className={cn(
                  "h-px flex-1 mx-2",
                  i < stepIndex ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </Fragment>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        {/* ── STEP 1: PROJECT ── */}
        {step === "Project" && (
          <SectionCard>
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">
                About the project
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                What are you building?
              </p>
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  <FieldDescription>
                    {(field.value ?? "").length}/500
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                      <TogglePill
                        key={t}
                        selected={field.value === t}
                        onClick={() => field.onChange(t)}
                      >
                        {TRACK_EMOJIS[t]} {t}
                      </TogglePill>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="stage"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Stage *</FieldLabel>
                  <div className="flex gap-2 flex-wrap">
                    {STAGES.map((s) => (
                      <TogglePill
                        key={s}
                        selected={field.value === s}
                        onClick={() => field.onChange(s)}
                      >
                        {STAGE_LABELS[s]}
                      </TogglePill>
                    ))}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://github.com/..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </SectionCard>
        )}

        {/* ── STEP 2: TEAM ── */}
        {step === "Team" && (
          <SectionCard>
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">
                About the team
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Who are you looking for?
              </p>
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
                              selected
                                ? value.filter((v) => v !== a.id)
                                : [...value, a.id],
                            )
                          }
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-md border font-mono transition-all cursor-pointer",
                            !selected &&
                              "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                          style={
                            selected
                              ? {
                                  borderColor: `var(${a.colorVar})`,
                                  color: `var(${a.colorVar})`,
                                  backgroundColor: `color-mix(in oklch, var(${a.colorVar}) 15%, transparent)`,
                                }
                              : undefined
                          }
                        >
                          {a.name}
                        </button>
                      )
                    })}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map((skill) => {
                      const value = field.value ?? []
                      const selected = value.includes(skill)
                      return (
                        <TogglePill
                          key={skill}
                          selected={selected}
                          onClick={() =>
                            field.onChange(
                              selected
                                ? value.filter((s) => s !== skill)
                                : [...value, skill],
                            )
                          }
                        >
                          {selected ? "✓ " : ""}
                          {skill}
                        </TogglePill>
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="experience_level"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Experience level *</FieldLabel>
                  <div className="flex gap-2 flex-wrap">
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <TogglePill
                        key={lvl}
                        selected={field.value === lvl}
                        onClick={() => field.onChange(lvl)}
                      >
                        {EXPERIENCE_LABELS[lvl]}
                      </TogglePill>
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
                        <TogglePill
                          key={lang}
                          selected={field.value === lang}
                          onClick={() => field.onChange(lang)}
                        >
                          {lang}
                        </TogglePill>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
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
          </SectionCard>
        )}

        {/* ── STEP 3: EVENT ── */}
        {step === "Event" && (
          <SectionCard>
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">
                Related event
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Is this Hack Space tied to a hackathon or event?
              </p>
            </div>

            <Controller
              name="has_event"
              control={control}
              render={({ field }) => (
                <label
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                    field.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <div className="flex flex-col gap-0.5">
                    <p className="text-foreground text-sm font-medium">
                      Yes, linked to an event
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Appears highlighted on the map. The Hacker House shortcut
                      will come pre-configured.
                    </p>
                  </div>
                </label>
              )}
            />

            {hasEvent && (
              <div className="flex flex-col gap-4 pl-3 border-l-2 border-primary/30">
                <Controller
                  name="event_name"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Event name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="e.g. ETH Global Cannes 2026"
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="event_url"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Event link</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="https://lu.ma/..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
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
                          <TogglePill
                            key={t}
                            selected={field.value === t}
                            onClick={() => field.onChange(t)}
                          >
                            {EVENT_TIMING_LABELS[t]}
                          </TogglePill>
                        ))}
                      </div>
                    </Field>
                  )}
                />
              </div>
            )}
          </SectionCard>
        )}

        {/* ── STEP 4: ACCESS ── */}
        {step === "Access" && (
          <SectionCard>
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">
                Access & applications
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Who can apply and how?
              </p>
            </div>

            <Controller
              name="application_type"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Application type *</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="gap-2"
                  >
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
                          <span className="text-sm font-medium text-foreground">
                            {APPLICATION_TYPE_LABELS[t].title}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {APPLICATION_TYPE_LABELS[t].description}
                          </span>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
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
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </FieldLabel>
                  <DatePicker
                    value={field.value}
                    onChange={(v) => field.onChange(v ?? "")}
                    placeholder="Pick a deadline"
                    disableBefore={new Date()}
                    className="w-full"
                  />
                </Field>
              )}
            />
          </SectionCard>
        )}

        {/* Server error */}
        {serverError && (
          <p className="text-sm font-mono text-destructive border border-destructive/30 rounded-lg px-4 py-2.5 bg-destructive/5">
            {serverError}
          </p>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              stepIndex > 0 ? setStep(STEPS[stepIndex - 1]) : router.back()
            }
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
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2" /> {submittingLabel}
                </>
              ) : (
                submitLabel
              )}
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
