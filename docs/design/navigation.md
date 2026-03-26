# Navegación y Rutas — Hacker House Protocol

## Bottom Navigation (5 Tabs)

| Tab | Ícono | Contenido |
|---|---|---|
| Home | Casa | Dashboard — CypherIdentityCard + HackSpacesFeed |
| Map | Pin | Mapa — pendiente |
| **Create +** | Plus central (botón circular) | Modal: elegir Hack Space o Hacker House |
| Builders | Personas | Explorar builders — pendiente |
| Profile | Avatar (kitten) | Cypher identity, skills, on-chain, Hack Spaces activos |

> En mobile el bottom nav muestra: Home · Map · **+** · Builders · Profile. No incluye Hack Spaces, Hacker Houses ni Notifications (solo accesibles en sidebar desktop o desde Home).

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
      map/page.tsx                    → /dashboard/map — pendiente
      builders/page.tsx               → /dashboard/builders — UI stub (search bar + "Coming soon")
      profile/page.tsx                → /dashboard/profile
      notifications/page.tsx          → /dashboard/notifications — "Coming soon"
```

## Todas las Rutas del MVP

| Ruta | Pantalla |
|---|---|
| `/` | Landing comercial |
| `/onboarding` | Registro + Cypher Identity (4 pasos) |
| `/dashboard` | Feed principal — carruseles personalizados (entry point post-login) |
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
| `/dashboard/builders` | Explorar builders, matching, sugerencias — pendiente (solo search bar) |
| `/dashboard/builders/[username]` | Perfil público de un builder — pendiente |
| `/dashboard/profile` | Mi Cypher Identity, skills, on-chain, Hack Spaces activos |
| `/dashboard/notifications` | Centro de notificaciones — pendiente ("Coming soon") |

## Pantalla: /dashboard — Estado actual (marzo 2026)

Layout actual implementado:
- **Mobile top bar**: logo centrado + ícono Bell (link a `/dashboard/notifications`) a la derecha.
- **Grid layout**: `grid-cols-1 lg:grid-cols-[320px_1fr]`
- **Columna izquierda**: `CypherIdentityCard` — muestra kitten, handle, arquetipo, skills, wallet del builder autenticado.
- **Columna derecha**: `HackSpacesFeed` — muestra los primeros Hack Spaces (open/full/in_progress).

### Carruseles planificados (pendientes)

Orden de los carruseles cuando estén implementados (priorizados por relevancia):

| # | Carrusel | Lógica |
|---|---|---|
| 1 | **Contexto activo** | Banner personalizado: 'X builders de tu red van a ETH Cannes' o 'Hay un Hack Space buscando tu skill'. |
| 2 | Eventos próximos | Hackathons y eventos en tu región o vinculados a tus POAPs. |
| 3 | Hack Spaces para ti | Proyectos que necesitan tus habilidades. Filtrado por skills y arquetipo. |
| 4 | Hacker Houses | Co-livings activos en tu región o vinculados a eventos próximos. |
| 5 | Builder Match | Builders sugeridos. Sidebar tipo X (Twitter). |
| 6 | Ciudades activas | Ciudades con mayor actividad builder. Puerta al mapa. |

## Pantalla: /onboarding

Ver detalle completo en [`docs/features/onboarding.md`](../features/onboarding.md).

## Pantalla: /map

- Vista alternativa accesible desde el bottom nav. No es la vista por defecto.
- **Macro** (mundo): estilo pixel art. Muestra eventos globales como pins.
- **Micro** (ciudad): Leaflet + OSM en tema oscuro. Pins de houses y builders.
- Al tocar un pin → bottom sheet con resumen del evento/house y builders de tu red que van.
- Filtros: eventos / houses / builders / todo.

## Estado actual (marzo 2026)

**Implementado:**
- `/dashboard` — layout con CypherIdentityCard + HackSpacesFeed, mobile top bar con Bell
- `/dashboard/hack-spaces` — listado, filtros, detalle, create, apply, manage applications
- `/dashboard/hacker-houses` — listado, filtros, detalle, create, apply, manage applications
- `/dashboard/profile` — perfil propio con edit mode
- `/onboarding` — wizard de 4 pasos + pantalla Scanning condicional
- Layout protegido: `AppSidebar` (desktop) + `BottomNav` (mobile) + auth guard

**Pendiente:**
- `/dashboard/map` — ruta existe, contenido no implementado
- `/dashboard/builders` — solo search bar visible, sin resultados reales
- `/dashboard/builders/[username]` — ruta no implementada
- `/dashboard/notifications` — muestra "Coming soon"
- `/dashboard/hacker-houses/[id]/payment` — Fase 2
- Carruseles personalizados en `/dashboard` — pendiente

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
