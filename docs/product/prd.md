# PRD — Hacker House Protocol MVP

**Versión**: 1.0 · Marzo 2026
**Estado**: En desarrollo

---

## Objetivo del MVP

Validar que builders del ecosistema Web3 quieren usar una plataforma para formar equipos online (Hack Spaces) y coordinar co-living físico (Hacker Houses). El MVP no necesita ser perfecto — necesita que el flujo core funcione de punta a punta sin errores críticos.

> El MVP está terminado cuando un builder puede: registrarse, crear su identidad, crear y aplicar a un Hack Space, y crear y aplicar a una Hacker House.

---

## Usuarios objetivo

| Fase | Audiencia | Objetivo |
|---|---|---|
| **Alpha** | Equipo fundador | Dogfooding — encontrar bugs y friction antes de abrir |
| **Beta privada** | Builders conocidos del ecosistema, ETH Global Cannes | Validar flujo con usuarios reales, capturar feedback cualitativo |
| **Beta pública** | Comunidad Web3 global vía waitlist | Validar retención y uso recurrente |

---

## Métricas de éxito

### MVP (mes 1)
| Métrica | Target primer mes |
|---|---|
| Builders registrados | 50 |
| Hack Spaces creados | 10 |
| Aplicaciones enviadas a Hack Spaces | 25 |
| Hacker Houses creadas | 3 |

---

## Flujo core del MVP

El flujo mínimo que debe funcionar sin errores para considerar el MVP completo:

```
Landing → Auth (Privy)
  └── Onboarding → Cypher Identity
        └── /dashboard (feed)
              ├── Hack Spaces → Crear → Listar → Aplicar → Aceptar/Rechazar
              └── Hacker Houses → Crear → Listar → Aplicar → Aceptar/Rechazar
```

---

## Features IN scope — MVP

### 1. Landing
- Página de marketing en `/`
- Sin waitlist — acceso directo al MVP (ver `docs/landing-page.md`)

**Criterio de aceptación**: un visitante entiende la propuesta y puede hacer login directo.

---

### 2. Onboarding + Cypher Identity
- Auth via Privy (social + wallet + embedded wallet)
- Importación automática de POAPs y Talent Protocol score
- Selección de arquetipo primario
- Selección de Cypher Kitten
- Campos opcionales: bio, skills, idiomas, zona horaria, links

**Criterio de aceptación**: un builder sin wallet puede registrarse con Gmail, completar su Cypher Identity, y llegar al `/dashboard`.

---

### 3. Hack Spaces
- Crear Hack Space (formulario multi-paso)
- Listar Hack Spaces con filtros por skills
- Ver detalle de un Hack Space
- Aplicar a un Hack Space
- El creador puede aceptar o rechazar aplicaciones
- Estados: Buscando miembros → Equipo completo → En progreso → Finalizado

**Criterio de aceptación**: Builder A crea un Hack Space, Builder B lo encuentra en el feed y aplica, Builder A acepta la aplicación.

---

### 4. Hacker Houses (solo gratuitas)
- Crear Hacker House (formulario multi-paso)
- Listar Hacker Houses con filtros básicos
- Ver detalle de una Hacker House
- Aplicar a una Hacker House
- El creador puede aceptar o rechazar aplicaciones
- Solo modalidad **gratuita** — sin pagos ni staking

**Criterio de aceptación**: Builder A crea una Hacker House gratuita, Builder B aplica, Builder A acepta.

---

### 5. Builder Feed
- Feed en `/dashboard` con 3 carruseles horizontales: Hack Spaces, Hacker Houses y Suggested Builders
- Hack Spaces y Hacker Houses muestran items `open/full/in_progress` (o `active` para houses)
- Suggested Builders usa algoritmo de matching ponderado (skills, arquetipo, POAPs, tags, ubicacion, idiomas)

**Criterio de aceptación**: un builder ve los 3 feeds en su dashboard con scroll horizontal, y los Suggested Builders reflejan afinidad con su perfil.

---

### 6. Perfiles de builders (`/builders/[username]`)
- Ver perfil público de un builder
- Ver sus skills, arquetipo, Cypher Kitten, POAPs, links

**Criterio de aceptación**: el perfil es visible para cualquier builder autenticado (ruta protegida bajo `/dashboard/builders/[username]`).

---

## Features OUT of scope — MVP

Estas features están diseñadas pero **no se implementan en MVP**. Cualquier trabajo en estas áreas se considera scope creep.

| Feature | Motivo |
|---|---|
| ~~Notificaciones~~ | ✅ Implementado — centro de notificaciones completo |
| ~~Mapa interactivo~~ | ✅ Implementado — Leaflet + CARTO dark tiles, geocodificación automática |
| Pagos on-chain (Hacker Houses de pago/staking) | Requiere smart contract auditado |
| Filtros on-chain (POAPs, NFTs, Talent Protocol score) | Los campos existen pero sin validación |
| ~~Sistema de amistad (conectar builders)~~ | ✅ Implementado — flujo completo con ConnectButton |
| Organizaciones verificadas | Fase 2 |
| Chat interno | V2 |
| Cypher Kittens NFT minteable | V2 |
| ZK Matching / ZK Identity | V3 |

---

## Estado de implementación (abril 2026)

| Feature | Estado |
|---|---|
| Landing (acceso directo, sin waitlist) | ✅ Implementado |
| Onboarding + Cypher Identity | ✅ Implementado |
| Hack Spaces (crear, listar, aplicar, gestionar) | ✅ Implementado |
| Perfiles de builders (propio + público) | ✅ Implementado |
| Hacker Houses (crear, listar, aplicar, gestionar) | ✅ Implementado |
| Builder Feed (3 carruseles horizontales) | ✅ Implementado — Hack Spaces, Hacker Houses y Suggested Builders en scroll horizontal |
| Builder Discovery (listado, filtros, sugerencias) | ✅ Implementado |
| Sistema de amistad (conectar builders) | ✅ Implementado |
| Notificaciones | ✅ Implementado |
| Talent Protocol Tags y Credentials | ✅ Implementado |
| Mapa interactivo | ✅ Implementado |

---

## Criterios de lanzamiento (Definition of Done)

El MVP está listo para beta pública cuando:

- [x] Auth con Privy operativo (API keys configuradas)
- [x] Onboarding completo sin errores (4 pasos + scanning)
- [x] Hack Spaces: crear, listar, aplicar, aceptar/rechazar — sin errores críticos
- [x] Perfil de builder (propio + público) — sin errores críticos
- [x] Hacker Houses: crear, listar, aplicar, aceptar/rechazar
- [ ] El flujo core completo funciona (onboarding → hack spaces → hacker houses)
- [ ] Funciona en mobile y desktop
- [ ] Deploy en Vercel estable
- [ ] Al menos 2 rondas de dogfooding interno sin bugs bloqueantes

---

## Decisiones de scope

Ver [`open-questions.md`](./open-questions.md) para el log completo de decisiones tomadas.
Ver [`docs/features/`](./features/) para las specs detalladas de cada feature.
