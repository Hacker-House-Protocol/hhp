---
name: ui-components
description: Complete UI component reference for Hacker House Protocol. Use before building any UI — covers all shadcn components, variants, custom components, and design system tokens.
---

# UI Component Reference — Hacker House Protocol

Always dark. Never add a light mode class or `light:` variant. The `.dark` class is fixed on `<html>`.

## Required components — never use raw HTML equivalents

| Need | Component | Import | Rule |
|---|---|---|---|
| Button | `Button` | `@/components/ui/button` | Never raw `<button>` with manual Tailwind. Use `variant` + `size` props. |
| Card / panel / section | `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardFooter` | `@/components/ui/card` | Never `<div className="bg-card border border-border rounded-xl">`. |
| Badge / chip / tag | `Badge` | `@/components/ui/badge` | Never raw `<span>` with manual border styles. |
| Loading spinner | `Spinner` | `@/components/ui/spinner` | Never manual `animate-spin` div. |
| Text input | `Input` | `@/components/ui/input` | Always inside `Field` + `FieldLabel` wrapper. |
| Textarea | `Textarea` | `@/components/ui/textarea` | Same as Input. |
| Select dropdown | `Select`, `SelectTrigger`, `SelectContent`, `SelectItem` | `@/components/ui/select` | Never native `<select>`. |
| Form field wrapper | `Field`, `FieldLabel`, `FieldError`, `FieldDescription` | `@/components/ui/field` | Wrap every form control. |
| Divider | `Separator` | `@/components/ui/separator` | Never `<div className="h-px bg-border">` or `style={{ background: "var(--border)" }}`. |
| Date field | `DatePicker` | `@/components/ui/date-picker` | Never `<Input type="date">`. Accepts `value: string` (ISO `YYYY-MM-DD`), `onChange`, `placeholder`, `fromDate`. Works with react-hook-form `Controller`. |
| Page content wrapper | `PageContainer` | `@/app/(protected)/dashboard/_components/page-container` | Use in every dashboard page for consistent `max-w-6xl` width. |

## Button variants

| Variant | When to use |
|---|---|
| `default` | Primary CTA — filled with `bg-primary` |
| `outline` | Secondary / Back actions |
| `ghost` | Tertiary / Skip actions — no border |
| `destructive` | Destructive actions |
| `visionary` | Filled magenta — Visionary archetype context |
| `visionary-outline` | Magenta border + text |
| `strategist` | Filled lavender — Strategist archetype context |
| `strategist-outline` | Lavender border + text |
| `builder` | Filled green — Builder archetype context |
| `builder-outline` | Green border + text |

**Archetype rule:** map `profile.archetype` → variant. `visionary` → `variant="visionary"`, etc.

Button sizes: `size="lg"` (main form actions), `size="default"` (standard), `size="sm"` (compact).

## Badge variants

Same archetype logic as Button. `variant="secondary"` for neutral chips, `variant="outline"` for bordered, `variant="destructive"` for errors.

## Card variants

| Variant | When to use |
|---|---|
| `variant="default"` | Standard card — `bg-card` + `ring-1 ring-foreground/10` |
| `variant="primary"` | Hero/highlight card — purple gradient `#6B00C9→#8B78E6` with matching border |
| `variant="builder"` | Builder archetype card — green gradient |

## Design system tokens

```css
/* Surfaces */
--background   /* page canvas */
--card         /* cards, panels */
--muted        /* subdued backgrounds */
--border       /* borders */

/* Text */
--foreground          /* primary text */
--muted-foreground    /* labels, metadata */

/* Brand */
--primary      /* purple — CTAs, focus rings */

/* Archetypes */
--visionary          /* magenta */
--strategist         /* lavender */
--builder-archetype  /* green */
```

Never use hardcoded hex/rgb values. Always use CSS variable tokens.

## Typography

- `font-display` — headings (Space Grotesk)
- `font-mono` — labels, metadata, badges, wallet addresses (JetBrains Mono)
- default sans — body text (Inter)

## Archetypes

The `ARCHETYPES` constant in `lib/onboarding.ts` has **no `emoji` field**. Render only `name` and `colorVar`. Never add emojis to archetype displays.

## Images

Use plain `<img>` tags. `next/image` is not used (`@next/next/no-img-element` ESLint rule is disabled).
