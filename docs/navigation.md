# Navegación y Rutas — Hacker House Protocol

## Bottom Navigation (5 Tabs)

| Tab | Ícono | Contenido |
|---|---|---|
| Home | Casa / Grid | Dashboard con carruseles personalizados |
| Map | Globo / Pin | Mapa interactivo con eventos, houses y builders |
| **Create +** | Plus central | Modal: elegir Hack Space o Hacker House. Botón central prominente. |
| Network | Personas | Builders sugeridos, conexiones, solicitudes pendientes |
| Profile | Avatar (kitten) | Cypher identity, achievement gallery, Hack Spaces y Houses activas, settings |

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
    page.tsx                      → hackerhouse.app (landing)
    onboarding/page.tsx           → /onboarding
  (protected)/
    dashboard/
      page.tsx                    → /dashboard (feed principal, entry point post-login)
      hack-spaces/page.tsx        → /dashboard/hack-spaces
      hack-spaces/[id]/page.tsx   → /dashboard/hack-spaces/[id]
      hack-spaces/create/page.tsx → /dashboard/hack-spaces/create
      hacker-houses/page.tsx      → /dashboard/hacker-houses
      map/page.tsx                → /dashboard/map
      builders/page.tsx           → /dashboard/builders
      perfil/page.tsx             → /dashboard/perfil
      notificaciones/page.tsx     → /dashboard/notificaciones
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
| `/dashboard/hacker-houses` | Listado de Hacker Houses con filtros |
| `/dashboard/hacker-houses/[id]` | Detalle, aplicar, ver participantes, ver evento vinculado |
| `/dashboard/hacker-houses/[id]/pago` | Pago grupal, split, estado del contrato |
| `/dashboard/hacker-houses/[id]/confirmacion` | Confirmación de pago con countdown |
| `/dashboard/builders` | Explorar builders, matching, sugerencias |
| `/dashboard/builders/[username]` | Perfil público de un builder |
| `/dashboard/perfil` | Mi Cypher Identity, settings, linked accounts |
| `/dashboard/notificaciones` | Centro de notificaciones |

## Pantalla: /dashboard — Estado actual (marzo 2026)

Layout actual implementado:
- **Sidebar izquierdo**: `CypherIdentityCard` — muestra kitten, handle, arquetipo, skills, wallet del builder autenticado.
- **Contenido principal**: `HackSpacesFeed` — muestra los primeros 3 Hack Spaces (open/full/in_progress) con link "View all →".

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

## Pantalla: /onboarding — 4 Pasos

| Paso | Acción | Detalle |
|---|---|---|
| 0 | Auth con Privy | Login social (Gmail, Apple, magic link) o wallet (MetaMask, WalletConnect, Coinbase). Sin wallet → embedded wallet automática. |
| 1 | Archetype | Elige tu rol: Visionary / Strategist / Builder. |
| 2 | Identity | Handle permanente (`@username`) + Cypher Kitten (avatar). |
| 3 | Skills | Skills filtradas por arquetipo. |
| 4 | Context | Bio, idiomas, ubicación, links sociales. Skippable. |

Ver detalle completo en `docs/features/onboarding.md`.

## Pantalla: /map

- Vista alternativa accesible desde el bottom nav. No es la vista por defecto.
- **Macro** (mundo): estilo pixel art. Muestra eventos globales como pins.
- **Micro** (ciudad): Leaflet + OSM en tema oscuro. Pins de houses y builders.
- Al tocar un pin → bottom sheet con resumen del evento/house y builders de tu red que van.
- Filtros: eventos / houses / builders / todo.

## Pantalla: /hacker-houses/[id]/pago

| Elemento UI | Descripción |
|---|---|
| Header de la house | Nombre, fechas, ciudad, capacidad. Barra de progreso: 'X/Y ETH recaudados'. Contador: 'X/Y cupos llenos'. |
| Lista de participantes | Estado de pago por builder: Pendiente / Pagó / Reembolsado. Wallet truncada + badge de arquetipo. |
| Split automático | 'Tu parte: 0.05 ETH' — monto total / número de participantes. |
| Botón de pago | CTA: 'Pagar mi parte'. Abre flujo de firma via Privy. Sin gas visible. |
| Estado del contrato | 'Fondos en custodia del contrato. Se liberan al creador cuando el 100% esté pagado.' |
| Countdown | Si faltan 7 días y el monto no se alcanzó, muestra countdown a reembolso automático. |
