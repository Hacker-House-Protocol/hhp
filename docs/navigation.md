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
  └── /onboarding  →  Auth Privy → importación on-chain → avatar + arquetipo
        └── /home  →  Dashboard (entry point post-login)
```

## Todas las Rutas del MVP

| Ruta | Pantalla |
|---|---|
| `hackerhouse.app` | Landing comercial |
| `/onboarding` | Registro + cypher identity + avatar + arquetipo |
| `/home` | Dashboard con carruseles personalizados |
| `/map` | Mapa interactivo filtrable (Leaflet + OSM) |
| `/hack-spaces` | Listado de Hack Spaces con filtros |
| `/hack-spaces/[id]` | Detalle, aplicar, ver equipo, ver evento vinculado |
| `/hack-spaces/crear` | Formulario de creación multi-paso |
| `/hacker-houses` | Listado de Hacker Houses con filtros |
| `/hacker-houses/[id]` | Detalle, aplicar, ver participantes, ver evento vinculado |
| `/hacker-houses/crear` | Formulario de creación multi-paso |
| `/hacker-houses/[id]/pago` | Pago grupal, split, estado del contrato |
| `/hacker-houses/[id]/confirmacion` | Confirmación de pago con countdown |
| `/builders` | Explorar builders, matching, sugerencias |
| `/builders/[username]` | Perfil público de un builder |
| `/perfil` | Mi cypher identity, settings, linked accounts |
| `/dashboard` | Panel del creador: asistencia, applicants, estado de pagos |
| `/notificaciones` | Centro de notificaciones |

## Pantalla: /home — Carruseles

Orden de los carruseles (priorizados por relevancia):

| # | Carrusel | Lógica |
|---|---|---|
| 1 | **Contexto activo** | Banner personalizado: 'X builders de tu red van a ETH Cannes' o 'Hay un Hack Space buscando tu skill'. |
| 2 | Eventos próximos | Hackathons y eventos en tu región o vinculados a tus POAPs. |
| 3 | Hack Spaces para ti | Proyectos que necesitan tus habilidades. Filtrado por skills y arquetipo. |
| 4 | Hacker Houses | Co-livings activos en tu región o vinculados a eventos próximos. |
| 5 | Builder Match | Builders sugeridos. Sidebar tipo X (Twitter). |
| 6 | Ciudades activas | Ciudades con mayor actividad builder. Puerta al mapa. |

## Pantalla: /onboarding — 3 Pasos

| Paso | Acción | Detalle |
|---|---|---|
| 1 | Auth con Privy | Login social (Gmail, Apple, magic link) o wallet (MetaMask, WalletConnect, Coinbase). Sin wallet → embedded wallet automática. |
| 2 | Importación on-chain | Lectura automática de POAPs y perfil de Talent Protocol. Sin formularios manuales. |
| 3 | Cypher Identity | Selección de arquetipo primario + Cypher Kitten + campos opcionales (bio, idiomas, zona horaria). |

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
