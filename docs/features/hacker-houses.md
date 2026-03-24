# Feature: Hacker Houses — Hacker House Protocol

Una Hacker House es un espacio de co-living físico donde builders se juntan para networking, compartir gastos y construir relaciones. No tiene un proyecto obligatorio — el valor está en la comunidad y el contexto del evento o ciudad.

---

## ¿Quién puede crear una?

- Builder individual
- Hack Space — via shortcut cuando el equipo está completo
- Organización verificada — financia y gestiona con sus propias reglas (Fase 2)

---

> **Estado actual (marzo 2026):** ❌ No implementado. Página placeholder "Coming soon" en `/dashboard/hacker-houses`. Pendiente para Fase 1 post-MVP core.
>
> **Decisiones de implementación confirmadas (Fase 1):**
> - Solo modalidad **gratuita** (`modality: 'free'` hardcodeado en schema de creación)
> - `includes` → 5 columnas booleanas individuales (no JSONB)
> - `images` → `text[]` en Supabase, máximo 5 fotos, upload múltiple en el formulario
> - `house_rules` → texto libre, máximo 500 caracteres
> - `profile_sought` → arquetipos del sistema (`visionary | strategist | builder`)
> - `applications` → tabla `applications` unificada con `target_id + target_type` (migración desde `hack_space_id`)
> - Estados: transición manual por el creador (`open → full → active → finished`)
> - Formulario: 4 pasos (House · Dates & Amenities · Community · Access) con toggle de evento inline

## Formulario de Creación (`/dashboard/hacker-houses/create`)

### Sobre la Casa
- Nombre de la Hacker House
- Ciudad y país
- Zona / Barrio aproximado (no dirección exacta — privacidad)
- Fechas (inicio y fin)
- Capacidad máxima de personas
- Costo por persona (solo si es de pago — Fase 2)
- Qué incluye (columnas booleanas): `includes_private_room` · `includes_shared_room` · `includes_meals` · `includes_workspace` · `includes_internet`
- Imágenes (array de URLs): fotos reales de la casa. Se suben múltiples archivos y se guardan como `text[]` en Supabase.

### Sobre la Comunidad
- Perfil buscado: arquetipos del sistema — `visionary | strategist | builder` (mismos que Hack Spaces, para consistencia de matching y filtros)
- Idioma de comunicación
- Reglas básicas de la casa

### Evento Relacionado (Opcional)
- Toggle: ¿Está ligada a uno o varios eventos?
- Nombre, link y fecha del evento
- La Hacker House es: `antes / durante / después del evento`

> Si está vinculada a un evento, aparece destacada en el mapa. Los builders que siguen ese evento la ven en su feed con prioridad.

### Filtros de Acceso
- Aplicación: `abierta / por invitación / curada`
- Deadline para aplicar
- ~~Filtros on-chain: POAPs, NFTs, Talent Protocol score~~ → **Pospuesto a Fase 2**
- ~~Staking requerido~~ → **Pospuesto a Fase 2**

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
Se migra la tabla `applications` existente para soportar ambas entidades sin romper FK integrity:

```sql
-- Nuevas columnas en applications
ADD COLUMN hacker_house_id uuid REFERENCES hacker_houses(id) ON DELETE CASCADE
ADD COLUMN target_type text NOT NULL DEFAULT 'hack_space'

-- Constraint: exactamente una FK debe estar poblada
ADD CONSTRAINT applications_target_check CHECK (
  (hack_space_id IS NOT NULL AND hacker_house_id IS NULL) OR
  (hack_space_id IS NULL AND hacker_house_id IS NOT NULL)
)
```

`hack_space_id` se mantiene igual — código existente de Hack Spaces no cambia.

### DB: tabla `hacker_houses`
Columnas de `includes` como booleanas individuales (no JSONB). `images` como `text[]`. `modality` con default `'free'`.

### Participantes
- El creador cuenta como participante #1 — su `avatar_url` aparece primero
- `participants_count = accepted_applications + 1`
- Auto-transición a `'full'` cuando `participants_count >= capacity` al aceptar una aplicación
- En la card: hasta 6 avatares + overflow "+N"
- En el detalle: todos los avatares

### Imágenes
- Stored como `text[]` en Supabase
- Máx 5 fotos por Hacker House
- Primera imagen = portada (cover en card y hero en detalle)
- Detalle: hero grande + strip de thumbnails horizontal debajo

### Búsqueda en lista
- `q` hace `ilike` sobre `name` y `city` (OR) — útil para spaces físicos

### Status transitions (manual por el creador)
```
open → full (auto cuando capacity se completa, o manual)
open/full → active (el creador marca "Ya empezó")
active → finished (el creador marca "Terminó")
```

## UI: Card de Hacker House

| Elemento | Contenido |
|---|---|
| Header | Nombre + ciudad + país. Badge de modalidad: Gratuita / De pago / Con staking. |
| Fechas | '15–22 Marzo 2026' con ícono calendario. Countdown si quedan < 7 días. |
| Progreso | Barra: 'X/Y ETH recaudados' + 'X/Y cupos llenos'. Solo en modalidades de pago. |
| Qué incluye | Íconos: 🛏 Cuarto · 🍳 Comidas · 💻 Workspace · 🌐 Internet. Solo los que aplican. |
| Participantes | Avatares de builders confirmados con colores de arquetipo. |
| Evento vinculado | Badge con ícono: 'Antes / Durante / Después de ETH Global Cannes'. |
| CTA | 'Aplicar' / 'Pagar mi parte' / 'Lista de espera' según estado del builder. |
