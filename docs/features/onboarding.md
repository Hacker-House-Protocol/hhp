# Feature: Onboarding — Hacker House Protocol

Ruta: `/onboarding`
Punto de entrada post-auth. El builder completa su Cypher Identity antes de llegar al `/home`.

---

## Flujo completo

```
Auth (Privy)
  └── Importación on-chain (automática)
        └── Cypher Identity (formulario)
              └── /home
```

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

## Paso 2 — Importación on-chain (automática, sin formulario)

Inmediatamente después del auth, la plataforma importa en silencio:

| Dato | Fuente | Comportamiento si falla |
|---|---|---|
| POAPs | POAP API | Continúa sin POAPs — se pueden importar después desde `/perfil` |
| Talent Protocol score | Talent Protocol API | Continúa sin score — campo queda vacío |
| Fecha del primer tx on-chain | RPC Alchemy | Calcula `onchain_since` — opcional |

El builder ve una pantalla de carga breve ("Importing your on-chain history..."). Si todo falla, continúa al paso 3 sin bloquear.

---

## Paso 3 — Cypher Identity

Formulario en 2 sub-pasos.

### Sub-paso A — Identidad visual (obligatorio)

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Username / Alias | Text input | ✅ | Único. Oculta la wallet en interfaces públicas. |
| Arquetipo primario | Selector de 3 opciones | ✅ | Visionary / Strategist / Builder. Con descripción de cada uno. |
| Cypher Kitten | Grid de GIFs seleccionables | ✅ | MVP: colección pre-armada. El seleccionado se usa como avatar. |

### Sub-paso B — Contexto del builder (opcional pero recomendado)

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Bio | Textarea (max 280 chars) | ❌ | Descripción corta del builder. |
| Skills | Multi-select pills | ❌ | `Frontend · Backend · Smart Contracts · Design · PM · Research` |
| Idiomas | Multi-select | ❌ | Idiomas en los que puede trabajar. |
| Zona horaria / Región | Select | ❌ | Para matching por zona. |
| GitHub | URL input | ❌ | |
| Twitter/X | URL input | ❌ | |
| Farcaster | URL input | ❌ | |
| Website | URL input | ❌ | |

> El sub-paso B puede saltarse con "Skip for now" — el builder puede completarlo desde `/perfil` en cualquier momento.

---

## Edge cases importantes

| Situación | Comportamiento |
|---|---|
| Username ya tomado | Error inline — sugerir variante (ej: `vitalik_` → "Try `vitalik_2`") |
| Builder abandona a mitad del onboarding | Al volver, retoma desde donde lo dejó — no pierde el auth |
| Builder intenta ir a `/home` sin completar el paso A | Redirige a `/onboarding` |
| Builder conecta una wallet que ya tiene un perfil | Loguea directamente, no repite onboarding |

---

## Datos que se crean al completar el onboarding

Se inserta una fila en la tabla `profiles` de Supabase con:
- `id` — generado por Privy
- `username` — elegido en paso 3A
- `archetype` — elegido en paso 3A
- `avatar_url` — Cypher Kitten seleccionado
- `wallet_address` — de Privy (embedded o externa)
- `skills`, `languages`, `timezone`, `region`, `bio`, links — del paso 3B si completó
- `poaps` — importados en paso 2 si hubo
- `talent_protocol_score` — importado en paso 2 si hubo
- `onchain_since` — calculado en paso 2 si hubo
- `is_verified: false` — se activa cuando conecta Talent Protocol + POAP (Fase 2)

---

## Relación con el resto del sistema

- Auth state lo maneja **Privy** via `usePrivy` hook — ver `CLAUDE.md`
- Crear el perfil en Supabase va por **API route** (`POST /api/profiles`) — nunca directo desde el cliente
- Una vez creado el perfil, `QueryProvider` lo cachea via TanStack Query con key `queryKeys.profile`
