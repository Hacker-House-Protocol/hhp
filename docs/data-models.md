# Data Models — Hacker House Protocol

Shapes de datos para mockear el frontend. Refleja las tablas de Supabase + campos del producto.

---

## Profile (Builder)

```ts
type Archetype = 'visionary' | 'strategist' | 'builder'

type Profile = {
  id: string
  handle: string                  // alias público, oculta wallet real
  bio?: string
  archetype: Archetype
  avatar_url: string              // GIF del Cypher Kitten seleccionado
  wallet_address?: string         // opcional, truncada en UI: 0xd7ed...6C0e
  onchain_since?: string          // fecha del primer registro on-chain
  skills: string[]                // ['Frontend', 'Smart Contracts', 'Design', ...]
  languages: string[]
  timezone?: string
  region?: string
  github_url?: string
  twitter_url?: string
  farcaster_url?: string
  website_url?: string
  is_verified: boolean            // tiene Talent Protocol y/o POAP conectados
  talent_protocol_score?: number
  poaps: POAP[]
  created_at: string
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

type HackSpace = {
  id: string
  name: string
  description: string
  track: HackSpaceTrack
  stage: ProjectStage
  repo_url?: string
  status: HackSpaceStatus
  creator_id: string
  members: Profile[]
  max_team_size: number
  skills_needed: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  language: string[]
  timezone_region?: string
  application_type: ApplicationType
  application_deadline?: string
  // Filtros on-chain
  required_poaps?: string[]
  required_nfts?: string[]
  min_talent_score?: number
  // Evento relacionado (opcional)
  event_id?: string
  event_name?: string
  event_url?: string
  event_start_date?: string
  event_end_date?: string
  event_timing?: string[]
  created_at: string
}
```

---

## Hacker House

```ts
type HouseModality = 'free' | 'paid' | 'staking'
// 'paid' and 'staking' are Fase 2 only. Fase 1 hardcodes modality = 'free'.
type HouseStatus = 'open' | 'full' | 'active' | 'finished'

type HackerHouse = {
  id: string
  name: string
  city: string
  country: string
  neighborhood?: string           // zona aproximada, sin dirección exacta
  start_date: string
  end_date: string
  capacity: number                // total cupos incluyendo el creador
  modality: HouseModality
  cost_per_person?: number        // en ETH, solo si paid o staking — Fase 2
  cost_currency?: string          // 'ETH' — Fase 2
  sponsored_by?: string           // org_id si es patrocinada — Fase 2
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
  house_rules?: string            // texto libre, máx 500 chars
  status: HouseStatus
  creator_id: string
  // Participants — el creador cuenta como participante #1
  // participants_count = accepted_applications + 1
  participants_count: number
  participants: {                 // hasta 6 en card, todos en detalle
    id: string
    handle: string | null
    archetype: string | null
    avatar_url: string | null
  }[]
  application_type: ApplicationType
  application_deadline?: string
  // Filtros on-chain — Fase 2
  required_poaps?: string[]
  required_nfts?: string[]
  min_talent_score?: number
  staking_amount?: number
  // Contrato — Fase 2
  contract_address?: string
  funds_raised?: number
  target_funds?: number
  // Evento relacionado (opcional)
  event_name?: string
  event_url?: string
  event_start_date?: string
  event_end_date?: string
  event_timing?: string[]
  created_at: string
  creator: {
    id: string
    handle: string | null
    archetype: string | null
    avatar_url: string | null
  }
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
type Application = {
  id: string
  applicant_id: string
  target_type: ApplicationTargetType
  hack_space_id: string | null      // FK → hack_spaces.id
  hacker_house_id: string | null    // FK → hacker_houses.id
  message: string | null
  status: ApplicationStatus
  created_at: string
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
