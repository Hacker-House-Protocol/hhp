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

### Waitlist (pre-lanzamiento)
| Métrica | Señal mínima | Señal fuerte |
|---|---|---|
| Emails capturados | 500 | 1.500 |

> **Por qué estos números**: el nicho de builders Web3 activos globalmente es pequeño pero de alta intención. 500 emails en un nicho técnico equivalen a 5.000 en un producto de consumo masivo. 1.500 indicaría product-market fit temprano suficiente para priorizar el desarrollo post-MVP.

### MVP (post-lanzamiento beta)
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
Landing → Waitlist
  └── Onboarding → Cypher Identity
        └── /home (feed)
              ├── Hack Spaces → Crear → Listar → Aplicar → Aceptar/Rechazar
              └── Hacker Houses → Crear → Listar → Aplicar → Aceptar/Rechazar
```

---

## Features IN scope — MVP

### 1. Landing + Waitlist
- Página de marketing en `/`
- Captura de emails en Supabase (tabla `waitlist`)
- Sin auth real todavía

**Criterio de aceptación**: un visitante puede dejar su email y recibe confirmación visual.

---

### 2. Onboarding + Cypher Identity
- Auth via Privy (social + wallet + embedded wallet)
- Importación automática de POAPs y Talent Protocol score
- Selección de arquetipo primario
- Selección de Cypher Kitten
- Campos opcionales: bio, skills, idiomas, zona horaria, links

**Criterio de aceptación**: un builder sin wallet puede registrarse con Gmail, completar su Cypher Identity, y llegar al `/home`.

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
- Feed simple en `/home` ordenado por relevancia de skills
- No requiere algoritmo sofisticado en MVP — matching básico por `skills_needed` vs `profile.skills`
- Muestra Hack Spaces y Hacker Houses relevantes

**Criterio de aceptación**: un builder con skills `['Frontend', 'Smart Contracts']` ve Hack Spaces que buscan esas skills en su feed.

---

### 6. Perfiles de builders (`/builders/[username]`)
- Ver perfil público de un builder
- Ver sus skills, arquetipo, Cypher Kitten, POAPs, links

**Criterio de aceptación**: el perfil es visible públicamente sin necesidad de estar logueado.

---

## Features OUT of scope — MVP

Estas features están diseñadas pero **no se implementan en MVP**. Cualquier trabajo en estas áreas se considera scope creep.

| Feature | Motivo |
|---|---|
| Notificaciones | Nice-to-have — el flujo funciona sin ellas en MVP |
| Mapa interactivo | Complejidad alta, bajo impacto en validación core |
| Pagos on-chain (Hacker Houses de pago/staking) | Requiere smart contract auditado |
| Filtros on-chain (POAPs, NFTs, Talent Protocol score) | Los campos existen pero sin validación |
| Sistema de amistad (conectar builders) | Secundario al flujo core |
| Organizaciones verificadas | Fase 2 |
| Chat interno | V2 |
| Cypher Kittens NFT minteable | V2 |
| ZK Matching / ZK Identity | V3 |

---

## Estado de implementación (marzo 2026)

| Feature | Estado |
|---|---|
| Landing + Waitlist | ✅ Implementado |
| Onboarding + Cypher Identity | ✅ Implementado |
| Hack Spaces (crear, listar, aplicar, gestionar) | ✅ Implementado |
| Perfiles de builders (propio + público) | ✅ Implementado |
| Hacker Houses | ❌ Pendiente |
| Builder Feed (algoritmo + carruseles) | 🟡 Parcial — feed básico con Hack Spaces |
| Mapa interactivo | ❌ Pendiente |
| Notificaciones | ❌ Pendiente |

---

## Criterios de lanzamiento (Definition of Done)

El MVP está listo para beta pública cuando:

- [x] Auth con Privy operativo (API keys configuradas)
- [x] Onboarding completo sin errores (4 pasos + scanning)
- [x] Hack Spaces: crear, listar, aplicar, aceptar/rechazar — sin errores críticos
- [x] Perfil de builder (propio + público) — sin errores críticos
- [ ] Hacker Houses: crear, listar, aplicar, aceptar/rechazar
- [ ] El flujo core completo funciona (onboarding → hack spaces → hacker houses)
- [ ] Funciona en mobile y desktop
- [ ] Waitlist conectada a Supabase
- [ ] Deploy en Vercel estable
- [ ] Al menos 2 rondas de dogfooding interno sin bugs bloqueantes

---

## Decisiones de scope

Ver [`open-questions.md`](./open-questions.md) para el log completo de decisiones tomadas.
Ver [`docs/features/`](./features/) para las specs detalladas de cada feature.
