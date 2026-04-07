# Navegación y Rutas — Hacker House Protocol

## Bottom Navigation (5 Tabs)

| Tab | Ícono | Contenido |
|---|---|---|
| Home | Casa | Dashboard — 3 feeds: HackSpacesFeed + HackerHousesFeed + SuggestedBuildersFeed |
| Map | Pin | Mapa interactivo — Leaflet dark tiles, marcadores de Hacker Houses y Hack Spaces vinculados a eventos, filtros por tipo ✅ |
| **Create +** | Plus central (botón circular) | Modal: elegir Hack Space o Hacker House |
| Builders | Personas | Explorar builders — listado con filtros, sugerencias y cards ✅ |
| Profile | Avatar (kitten) | Cypher identity, skills, on-chain, Hack Spaces activos |

> En mobile el bottom nav muestra: Home · Map · **+** · Builders · Profile. No incluye Hack Spaces, Hacker Houses ni Notifications (solo accesibles en sidebar desktop o desde sus respectivas listado pages).

## Flujo Principal

```
hackerhouse.app (landing)
  └── /onboarding  →  Auth Privy → importación on-chain → Cypher Identity
        └── /dashboard  →  Entry point post-login (feed principal)
```

## Estructura de rutas

Todo el contenido autenticado vive bajo el prefijo `/dashboard`, dentro del route group `(protected)`. Las rutas públicas (landing, onboarding) viven en `(public)`.

```
app/
  (public)/
    page.tsx                          → hackerhouse.app (landing)
    onboarding/page.tsx               → /onboarding
  (protected)/
    layout.tsx                        → SidebarProvider + AppSidebar + BottomNav (auth guard)
    _components/
      app-sidebar.tsx                 → sidebar desktop (Home, Hack Spaces, Hacker Houses, Builders, Map, Notifications)
      bottom-nav.tsx                  → nav mobile (Home, Map, +, Builders, Profile)
      back-button.tsx                 → botón Back mobile-only
    dashboard/
      page.tsx                        → /dashboard (feed principal, entry point post-login)
      hack-spaces/page.tsx            → /dashboard/hack-spaces
      hack-spaces/[id]/page.tsx       → /dashboard/hack-spaces/[id]
      hack-spaces/[id]/edit/page.tsx  → /dashboard/hack-spaces/[id]/edit
      hack-spaces/create/page.tsx     → /dashboard/hack-spaces/create
      hacker-houses/page.tsx          → /dashboard/hacker-houses
      hacker-houses/[id]/page.tsx     → /dashboard/hacker-houses/[id]
      hacker-houses/[id]/edit/page.tsx → /dashboard/hacker-houses/[id]/edit
      hacker-houses/create/page.tsx   → /dashboard/hacker-houses/create
      map/page.tsx                    → /dashboard/map — mapa interactivo con Leaflet ✅
      builders/page.tsx               → /dashboard/builders — listado completo con filtros y sugerencias ✅
      builders/[username]/page.tsx    → /dashboard/builders/[username] — perfil público ✅
      profile/page.tsx                → /dashboard/profile
      notifications/page.tsx          → /dashboard/notifications — centro de notificaciones ✅
```

## Todas las Rutas del MVP

| Ruta | Pantalla |
|---|---|
| `/` | Landing comercial |
| `/onboarding` | Registro + Cypher Identity (4 pasos) |
| `/dashboard` | Feed principal — 3 carruseles horizontales: Hack Spaces, Hacker Houses, Suggested Builders (entry point post-login) |
| `/dashboard/map` | Mapa interactivo filtrable (Leaflet + OSM) |
| `/dashboard/hack-spaces` | Listado de Hack Spaces con filtros |
| `/dashboard/hack-spaces/[id]` | Detalle, aplicar, ver equipo, ver evento vinculado |
| `/dashboard/hack-spaces/create` | Formulario de creación multi-paso |
| `/dashboard/hack-spaces/[id]/edit` | Editar Hack Space (solo creador) |
| `/dashboard/hacker-houses` | Listado de Hacker Houses con filtros |
| `/dashboard/hacker-houses/[id]` | Detalle, aplicar, ver participantes, ver evento vinculado |
| `/dashboard/hacker-houses/create` | Formulario de creación multi-paso |
| `/dashboard/hacker-houses/[id]/edit` | Editar Hacker House (solo creador) |
| `/dashboard/hacker-houses/[id]/payment` | Pago grupal, split, estado del contrato — Fase 2 — pendiente |
| `/dashboard/builders` | Explorar builders — ✅ implementado: listado paginado, filtro por arquetipo, search, carrusel de sugerencias algorítmicas |
| `/dashboard/builders/[username]` | Perfil público de un builder — ✅ implementado (usa `ProfileView` con `isOwner=false`, `ConnectButton`) |
| `/dashboard/profile` | Mi Cypher Identity, skills, on-chain (Talent Score + Tags + POAPs), Hack Spaces activos |
| `/dashboard/notifications` | Centro de notificaciones — ✅ implementado: listado paginado, mark as read, mark all as read, badge de unread |

## Pantalla: /dashboard — Estado actual (abril 2026)

Layout actual implementado:
- **Mobile top bar**: logo centrado + icono Bell (link a `/dashboard/notifications`) con `NotificationBadge` a la derecha.
- **Layout**: columna unica vertical con 3 carruseles horizontales apilados (`flex flex-col gap-8`).
- **Feed 1**: `HackSpacesFeed` — Hack Spaces recientes (open/full/in_progress) en scroll horizontal. Header con contador total, "View all" link y boton "+ Create".
- **Feed 2**: `HackerHousesFeed` — Hacker Houses recientes (open/full/active) en scroll horizontal. Mismo patron de header.
- **Feed 3**: `SuggestedBuildersFeed` — Builders sugeridos por algoritmo de matching en scroll horizontal. "View all" link a `/dashboard/builders`.
- Sin `CypherIdentityCard` en el dashboard — removido.

### Carruseles planificados (pendientes)

Orden de carruseles adicionales planificados:

| # | Carrusel | Logica |
|---|---|---|
| 1 | **Contexto activo** | Banner personalizado: 'X builders de tu red van a ETH Cannes' o 'Hay un Hack Space buscando tu skill'. |
| 2 | Eventos proximos | Hackathons y eventos en tu region o vinculados a tus POAPs. |
| 3 | Ciudades activas | Ciudades con mayor actividad builder. Puerta al mapa. |

## Pantalla: /onboarding

Ver detalle completo en [`docs/features/onboarding.md`](../features/onboarding.md).

## Pantalla: /map — ✅ Implementado

Mapa interactivo full-screen accesible desde el bottom nav (mobile) y sidebar (desktop).

- **Tiles**: CARTO dark (`basemaps.cartocdn.com/dark_all`) — tema oscuro consistente con el design system.
- **Vista inicial**: centrado en `[20, 0]` zoom 2 (vista mundial).
- **Marcadores**: iconos circulares con `DivIcon` de Leaflet. `Building2` para Hacker Houses, `Code` para Hack Spaces. Color del borde/fondo según estado (`open` = primary, `full` = builder-archetype, `active/in_progress` = strategist).
- **Filtros**: pills flotantes centrados arriba del mapa — `All · Hacker Houses · Hack Spaces`. Toggle activo con borde y fondo primary.
- **Popups**: al hacer click en un marcador, popup con datos clave (nombre, ciudad, evento, capacidad/miembros, imagen).
- **Datos**: `GET /api/map/markers` — retorna Hacker Houses con coordenadas (`open/full/active`) y Hack Spaces con coordenadas **solo si están vinculados a un evento** (`open/full/in_progress`).
- **Estado vacío**: overlay centrado con mensaje contextual según filtro activo.
- **SSR**: `dynamic(() => import(...), { ssr: false })` — Leaflet se carga solo en cliente.
- **Geocodificación**: las coordenadas `lat/lng` se generan automáticamente al crear/editar via Nominatim OSM (ver `lib/geocode.ts`). Fire-and-forget — no bloquea la respuesta.

## Estado actual (abril 2026)

**Implementado:**
- `/dashboard` — 3 carruseles horizontales (HackSpacesFeed + HackerHousesFeed + SuggestedBuildersFeed), mobile top bar con Bell + NotificationBadge
- `/dashboard/hack-spaces` — listado, filtros, detalle, create, apply, manage applications
- `/dashboard/hacker-houses` — listado, filtros, detalle, create, apply, manage applications
- `/dashboard/profile` — perfil propio con edit mode, Talent Tags, credentials
- `/dashboard/builders/[username]` — perfil publico con `ProfileView` (`isOwner=false`) + `ConnectButton` (friendship)
- `/dashboard/builders` — listado paginado con filtros (archetype, search), carrusel de sugerencias algoritmicas, `BuilderCard` con `ConnectButton`
- `/dashboard/notifications` — centro de notificaciones: listado paginado, mark individual/all as read, badge de unread en Bell
- `/onboarding` — wizard de 4 pasos + pantalla Scanning condicional (importa score, tags y credentials de Talent Protocol)
- Layout protegido: `AppSidebar` (desktop) + `BottomNav` (mobile) + auth guard

- `/dashboard/map` — mapa interactivo con Leaflet: Hacker Houses + Hack Spaces vinculados a eventos, filtros por tipo, popups, geocodificación automática

**Pendiente:**
- `/dashboard/hacker-houses/[id]/payment` — Fase 2
- Carruseles adicionales en `/dashboard` (contexto activo, eventos, ciudades) — pendiente

---

## Pantalla: /hacker-houses/[id]/pago

| Elemento UI | Descripción |
|---|---|
| Header de la house | Nombre, fechas, ciudad, capacidad. Barra de progreso: 'X/Y ETH recaudados'. Contador: 'X/Y cupos llenos'. |
| Lista de participantes | Estado de pago por builder: Pendiente / Pagó / Reembolsado. Wallet truncada + badge de arquetipo. |
| Split automático | 'Tu parte: 0.05 ETH' — monto total / número de participantes. |
| Botón de pago | CTA: 'Pagar mi parte'. Abre flujo de firma via Privy. Sin gas visible. |
| Estado del contrato | 'Fondos en custodia del contrato. Se liberan al creador cuando el 100% esté pagado.' |
| Countdown | Si faltan 7 días y el monto no se alcanzó, muestra countdown a reembolso automático. |
