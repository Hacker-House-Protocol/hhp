# Design System — Hacker House Protocol

> Always-dark interface. Sin modo light. La clase `.dark` está fija en `<html>` en `app/layout.tsx`. También se usa `color-scheme: dark` en `:root` en `globals.css`.

---

## Tokens de color

El sistema usa **oklch** (Tailwind v4 nativo). Todos los tokens viven en `app/globals.css` dentro de `:root`.
Los tokens se mapean a clases Tailwind en el bloque `@theme inline` del mismo archivo. No existe `tailwind.config.ts` — Tailwind v4 se configura enteramente en `globals.css`.

### Jerarquía de superficies

Las superficies están escalonadas por luminosidad (L) para crear profundidad sin sombras:

| Token CSS | oklch | L | Uso |
|---|---|---|---|
| `--background` | `oklch(0.09 0.04 277)` | 9% | Canvas base — nunca fondo blanco |
| `--card` | `oklch(0.13 0.05 275)` | 13% | Cards, panels, secciones principales |
| `--muted` | `oklch(0.17 0.06 276)` | 17% | Fondos apagados, áreas de relleno |
| `--input` | `oklch(0.19 0.06 276)` | 19% | Fondo de inputs y textareas |
| `--accent` | `oklch(0.20 0.12 280)` | 20% | Hover states, highlights interactivos |
| `--secondary` | `oklch(0.22 0.07 276)` | 22% | Botones secondary, chips |
| `--popover` | `oklch(0.16 0.05 275)` | 16% | Dropdowns y popovers — flotan sobre card |
| `--border` | `oklch(0.28 0.06 276)` | 28% | Bordes de cards e inputs — visible sobre L=13 |

**Regla de escala**: cada superficie es al menos 3–5 puntos de L más oscura que la que está encima. Esto garantiza separación visual sin box-shadow.

### Foreground (texto)

| Token CSS | oklch | L | Uso |
|---|---|---|---|
| `--foreground` | `oklch(0.96 0.01 277)` | 96% | Texto principal — contraste ~14:1 sobre background |
| `--card-foreground` | `oklch(0.96 0.01 277)` | 96% | Texto dentro de cards |
| `--muted-foreground` | `oklch(0.62 0.03 278)` | 62% | Labels, metadata, texto de apoyo — ~6.2:1 |

### Brand — Primary

| Token CSS | oklch | Uso |
|---|---|---|
| `--primary` | `oklch(0.62 0.26 295)` | Purple brillante — CTAs, botones principales |
| `--primary-foreground` | `oklch(0.09 0.04 277)` | Texto oscuro sobre primary (no blanco) |
| `--ring` | `oklch(0.62 0.26 295)` | Focus ring — mismo tono que primary |

> **Por qué foreground oscuro**: con primary en L=62%, el texto blanco baja a ~2.7:1 (falla WCAG). El texto oscuro sobre primary da ~5.8:1 y mantiene el look "neon on dark".

### Arquetipos

| Token CSS | oklch | Uso |
|---|---|---|
| `--visionary` | `oklch(0.52 0.24 333)` | Magenta — bordes de avatar, badges, highlights |
| `--strategist` | `oklch(0.68 0.14 279)` | Lavender — bordes de avatar, badges, highlights |
| `--builder-archetype` | `oklch(0.84 0.15 140)` | Green — bordes de avatar, badges, highlights |

### Utilidades

| Token CSS | oklch | Uso |
|---|---|---|
| `--destructive` | `oklch(0.577 0.245 27.325)` | Errores, acciones destructivas |

---

## Clases Tailwind

Los tokens se usan con las clases estándar de Tailwind. Referencia rápida:

```
bg-background     text-foreground
bg-card           text-card-foreground
bg-muted          text-muted-foreground
bg-secondary      text-secondary-foreground
bg-accent         text-accent-foreground
bg-primary        text-primary-foreground
border-border
ring-ring
```

---

## Tipografía

| Rol | Fuente | Variable CSS | Uso |
|---|---|---|---|
| Display / Headings | Space Grotesk | `--font-display` | `font-display` — `h1`–`h3`, hero copy |
| Body | Inter | `--font-sans` | Default del body — texto corrido |
| Wallet / código | JetBrains Mono | `--font-mono` | `font-mono` — addresses, hashes, code |

Escalas recomendadas:
- Hero: `text-5xl` / `text-6xl` — Space Grotesk Bold
- Section titles: `text-2xl` / `text-3xl` — Space Grotesk Semibold
- Body: `text-base` / `text-sm` — Inter Regular
- Metadata: `text-xs` — Inter o JetBrains Mono

---

## Espaciado y bordes

- **Base unit**: 4px. Grid de 8px para el layout.
- **Border radius** (tokens en `globals.css`):

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Badges, chips pequeños |
| `--radius-md` | 8px | Cards, inputs, botones |
| `--radius-lg` | 12px | Modales, sheets |
| `--radius-xl` | 16px | Bottom sheets |
| `--radius-full` | 9999px | Pills, botones CTA |

- **Sombras**: no se usan. La jerarquía de superficies hace el trabajo visual.
- **Íconos**: Lucide Icons o Phosphor Icons — stroke, no fill.

---

## Componentes Base (shadcn/ui)

Los componentes viven en `components/ui/`. Añadir nuevos con `pnpm dlx shadcn@latest add <component>`.

### Botón primario (`variant="default"`)
```
bg-primary text-primary-foreground
hover: bg-primary/80
border-radius: radius-md (8px) o radius-full para CTAs
```

### Botón secundario (`variant="secondary"`)
```
bg-secondary text-secondary-foreground
hover: bg-secondary/80
```

### Botón outline (`variant="outline"`)
```
border-border bg-background
hover: bg-muted text-foreground
dark: usa border-input y bg-input/30 — activo gracias a clase .dark en html
```

### Card
```
bg-card text-card-foreground
ring-1 ring-foreground/10
border-radius: rounded-xl
```

### Input
```
bg-input border-border
focus: ring-ring
aria-invalid: border-destructive
```

### Badge
```
border-radius: radius-sm (4px)
padding: px-3 py-1
font-mono text-xs para badges de metadata
```

### Skills — Pills

Categorías de skills para el picker del perfil y filtros de búsqueda:

```
Frontend · Backend · Smart Contracts · Design · PM · Research
```

Usar `Badge` de shadcn con `variant` según categoría. Colores libres por categoría — aún no definidos, a determinar en implementación.

---

## Cypher Kittens — Avatares

GIFs animados pre-armados en variantes de color y expresión. El builder elige uno durante el onboarding. Son el elemento de identidad visual más reconocible de la plataforma.

- MVP: colección pre-armada de GIFs seleccionables
- V2: minteable como NFT personalizable
- El kitten del Hack Space actúa como mascota del equipo

El avatar siempre se muestra con un borde circular del color del arquetipo del usuario:
```
border: 2–3px solid var(--visionary | --strategist | --builder-archetype)
border-radius: 9999px
```

---

## Estado actual (marzo 2026)

**Implementado y en uso:**
- Todos los tokens de color en `globals.css` — superficies, brand, arquetipos, sidebar
- Tipografía: Inter (body), Space Grotesk (display), JetBrains Mono (mono)
- Border radius tokens definidos y en uso
- Clase `.dark` fija en `<html>`, sin modo light
- Utilidades custom: `animate-float`, `no-scrollbar`

**Pendiente:**
- Categorías de color para pills de skills — "a determinar en implementación"
- Cypher Kittens V2 minteable como NFT
