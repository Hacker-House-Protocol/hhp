# Feature: Hack Spaces — Hacker House Protocol

> **Feature principal de la plataforma.** Es el gancho de uso recurrente — los builders usan Hack Spaces de forma continua y cuando su equipo está completo, el flujo los lleva naturalmente a crear una Hacker House.

Un Hack Space es un proyecto online donde un builder convoca a otros con habilidades específicas para construir algo juntos. No es un job board — es una convocatoria activa donde el creador tiene skin in the game.

> **Estado actual (marzo 2026):** ✅ Implementado. Crear, listar, ver detalle, aplicar y gestionar aplicaciones están completos. Ver rutas en `docs/navigation.md`.

---

## Formulario de Creación (`/dashboard/hack-spaces/create`)

Formulario multi-step de 4 pasos implementado en `app/(protected)/dashboard/hack-spaces/create/_components/create-hack-space-form.tsx`. El mismo componente se reutiliza en edición.

### Step 1 — Proyecto
- **Imagen representativa** (`image_url`) — opcional. Upload a Supabase Storage bucket `hack-space-images`. Endpoint: `POST /api/hack-spaces/upload-image`. Previsualización local inmediata antes de confirmar.
- Nombre del Hack Space (`title`) — 3–80 caracteres
- Descripción (`description`) — 10–500 caracteres
- Track: `DeFi · DAO tools · AI · Social · Gaming · NFTs · Infrastructure · Other`
- Etapa: `idea · prototype · in_development`
- Repositorio o links relevantes (`repo_url`) — opcional

### Step 2 — Equipo
- Arquetipos buscados (`looking_for`): Visionary / Strategist / Builder — al menos 1 requerido
- Habilidades deseadas (`skills_needed`): skills específicas — opcional
- Tamaño máximo del equipo (`max_team_size`): 2–20
- Nivel de experiencia: `beginner · intermediate · advanced`
- Idioma de trabajo (`language`)
- Ubicación — 3 comboboxes cascada opcionales:
  - Región (`region`) — de `LOCATION_DATA` en `lib/constants/location.ts`
  - País (`country`) — se filtra según región seleccionada
  - Ciudad (`city`) — se filtra según país seleccionado

### Step 3 — Evento (Opcional)
- Toggle: ¿Está ligado a un evento? (`has_event`)
- Nombre del evento (`event_name`)
- Link del evento (`event_url`) — Luma u otro
- Fecha del evento (`event_date`)
- Timing: `before · during · after`

> Si está vinculado a un evento, aparece destacado. Cuando el equipo se forma, el shortcut para crear una Hacker House ya viene preconfigurado con fechas y ciudad.

### Step 4 — Acceso
- Tipo de aplicación (`application_type`): `open · invite_only · curated`
- Deadline para aplicar (`application_deadline`) — opcional
- ~~Filtros on-chain: POAPs, NFTs, Talent Protocol score~~ → **Pospuesto a Fase 2**

---

## Estados del Hack Space

| Estado | Label UI | Token de color | Descripción |
|---|---|---|---|
| `open` | Looking for members | `--primary` | Visible, acepta aplicaciones |
| `full` | Team full | `--builder-archetype` | Llegó al tamaño deseado |
| `in_progress` | In progress | `--strategist` | Construyendo activamente |
| `finished` | Finished | `--muted-foreground` | Terminado o cerrado |

---

## Aplicación a un Hack Space

- Los builders aplican con mensaje opcional (máx 300 caracteres).
- Formulario inline en el card o en la página de detalle.
- El creador recibe notificación y puede aceptar o rechazar desde el `ApplicationManager`.
- Al aceptar: si `member_count` alcanza `max_team_size`, el estado pasa automáticamente a `full`.
- En Fase 1: cualquier builder puede aplicar (sin validación on-chain).

---

## Shortcut: Hack Space → Hacker House

Cuando el Hack Space alcanza su meta de habilidades, la plataforma sugiere al creador convertir el equipo en una Hacker House directamente. Si el Hack Space estaba vinculado a un evento, la Hacker House se crea pre-configurada con fechas y ciudad.

---

## UI: Card de Hack Space

Implementado en `app/(protected)/dashboard/_components/hack-space-card.tsx`.

| Zona | Contenido |
|---|---|
| **Imagen** | `h-48`, `object-cover`. Si no hay imagen: gradiente placeholder `primary/20 → muted → card`. Siempre lleva overlay `from-card to-transparent` desde abajo. |
| **Header** | Título (`line-clamp-1`) + badge de estado (color según estado) |
| **Creador** | `@handle · Archetype` (con color del arquetipo) |
| **Descripción** | 2 líneas truncadas (`line-clamp-2`) |
| **Skills** | Pills `border-primary/30 text-primary bg-primary/5`. Máximo 3 visibles + `+N`. Fila separada de arquetipos. |
| **Arquetipos buscados** | Pills con variante de color por arquetipo (`visionary-outline`, `strategist-outline`, `builder-outline`). Muestra `label` (sin "The"). |
| **Zona pills** | `min-h-[44px]` — altura mínima reservada aunque no haya pills, para mantener uniformidad. |
| **Footer — izq.** | Dots de miembros (máx 6 visibles) + contador `N/max` + idioma · ciudad/país/región · evento si aplica |
| **Footer — der.** | CTA contextual (ver abajo) |
| **Altura body** | `h-[260px]` fijo — todas las cards tienen la misma altura independientemente del contenido |

### CTA contextual

| Caso | CTA |
|---|---|
| Es el creador | `Manage →` → link a detalle |
| Status `full` o `finished` | `View →` → link a detalle |
| Ya aplicó | `✓ Applied` (texto, sin acción) |
| Form abierto | `Applying...` (texto) |
| Puede aplicar | `Apply →` → abre form inline |

---

## UI: Página de Lista (`/dashboard/hack-spaces`)

Implementado en `app/(protected)/dashboard/hack-spaces/page.tsx`.

### Filtros

Dos filas con label identificador:

**Fila Track** — scroll horizontal, pill `All` + uno por track con emoji. Selección toggle.

**Fila Status** — `Open · Full · In progress`. Cada opción muestra dot con su color siempre visible. Al seleccionar: fondo `color-mix 10%` + borde en color del estado.

**Clear filters ×** — aparece a la derecha de Status solo cuando hay algún filtro activo. Limpia ambos filtros.

---

## API Routes

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/hack-spaces` | Crear hack space (auth requerida) |
| `GET` | `/api/hack-spaces` | Listar (filtro opcional `creator_id`) |
| `GET` | `/api/hack-spaces/:id` | Detalle |
| `PATCH` | `/api/hack-spaces/:id` | Actualizar (solo creador) |
| `POST` | `/api/hack-spaces/upload-image` | Subir imagen a Supabase Storage, retorna `{ image_url }` |
| `POST` | `/api/hack-spaces/:id/apply` | Aplicar |
| `GET` | `/api/hack-spaces/:id/applications` | Listar aplicaciones (solo creador) |
| `PATCH` | `/api/hack-spaces/:id/applications/:appId` | Aceptar o rechazar aplicación (solo creador) |

---

## Columnas DB (`hack_spaces`)

Incluye todos los campos del formulario más:
- `image_url text` — URL pública en Supabase Storage
- `region text` — región seleccionada (antes `timezone_region`)
- `country text`
- `city text`
- `status` — gestionado por la plataforma
- `created_at / updated_at`
