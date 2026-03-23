# Feature: Onboarding — Hacker House Protocol

Ruta: `/onboarding`
Punto de entrada post-auth. El builder completa su Cypher Identity antes de llegar al `/home`.

---

## Flujo completo

```
Auth (Privy)
  └── Pantalla transitoria — "Scanning your on-chain history..." (2-3s)
        └── Step 1 — Archetype
              └── Step 2 — Identity (handle + Cypher Kitten)
                    └── Step 3 — Skills
                          └── Step 4 — Context (skippable)
                                └── /dashboard
```

El progreso se persiste en `profile.onboarding_step` (`archetype | identity | skills | context | complete`). Si el builder abandona y vuelve, retoma desde donde lo dejó.

---

## Paso 1 — Auth con Privy

El builder elige cómo entrar. Privy maneja toda la autenticación.

| Opción | Detalle |
|---|---|
| Login social | Gmail, Apple, magic link por email |
| Wallet existente | MetaMask, WalletConnect, Coinbase Wallet |
| Sin wallet | Privy genera una embedded wallet automáticamente — el builder no necesita saber que existe |

**Edge cases:**
- Builder sin wallet → embedded wallet creada en segundo plano, sin fricción visible
- Builder con wallet → wallet conectada y asociada al perfil
- Builder que ya completó el onboarding → redirige directamente a `/home`

---

## Paso 2 — Importación on-chain

Inmediatamente después del auth, la plataforma importa el historial on-chain del builder.

| Dato | Fuente | Comportamiento si falla |
|---|---|---|
| POAPs | POAP API | Continúa sin POAPs — se pueden importar después desde el perfil |
| Talent Protocol score | Talent Protocol API | Continúa sin score — campo queda vacío |

**UX:** Se muestra una pantalla transitoria breve *"Scanning your on-chain history..."* mientras la importación corre en background. Avanza automáticamente sin esperar el resultado — nunca bloquea el flujo. El objetivo es hacer visible que el historial on-chain del builder es parte de su identidad en el protocolo.

> **Estado actual:** La importación ocurre en background via `useImportTalentScore` y `useImportPoaps` en `OnboardingWizard`, pero **la pantalla transitoria no está implementada** — está pendiente.

**Condición importante:** Ambas APIs (Talent Protocol y POAP) buscan historial usando la `wallet_address` del usuario. Esto solo es útil si el builder entró con una **wallet externa existente** (MetaMask, etc.) que ya tiene actividad on-chain. Si entró con email, Privy le crea una embedded wallet nueva — sin historial — y ambas APIs devolverán vacío. La pantalla transitoria solo debería mostrarse si `wallet_address` corresponde a una wallet externa, no a una embedded.

**Arquitectura de las llamadas:** Las API keys (`TALENT_PROTOCOL_APIKEY`, `POAP_APIKEY`) viven en `env.server.ts` y nunca se exponen al cliente. El flujo es:
```
Browser → POST /api/integrations/talent-protocol → Next.js server (con API key) → api.talentprotocol.com
Browser → POST /api/integrations/poap           → Next.js server (con API key) → api.poap.tech
```

**Fase 2 (futura):** Un paso dedicado donde el builder puede ver lo que se importó ("We found 12 POAPs and your Builder Score is 847") y conectar manualmente si no se detectó nada. Esto activa `is_verified: true` en el perfil.

---

## Step 1 — Archetype (`onboarding_step: "archetype"`)

| Campo | Tipo | Requerido |
|---|---|---|
| Arquetipo primario | Cards seleccionables (3 opciones) | ✅ |

Opciones: **Visionary / Strategist / Builder**. Cada card muestra nombre, tagline y descripción. Al seleccionar, avanza automáticamente sin botón confirm.

---

## Step 2 — Identity (`onboarding_step: "identity"`)

Dos decisiones permanentes en un mismo paso: el nombre y la cara del builder en el protocolo.

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Handle | Text input con prefijo `@` | ✅ | 3-20 chars, `/^[a-z0-9_]+$/`, único. Permanente. |
| Cypher Kitten | Grid de GIFs seleccionables | ✅ | Colección pre-armada en `CYPHER_KITTENS` (`lib/onboarding.ts`). Se guarda como `avatar_url`. |

El botón Continue está deshabilitado hasta que ambos campos estén completos. El error de handle duplicado se muestra como error de servidor inline (`identityError` en `OnboardingWizard`).

---

## Step 3 — Skills (`onboarding_step: "skills"`)

| Campo | Tipo | Requerido |
|---|---|---|
| Skills | Pills multi-select | ✅ (al menos 1) |

Las skills se filtran por arquetipo elegido (`SKILLS_BY_ARCHETYPE` en `lib/onboarding.ts`), con opción de ver todas. Botón Back vuelve al paso Identity.

---

## Step 4 — Context (`onboarding_step: "context"`)

Paso completamente opcional. El builder puede saltarlo con "Skip for now →" y completarlo después desde su perfil.

| Campo | Tipo | Notas |
|---|---|---|
| Bio | Textarea | Máx 160 chars |
| Idiomas | Multi-select pills | Lista en `lib/constants/languages.ts` |
| Región | Combobox | Cascading: Región → País → Ciudad |
| País | Combobox | Aparece al seleccionar región |
| Ciudad | Combobox | Aparece al seleccionar país. Al elegir ciudad, `timezone` se asigna automáticamente desde `lib/constants/location.ts` |
| GitHub | Input con prefijo `github.com/` | Solo username — regex `/^[a-zA-Z0-9_-]*$/` |
| Twitter / X | Input con prefijo `x.com/` | Solo username — regex `/^[a-zA-Z0-9_]*$/` |
| Farcaster | Input con prefijo `warpcast.com/` | Solo username — regex `/^[a-zA-Z0-9_.]*$/` |

**Acciones al pie:**
- `← Back` — vuelve a Skills
- `Skip for now →` (ghost) — guarda `onboarding_step: "complete"` sin datos de contexto, redirige a `/home`
- `Enter the Protocol →` (primary) — guarda todos los campos completados, redirige a `/home`

Schema: `contextSchema` en `lib/schemas/onboarding.ts`.

---

## Datos que se crean al completar el onboarding

Se actualiza la fila en `profiles` de Supabase con:

| Campo | Origen |
|---|---|
| `archetype` | Step 1 |
| `handle` | Step 2 |
| `avatar_url` | Step 2 |
| `skills` | Step 3 |
| `bio`, `languages`, `region`, `country`, `city`, `timezone` | Step 4 (si no hizo skip) |
| `github_url`, `twitter_url`, `farcaster_url` | Step 4 (si no hizo skip) |
| `poaps` | Importación automática background |
| `talent_protocol_score` | Importación automática background |
| `is_verified` | `false` hasta Fase 2 |

---

## Pendientes / deuda técnica

| Item | Prioridad |
|---|---|
| Pantalla transitoria "Scanning your on-chain history..." entre auth y Step 1 | Media |
| Sugerencia de variante en error de handle duplicado (ej: "Try `vitalik_2`") | Baja |
| Fase 2: paso de verificación on-chain con resumen de POAPs + Builder Score | Fase 2 |

---

## Relación con el resto del sistema

- Auth state: **Privy** via `usePrivy` — ver `CLAUDE.md`
- Mutaciones: `usePatchProfile` (`PATCH /api/profiles/me`) — nunca Supabase directo desde cliente
- Cache: TanStack Query con key `queryKeys.profile`
- Schemas en `lib/schemas/onboarding.ts` — usar `handleSchema` (step 2) y `contextSchema` (step 4). Los schemas `profileSchema` e `identitySchema` son legacy.
- Al completar cualquier paso: `onboarding_step` avanza en DB. Al completar step 4 o hacer skip: `router.push("/dashboard")`
