# Feature: Hacker Houses — Hacker House Protocol

Una Hacker House es un espacio de co-living físico donde builders se juntan para networking, compartir gastos y construir relaciones. No tiene un proyecto obligatorio — el valor está en la comunidad y el contexto del evento o ciudad.

---

## ¿Quién puede crear una?

- Builder individual
- Hack Space — via shortcut cuando el equipo está completo
- Organización verificada — financia y gestiona con sus propias reglas (Fase 2)

---

> **Estado actual (marzo 2026):** ✅ Implementado. Crear, listar, filtrar, buscar, paginar, ver detalle, aplicar y gestionar aplicaciones están completos. Ver rutas en `docs/navigation.md`.
>
> **Nota:** `application_deadline` es **requerido** en el schema de creación (Zod valida `min(1)`), no opcional.
>
> **Decisiones de implementación (Fase 1):**
> - Solo modalidad **gratuita** (`modality: 'free'` hardcodeado en schema de creación)
> - `includes` → 5 columnas booleanas individuales (no JSONB)
> - `images` → `text[]` en Supabase, máximo 5 fotos. Preview local via `URL.createObjectURL`, upload en bloque al confirmar creación.
> - `house_rules` → texto libre, máximo 500 caracteres
> - `profile_sought` → arquetipos del sistema (`visionary | strategist | builder`)
> - `applications` → tabla `applications` unificada con `hack_space_id | hacker_house_id` nullable + `target_type` discriminador + CHECK constraint
> - Estados: transición manual por el creador (`open → full → active → finished`)
> - Formulario: 4 pasos (House · Dates & Amenities · Community · Access) con toggle de evento inline

## Formulario de Creación (`/dashboard/hacker-houses/create`)

Formulario multi-step de 4 pasos implementado en `app/(protected)/dashboard/hacker-houses/create/_components/create-hacker-house-form.tsx`.

### Step 1 — House
- Nombre de la Hacker House (`name`) — 3–80 caracteres
- Ubicación — 3 comboboxes cascada opcionales:
  - Región (`region`, UI-only, no persiste en DB) — de `LOCATION_DATA` en `lib/constants/location.ts`
  - País (`country`) — se filtra según región seleccionada
  - Ciudad (`city`) — se filtra según país seleccionado
- Barrio / zona aproximada (`neighborhood`) — opcional, sin dirección exacta por privacidad

### Step 2 — Dates & Amenities
- Fecha de inicio (`start_date`) — `DatePicker`
- Fecha de fin (`end_date`) — `DatePicker`
- Capacidad máxima de personas (`capacity`): stepper `− N +` (min 2, max 50, default 4)
- Qué incluye (cards togglables, columnas booleanas): `includes_private_room` · `includes_shared_room` · `includes_meals` · `includes_workspace` · `includes_internet`
- Imágenes (`images`): multi-select, hasta 5 fotos, AVIF + JPEG + PNG + WebP. Preview local via `URL.createObjectURL`. Se suben en bloque al confirmar creación via `POST /api/hacker-houses/upload-image`. Se guardan como `text[]` en Supabase.

### Step 3 — Community
- Perfil buscado (`profile_sought`): arquetipos del sistema — `visionary | strategist | builder` — al menos 1 requerido
- Idioma de comunicación (`language`) — multi-select pills, permite seleccionar varios. Default: `["English"]`.
- Reglas básicas de la casa (`house_rules`) — textarea libre, máximo 500 caracteres, opcional

### Step 4 — Access
- Tipo de aplicación (`application_type`): RadioGroup — `open · invite_only · curated`
- Deadline para aplicar (`application_deadline`) — DatePicker, **requerido**
- ~~Filtros on-chain: POAPs, NFTs, Talent Protocol score~~ → **Pospuesto a Fase 2**
- ~~Staking requerido~~ → **Pospuesto a Fase 2**

### Evento Relacionado (Opcional — inline toggle en cualquier step del formulario)
- Toggle: ¿Está ligada a un evento? (`has_event`) — sección condicional con borde izquierdo
- Nombre del evento (`event_name`)
- Link del evento (`event_url`) — opcional
- Fecha de inicio del evento (`event_start_date`)
- Fecha de fin del evento (`event_end_date`) — opcional
- La Hacker House es: `before · during · after` — multi-select pills, permite seleccionar varios (`event_timing: string[]`)

> Si está vinculada a un evento, aparece destacada en el mapa. Los builders que siguen ese evento la ven en su feed con prioridad.

---

## Modalidades

| Modalidad | Fase | Descripción |
|---|---|---|
| **Gratuita** | Fase 1 ✅ | Sin pago ni staking. Filtros opcionales de acceso. |
| **De pago** | Fase 2 🔒 | Pago grupal via smart contract auditado. Split automático. Reembolso si no se llena en 7 días. |
| **Con staking** | Fase 2 🔒 | Stake perdible si el builder no asiste. Gestionado por el creador via dashboard. |

> La plataforma no custodia fondos. Todo opera via smart contract (Fase 2).

---

## Hacker Houses de Organizaciones (Fase 2)

Fuera del alcance de Fase 1. Las organizaciones cubren todos los costos y definen sus propias reglas de acceso y staking.

---

## Dashboard de Asistencia (`/dashboard`) — Fase 2

El creador marca cada builder como `asistió / no asistió`. El smart contract procesa automáticamente la liberación o pérdida del stake.

---

## Key NFT — Acceso Transferible (Fase 2)

Cada Hacker House de pago genera N keys (una por cupo). NFT con metadata: evento, fechas, número de cupo. Transferible entre builders sin intervención del creador.

---

## HHP POAPs — Proof of Presence (Fase 2)

Cada Hacker House genera su propio POAP para los asistentes confirmados. Queda en el Achievement Gallery del builder como badge on-chain.

---

## Arquitectura técnica — Fase 1

### DB: tabla `applications` unificada
Soporta ambas entidades sin romper FK integrity:

- `hack_space_id uuid` — nullable, FK → `hack_spaces.id`
- `hacker_house_id uuid` — nullable, FK → `hacker_houses.id`
- `target_type text` — `'hack_space' | 'hacker_house'`
- CHECK constraint: exactamente una FK non-null por fila
- Código de Hack Spaces no cambia — `hack_space_id` sigue igual.

### DB: tabla `hacker_houses`
Columnas de `includes` como booleanas individuales (no JSONB). `images` como `text[]`. `modality` con default `'free'`.

### Participantes
- El creador cuenta como participante #1 — su `avatar_url` aparece primero
- `participants_count = accepted_applications + 1`
- Auto-transición a `'full'` cuando `participants_count >= capacity` al aceptar una aplicación
- En la card: hasta 6 avatares + overflow "+N"
- En el detalle: todos los avatares

### Imágenes
- Upload a Supabase Storage bucket `hacker-house-images`
- Stored como `text[]` en `hacker_houses`
- Máx 5 fotos por Hacker House; formatos: AVIF, JPEG, PNG, WebP
- Preview local via `URL.createObjectURL` — sin upload anticipado
- Al crear/guardar: `Promise.all(files.map(upload))`, luego insert/update con URLs resultantes
- Primera imagen = portada (cover en card y hero en detalle)
- Detalle: hero grande + strip de thumbnails horizontal debajo

### Búsqueda en lista
- `q` hace `ilike` sobre `name` y `city` (OR) — útil para spaces físicos

### Status transitions (manual por el creador)
```
open → full (auto cuando capacity se completa al aceptar aplicación)
open/full → active (el creador marca "Ya empezó")
active → finished (el creador marca "Terminó")
```

## Estados de la Hacker House

| Estado | Label UI | Token de color | Descripción |
|---|---|---|---|
| `open` | Open | `--primary` | Visible, acepta aplicaciones |
| `full` | Full | `--builder-archetype` | Capacidad completada |
| `active` | Active | `--strategist` | La house ya empezó |
| `finished` | Finished | `--muted-foreground` | Terminada |

---

## Aplicación a una Hacker House

- Los builders aplican con mensaje opcional (máx 300 caracteres).
- Formulario inline en la card o en la página de detalle.
- El creador puede aceptar o rechazar desde el `ApplicationManager`.
- Al aceptar: si `participants_count >= capacity`, el estado pasa automáticamente a `full`.
- En Fase 1: cualquier builder puede aplicar (sin validación on-chain).

---

## UI: Card de Hacker House

Implementado en `app/(protected)/dashboard/_components/hacker-house-card.tsx`.

| Zona | Contenido |
|---|---|
| **Imagen** | `images[0]` o gradiente placeholder. Overlay `from-card to-transparent` desde abajo. |
| **Header** | Nombre + badge de estado (color según STATUS_CONFIG) |
| **Ubicación** | Ciudad + país |
| **Fechas** | `15–22 Mar 2026` con ícono calendario |
| **Amenidades** | Pills de íconos (solo los `true`): 🛏 Private · 🤝 Shared · 🍳 Meals · 💻 Workspace · 🌐 Internet |
| **Participantes** | Avatares Cypher Kitten (máx 6) con color de arquetipo de fondo. Creador es el primero. Contador `N/capacity`. |
| **Evento vinculado** | Badge con nombre del evento si hay `event_name` |
| **CTA** | `Apply →` / `Manage →` / `View →` según estado y rol |

---

## UI: Página de Lista (`/dashboard/hacker-houses`)

Implementado en `app/(protected)/dashboard/hacker-houses/page.tsx`.

Filtros en URL via `nuqs` (`useQueryStates`). Parámetros: `status`, `profile_sought`, `q`.

- **Búsqueda** (`q`): debounced 500ms, busca en `name` OR `city` (`ilike`)
- **Status**: pills `Open · Full · Active`
- **Profile sought**: pills Visionary / Strategist / Builder con color de arquetipo
- **Paginación**: `useInfiniteQuery` + Load more button
- **Skeleton**: replica la estructura de la card

---

## API Routes

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/hacker-houses` | Crear hacker house (auth requerida) |
| `GET` | `/api/hacker-houses` | Listar con filtros, búsqueda y paginación |
| `GET` | `/api/hacker-houses/:id` | Detalle (con creator avatar + participants aceptados) |
| `PATCH` | `/api/hacker-houses/:id` | Actualizar (solo creador) |
| `POST` | `/api/hacker-houses/upload-image` | Subir imagen a Supabase Storage, retorna `{ image_url }` |
| `POST` | `/api/hacker-houses/:id/apply` | Aplicar |
| `GET` | `/api/hacker-houses/:id/applications` | Listar aplicaciones (solo creador) |
| `PATCH` | `/api/hacker-houses/:id/applications/:appId` | Aceptar o rechazar aplicación (solo creador) |

### GET `/api/hacker-houses` — Query params

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `status` | string | — | Filtro exacto. Si omitido: `open, full, active` |
| `profile_sought` | string | — | Archetype ID — filtra si el array `profile_sought` lo contiene |
| `q` | string | — | Búsqueda en `name` OR `city` (`ilike %q%`) |
| `limit` | number | 12 | Items por página |
| `offset` | number | 0 | Desplazamiento para paginación |

**Respuesta**: `{ hacker_houses: HackerHouse[], total: number, offset: number, limit: number }`

---

## Service Hooks (`services/api/hacker-houses.ts`)

| Hook | Descripción |
|---|---|
| `useFilteredHackerHouses(filters)` | Lista paginada con `useInfiniteQuery`. |
| `useHackerHouse(id)` | Detalle de una hacker house. |
| `useCreateHackerHouse()` | POST — crear. |
| `useUpdateHackerHouse(id)` | PATCH — actualizar. |
| `useApplyToHackerHouse(id)` | POST — aplicar. |
| `useHackerHouseApplications(id)` | GET — listar aplicaciones (solo creador). |
| `useReviewHackerHouseApplication(id)` | PATCH — aceptar/rechazar aplicación. |
| `useUploadHackerHouseImage()` | POST FormData — subir imagen, retorna `{ image_url }`. |

---

## Estado actual (marzo 2026)

**Implementado:**
- Listado con filtros (status, profile_sought, q), paginación "Load more", skeleton
- Creación (formulario 4 pasos: House → Dates & Amenities → Community → Access + toggle evento)
- Página de detalle: hero imagen, galería de thumbnails, amenidades, participantes, apply form, owner actions, application manager
- Aplicar y gestionar aplicaciones (aceptar/rechazar)
- Edición por el creador (`/dashboard/hacker-houses/[id]/edit`)
- Transición de estados manual: `open/full → active → finished`
- Upload de imágenes a Supabase Storage

**Pendiente:**
- Modalidades de pago (`paid`, `staking`) — Fase 2
- Filtros on-chain (POAPs, NFTs, Talent Score) — Fase 2
- Key NFT por cupo — Fase 2
- HHP POAPs por asistencia — Fase 2
- Hacker Houses de organizaciones — Fase 2
- Dashboard de asistencia — Fase 2
