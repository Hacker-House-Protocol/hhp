# Feature: Matching y Feed — Hacker House Protocol

El matching opera en dos ejes: **contenido** (Hack Spaces y Hacker Houses relevantes) y **personas** (sugerencias de builders). El feed es el punto de entrada principal post-login.

---

## Variables del Algoritmo

> **Nota**: Solo las variables del matching Builder-Builder estan implementadas (ver seccion abajo). Las demas son planificadas.

- Habilidades del builder vs. roles requeridos en Hack Spaces y Hacker Houses
- Arquetipo primario (afinidad entre arquetipos complementarios)
- Region, zona horaria, idioma
- POAPs y comunidades compartidas (bonus de afinidad)
- Participacion en los mismos Hack Spaces o Hacker Houses previos
- Talent Protocol score y credenciales verificadas
- Eventos proximos marcados como 'voy a asistir'

---

## Matching Hack Space → Builder

> **Status**: Pendiente — no implementado aun

Cuando un Hack Space necesita un rol (ej: Frontend Developer), la plataforma:
1. Identifica builders con esa habilidad
2. Los muestra como sugerencia al creador del Hack Space
3. Esos builders ven ese Hack Space destacado en su feed como oportunidad relevante

---

## Matching Builder → Builder — ✅ Implementado

Sugerencias en el carrusel horizontal de `/dashboard/builders`, similar al panel de X (Twitter). **No es match bidireccional tipo Tinder** — es descubrimiento pasivo. El builder puede enviar solicitud de amistad via `ConnectButton`. Al aceptar, aparecen como primera opción al crear Hacker Houses.

### Algoritmo de sugerencias

Endpoint: `GET /api/builders/suggestions` (requiere auth). Evalua hasta 100 builders contra el perfil del usuario autenticado y devuelve los 10 con mayor score.

**Pesos del algoritmo:**

| Criterio | Peso | Detalle |
|---|---|---|
| Skills compartidos | 25% | `(shared_skills / max_skills) * 25` |
| Arquetipo complementario | 20% | Matriz de afinidad (ver abajo) |
| POAPs compartidos | 15% | `min(shared * 5, 15)` |
| Talent Tags compartidos | 15% | `min(shared * 3, 15)` |
| Proximidad geografica | 10% | Ciudad=10, Pais=7, Region=4 |
| Idiomas compartidos | 10% | `min(shared * 5, 10)` |
| Talent Score similar | 5% | `max(5 - diff/50, 0)` |

**Matriz de afinidad de arquetipos:**

| Par | Afinidad | Razon |
|---|---|---|
| Builder + Visionary | 1.0 | El equipo ideal: idea + ejecucion |
| Strategist + Visionary | 0.8 | Vision + operaciones |
| Builder + Strategist | 0.7 | Ejecucion + coordinacion |
| Mismo arquetipo | 0.3 | Complementariedad baja |

**Respuesta:** Cada `SuggestedBuilder` incluye `match_score` (0-100) y `match_reasons` (array de strings legibles como "3 shared skills", "Complementary archetype", "Same city").

### Service hooks

- `useSuggestedBuilders()` — `useAppQuery` con key `[queryKeys.builders, "suggestions"]`
- `useFilteredBuilders(params)` — `useInfiniteQuery` con paginacion, key `[queryKeys.builders, "filtered", params]`

---

## Mapa Interactivo — ✅ Implementado

Mapa full-screen en `/dashboard/map` con Leaflet + CARTO dark tiles. Muestra Hacker Houses y Hack Spaces geocodificados.

### Qué se muestra

| Entidad | Condición para aparecer | Icono |
|---|---|---|
| Hacker House | Tiene coordenadas `lat/lng` y status `open`, `full` o `active` | `Building2` (circular, color según estado) |
| Hack Space | Tiene coordenadas `lat/lng`, status `open`, `full` o `in_progress`, **y está vinculado a un evento** (`event_name` non-null) | `Code` (circular, color según estado) |

### Filtros

Pills flotantes centrados sobre el mapa: `All · Hacker Houses · Hack Spaces`. Filtrado client-side sobre los marcadores ya cargados.

### Popups

Al hacer click en un marcador se muestra un popup con: nombre, ciudad/país, evento vinculado, fechas del evento, capacidad o tamaño de equipo, imagen de portada, y conteo de participantes/miembros.

### Geocodificación

Las coordenadas se generan automáticamente al crear o editar una Hacker House o Hack Space que tenga `city` y `country`. Se usa Nominatim (OpenStreetMap) via `lib/geocode.ts`. La función `geocodeAndUpdate` es fire-and-forget — no bloquea la respuesta del POST/PATCH.

### API

- `GET /api/map/markers` — endpoint público (sin auth), retorna `{ markers: MapMarkerData[] }`. Incluye conteos de participantes/miembros calculados desde la tabla `applications`.

### Service hooks

- `useMapMarkers()` en `services/api/map.ts` — `useAppQuery` con key `[queryKeys.mapMarkers]`

### Comportamiento algoritmico

> **Status**: Pendiente — no implementado aun

| Trigger | Comportamiento |
|---|---|
| Hack Space vinculado a evento | Aparece destacado en el mapa en la ciudad del evento |
| Hacker House vinculada a evento | Pin en el mapa con badge del evento. Prioridad en feed de builders que siguen ese evento |
| Builder marcó que asistirá a evento | El algoritmo sugiere Hack Spaces y Hacker Houses vinculadas a ese evento. Su presencia aparece en el mapa. |

---

## Sistema de Amistad — ✅ Implementado

Flujo completo de conexion entre builders:

1. Builder A ve el perfil de Builder B (o su `BuilderCard` en `/dashboard/builders`)
2. Presiona "Connect" → `POST /api/friendships` crea la solicitud + notificacion `friend_request`
3. Builder B ve la solicitud en `/dashboard/notifications` o en el `ConnectButton` del perfil de A ("Accept" / "Decline")
4. Al aceptar → `PATCH /api/friendships/[id]` + notificacion `friend_accepted` para A
5. Ambos ven "Connected" en el perfil del otro. Pueden eliminar la conexion.

**API endpoints:**

| Metodo | Ruta | Descripcion |
|---|---|---|
| `POST` | `/api/friendships` | Enviar solicitud (requiere auth) |
| `GET` | `/api/friendships` | Listar amistades (filtro opcional por status) |
| `GET` | `/api/friendships/status/[userId]` | Estado de amistad con un usuario especifico |
| `PATCH` | `/api/friendships/[id]` | Aceptar/rechazar (solo el receptor) |
| `DELETE` | `/api/friendships/[id]` | Eliminar conexion (cualquiera de los dos) |

**Service hooks:** `services/api/friendships.ts` — `useFriendships`, `useFriendshipStatus`, `useSendFriendRequest`, `useUpdateFriendship`, `useRemoveFriendship`.

**Pendiente — no implementado aun:**
- Amigos aparecen como primera opcion al crear Hacker Houses
- Amigos que van a un evento se muestran en el mapa: 'X builders de tu red van a este evento'

---

## UI: Card de Builder — ✅ Implementado

Componente: `builder-card.tsx`. Acepta `UserProfile | SuggestedBuilder` y opcionalmente muestra info de match.

| Elemento | Contenido | Estado |
|---|---|---|
| Avatar | GIF Cypher Kitten con borde del color del arquetipo (16x16, circular). | ✅ |
| Handle | `@handle` en font-mono. Fallback: wallet truncada o "Anonymous Builder". | ✅ |
| Arquetipo badge | Badge con variante de color del arquetipo (`visionary-outline`, etc.). | ✅ |
| Bio | Texto truncado a 2 lineas, `text-muted-foreground`. | ✅ |
| Skills | Hasta 3 skills en pills `variant="secondary"`. Badge `+N` si hay mas. | ✅ |
| Talent Tags | Hasta 2 tags en pills `variant="outline"`. | ✅ |
| Match info | Solo en modo sugerencias: `X% match` + primera razon. | ✅ |
| CTA | `ConnectButton` — "Connect" / "Pending" / "Accept+Decline" / "Connected". Fuera del `<Link>` para no navegar al hacer click. | ✅ |

**No implementado aun:**
- Wallet truncada visible en la card
- Verified badge
- POAPs recientes en la card
- "Onchain since" en la card

---

## Notificaciones — ✅ Implementado

Centro de notificaciones en `/dashboard/notifications` con:

- Listado paginado (`useInfiniteQuery`, 20 por pagina) con carga incremental ("Load more")
- Mark individual como leida (`PATCH /api/notifications/[id]`)
- Mark all as read (`PATCH /api/notifications/read-all`)
- Badge de unread count en el icono Bell del top bar y sidebar (`NotificationBadge`)
- Estado vacio con icono y mensaje descriptivo
- Tipos de notificacion activos: `friend_request`, `friend_accepted`, `hack_space_application`, `hack_space_accepted`, `hacker_house_application`, `hacker_house_accepted`

### NotificationBadge

Componente: `app/(protected)/_components/notification-badge.tsx`. Muestra el contador de notificaciones no leidas usando `useUnreadNotificationCount`. Acepta prop `variant`:

- `"absolute"` (default) — badge circular posicionado absolute sobre el icono Bell. Usado en sidebar collapsed y en el top bar mobile de `/dashboard`.
- `"inline"` — badge inline con `ml-auto`. Usado en sidebar expanded junto al label "Notifications".

Se oculta automaticamente cuando el count es 0 (retorna `null`).

### API endpoints

| Metodo | Ruta | Descripcion |
|---|---|---|
| `GET` | `/api/notifications` | Listar notificaciones (paginado) |
| `PATCH` | `/api/notifications/[id]` | Marcar como leida |
| `PATCH` | `/api/notifications/read-all` | Marcar todas como leidas |
| `GET` | `/api/notifications/unread-count` | Contador de no leidas |

**Service hooks:** `services/api/notifications.ts` — `useNotifications`, `useUnreadNotificationCount`, `useMarkNotificationRead`, `useMarkAllNotificationsRead`.

---

## Estado actual (abril 2026)

**Implementado:**
- `/dashboard` muestra `HackSpacesFeed` como feed principal (Hack Spaces open/full/in_progress)
- `CypherIdentityCard` en sidebar del dashboard
- `/dashboard/builders` — listado paginado completo con filtro por arquetipo, busqueda por handle/bio, carrusel de sugerencias algoritmicas
- `BuilderCard` — card completa con avatar, handle, archetype, bio, skills, talent tags, match info, `ConnectButton`
- Algoritmo de matching Builder-Builder — scoring ponderado por skills, arquetipo, POAPs, talent tags, ubicacion, idiomas, talent score
- Sistema de amistad completo — enviar/aceptar/rechazar/eliminar conexiones con notificaciones automaticas
- Centro de notificaciones — listado paginado, mark as read, badge de unread
- `NotificationBadge` en top bar mobile y sidebar desktop
- Mapa interactivo — Leaflet + CARTO dark tiles, marcadores de Hacker Houses y Hack Spaces vinculados a eventos, filtros por tipo, popups, geocodificacion automatica via Nominatim

**Pendiente:**
- Matching Hack Space-Builder (contenido relevante en feed) — pendiente
- Carruseles personalizados en feed — pendiente
- Amigos como primera opcion al crear Hacker Houses — pendiente
- Builders en el mapa — pendiente
- Builders que marcaron asistencia a evento visibles en el mapa — pendiente
