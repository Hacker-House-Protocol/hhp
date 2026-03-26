# Data Models — Hacker House Protocol

Shapes de datos para mockear el frontend. Refleja las tablas de Supabase + campos del producto.

---

## Profile (Builder)

```ts
type Archetype = 'visionary' | 'strategist' | 'builder'

interface UserProfile {
  id: string
  privy_id: string
  handle: string | null           // alias público, oculta wallet real
  bio: string | null
  archetype: string | null
  skills: string[] | null
  wallet_address: string | null   // truncada en UI: 0xd7ed...6C0e
  email: string | null
  onboarding_step: string | null  // 'archetype' | 'identity' | 'skills' | 'context' | 'complete'
  avatar_url: string | null       // GIF del Cypher Kitten seleccionado
  languages: string[] | null
  timezone: string | null
  region: string | null
  country: string | null
  city: string | null
  github_url: string | null
  twitter_url: string | null
  farcaster_url: string | null
  website_url: string | null
  is_verified: boolean            // tiene Talent Protocol y/o POAP conectados
  talent_protocol_score: number | null
  poaps: POAP[]
  onchain_since: string | null
  created_at: string
  updated_at: string
}

type POAP = {
  id: string
  name: string
  image_url: string
  event_date: string
}
```

---

## Hack Space

```ts
type HackSpaceStatus = 'open' | 'full' | 'in_progress' | 'finished'
type HackSpaceTrack = 'DeFi' | 'DAO tools' | 'AI' | 'Social' | 'Gaming' | 'NFTs' | 'Infrastructure' | 'Other'
type ProjectStage = 'idea' | 'prototype' | 'in_development'
type ApplicationType = 'open' | 'invite_only' | 'curated'
type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

interface HackSpaceParticipant {
  id: string
  handle: string | null
  archetype: string | null
  avatar_url: string | null
}

interface HackSpace {
  id: string
  title: string                     // campo en DB y UI es "title", no "name"
  description: string
  track: HackSpaceTrack
  stage: ProjectStage
  repo_url: string | null
  status: HackSpaceStatus
  // creator_id no se expone en el tipo cliente — se accede vía creator.id
  creator: {
    id: string
    handle: string | null
    archetype: string | null
    avatar_url: string | null
  }
  looking_for: string[]             // arquetipos buscados: ['visionary', 'strategist', 'builder']
  skills_needed: string[]
  max_team_size: number
  experience_level: ExperienceLevel
  language: string[]                // multi-select, default ['English']
  region: string | null
  country: string | null
  city: string | null
  image_url: string | null
  application_type: ApplicationType
  application_deadline: string | null
  // Participants — member_count = accepted_applications + 1
  member_count?: number
  participants?: HackSpaceParticipant[]
  // Evento relacionado (opcional)
  event_name: string | null
  event_url: string | null
  event_start_date: string | null
  event_end_date: string | null
  event_timing: string[] | null     // multi-select: ['before', 'during', 'after']
  created_at: string
}
```

---

## Hacker House

```ts
type HouseModality = 'free' | 'paid' | 'staking'
// 'paid' and 'staking' are Fase 2 only. Fase 1 hardcodes modality = 'free'.
type HouseStatus = 'open' | 'full' | 'active' | 'finished'

interface HackerHouse {
  id: string
  name: string
  city: string
  country: string
  neighborhood: string | null     // zona aproximada, sin dirección exacta
  start_date: string
  end_date: string
  capacity: number                // total cupos incluyendo el creador
  modality: HouseModality         // Fase 1: siempre 'free'
  // cost_per_person, cost_currency, sponsored_by — Fase 2
  // Amenities — columnas booleanas individuales
  includes_private_room: boolean
  includes_shared_room: boolean
  includes_meals: boolean
  includes_workspace: boolean
  includes_internet: boolean
  // Imágenes — array de URLs, primera es la portada, máx 5
  images: string[]
  profile_sought: string[]        // arquetipos: ['visionary', 'strategist', 'builder']
  language: string[]
  house_rules: string | null      // texto libre, máx 500 chars
  status: HouseStatus
  // creator_id no se expone en el tipo cliente — se accede vía creator.id
  creator: HackerHouseParticipant
  // Participants — el creador cuenta como participante #1
  // participants_count = accepted_applications + 1
  participants: HackerHouseParticipant[]
  participants_count: number
  application_type: ApplicationType
  application_deadline: string    // requerido en creación
  // Filtros on-chain — Fase 2 — pendiente
  // required_poaps, required_nfts, min_talent_score, staking_amount
  // Contrato — Fase 2 — pendiente
  // contract_address, funds_raised, target_funds
  // Evento relacionado (opcional)
  event_name: string | null
  event_url: string | null
  event_start_date: string | null
  event_end_date: string | null
  event_timing: string[] | null
  created_at: string
}
```

---

## Application

```ts
type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
type ApplicationTargetType = 'hack_space' | 'hacker_house'

// Tabla unificada con dos FKs nullable (una por entidad).
// Exactamente una de hack_space_id / hacker_house_id es non-null (CHECK constraint en DB).
// Se usa target_type como discriminador de conveniencia.
interface Application {
  id: string
  applicant_id: string
  target_type: ApplicationTargetType
  hack_space_id: string | null      // FK → hack_spaces.id
  hacker_house_id: string | null    // FK → hacker_houses.id
  message: string | null
  status: ApplicationStatus
  created_at: string
}

interface ApplicationWithApplicant extends Application {
  applicant: {
    id: string
    handle: string | null
    archetype: string | null
    skills: string[] | null
    avatar_url: string | null
  }
}
```

---

## Friendship

```ts
type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

type Friendship = {
  id: string
  requester_id: string
  receiver_id: string
  status: FriendshipStatus
  created_at: string
}
```

---

## Event

```ts
type Event = {
  id: string
  name: string
  city: string
  country: string
  lat?: number
  lng?: number
  start_date: string
  end_date: string
  external_url: string            // link a Luma u otro
  attendees_count?: number        // builders que marcaron 'voy a asistir'
}
```

---

## Notification

```ts
type NotificationType =
  | 'hack_space_application'
  | 'hack_space_accepted'
  | 'hacker_house_application'
  | 'hacker_house_accepted'
  | 'friend_request'
  | 'friend_accepted'
  | 'payment_confirmed'
  | 'refund_executed'
  | 'team_complete'

type Notification = {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string
  link?: string
  read: boolean
  created_at: string
}
```

### Copy por trigger

| Trigger | Texto |
|---|---|
| Alguien aplica a tu Hack Space | '[Username] quiere unirse a [Nombre del Hack Space]' |
| Te aceptaron en un Hack Space | '¡Estás dentro! [Nombre del Hack Space] te aceptó' |
| Alguien aplica a tu Hacker House | '[Username] quiere ir a [Nombre de la House]' |
| Te aceptaron en Hacker House | '¡Confirmado! Eres parte de [Nombre de la House]' |
| Solicitud de amistad recibida | '[Username] quiere conectar contigo' |
| Solicitud de amistad aceptada | '[Username] aceptó tu solicitud' |
| Pago confirmado | 'Tu pago de 0.05 ETH fue recibido. Quedan X/Y pagos para completar la house.' |
| Reembolso automático | 'La house no se completó. Tu ETH fue reembolsado automáticamente.' |
| Hack Space team completo | 'Tu equipo está completo. ¿Querés crear una Hacker House con ellos?' + shortcut |

---

## Estado actual (marzo 2026)

**Implementado y en uso:** `UserProfile`, `HackSpace`, `HackerHouse`, `Application`, `ApplicationWithApplicant`, `POAP`. Todos los tipos viven en `lib/types.ts`. Schemas Zod en `lib/schemas/`.

**Planificado pero no implementado:**
- `Friendship` — pendiente (Fase 2)
- `Event` — pendiente
- `Notification` — tipo definido en esta doc, tabla y UI pendientes
- Campos de contrato/pago en `HackerHouse` — pendiente (Fase 2)
- Filtros on-chain en `HackerHouse` — pendiente (Fase 2)

---

## Tablas de Supabase (resumen)

| Tabla | Descripción |
|---|---|
| `users` | Datos del builder: handle, bio, habilidades, arquetipo, wallet, links, avatar |
| `hack_spaces` | Proyectos virtuales con filtros, estados y evento vinculado |
| `hacker_houses` | Espacios físicos: ciudad, fechas, modalidad de pago, evento vinculado |
| `applications` | Solicitudes de ingreso a hack spaces y hacker houses |
| `friendships` | Relaciones entre builders |
| `organizations` | Entidades verificadas para Hacker Houses patrocinadas |
| `notifications` | Registro de eventos: aplicaciones, pagos, amistades |
| `events` | Eventos externos curados con builders que marcaron asistencia |
