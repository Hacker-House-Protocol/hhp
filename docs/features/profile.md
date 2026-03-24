# Feature: Profile — Hacker House Protocol

Rutas: `/dashboard/perfil` (propio) · `/dashboard/builders/[username]` (público)

---

## Concepto

El perfil tiene dos capas:

- **Identidad** — Quién eres en el protocolo: tu Cypher Kitten, handle, arquetipo, bio, skills.
- **Trayectoria** — Qué has hecho: POAPs como logros, Talent Score para matching, Hack Spaces y Hacker Houses activas.

---

## `/dashboard/perfil` — Perfil propio

### Modos

| Modo | Descripción |
|---|---|
| **View** | Default. Muestra todos los datos. Botón de lápiz (`✏`) en la esquina superior derecha. |
| **Edit** | Al presionar el lápiz. Los campos editables se convierten en inputs. Aparece botón "Save changes" (primary) y "Cancel" (ghost). Al guardar: `PATCH /api/profile` vía `usePatchProfile`. |

### Secciones

---

#### 1. Cypher Identity (hero)

El bloque de identidad principal. Siempre visible en la parte superior.

| Elemento | Editable | Notas |
|---|---|---|
| Cypher Kitten | ✅ | En modo edit, el GIF se vuelve clickeable y abre el selector de kittens (mismo grid que Step 2 del onboarding). |
| Handle (`@handle`) | ❌ | Permanente — solo display con label "permanent" en modo edit. |
| Archetype badge | ✅ | En modo edit, selector de 3 opciones (cards compactas). Usar variante de color del arquetipo: `variant="visionary"`, etc. |
| Bio | ✅ | Textarea, máx 160 chars. Mostrar contador en modo edit. |
| Wallet address | ❌ | Truncada: `0xd7ed...6C0e`. Solo si existe `wallet_address`. |
| Verified badge | ❌ | Badge `✓ Verified` (variant primary) si `is_verified: true`. Tooltip: "On-chain credentials verified". |

**UI del avatar:**
El kitten siempre con borde circular del color del arquetipo:
```
border-2 rounded-full border-[var(--{archetype})]
box-shadow: 0 0 16px color-mix(in oklch, var(--{archetype}) 30%, transparent)
```
Tamaño: `w-24 h-24` en mobile, `w-28 h-28` en desktop.

---

#### 2. Skills

Pills multi-select idénticas al Step 3 del onboarding.

| Modo | Comportamiento |
|---|---|
| View | Pills con `variant="{archetype}"` para skills del arquetipo, `variant="secondary"` para otras. |
| Edit | Pills clickeables para añadir/quitar. Mismo componente que `StepSkills`. |

---

#### 3. Location & Languages

| Campo | Editable | Componente |
|---|---|---|
| Región | ✅ | `Combobox` — igual que `StepContext` |
| País | ✅ | `Combobox` — cascading desde región |
| Ciudad | ✅ | `Combobox` — auto-asigna `timezone` |
| Idiomas | ✅ | Pills multi-select — igual que `StepContext` |

En modo view: mostrar como texto simple (`Buenos Aires · South America · GMT-3`).

---

#### 4. Social Links

| Campo | Prefijo | Editable |
|---|---|---|
| GitHub | `github.com/` | ✅ |
| Twitter / X | `x.com/` | ✅ |
| Farcaster | `warpcast.com/` | ✅ |

En modo view: mostrar como links clickeables con ícono. En modo edit: mismos inputs con prefijo que `StepContext`.

---

#### 5. On-chain

Sección siempre en modo read-only. El usuario puede re-importar manualmente.

**Talent Protocol Score**

Card compacta mostrando el score numérico de Talent Protocol.

```
┌─────────────────────────────────┐
│  Builder Score        847       │
│  via Talent Protocol  ──────── │
│  Used for team matching         │
└─────────────────────────────────┘
```

- Si `talent_protocol_score` es null y hay wallet: mostrar placeholder "No score yet" con botón re-import.
- Si no hay wallet: mostrar "Connect a wallet to import your Builder Score".

**POAP Gallery — Achievement Wall**

Grid de cards, una por POAP. Cada card:

```
┌──────────┐
│  [image] │  ← imagen circular del POAP (64x64)
│          │
│ ETH Baires│  ← event name, font-mono text-xs
│ Jan 2024 │  ← event_date, text-muted-foreground
└──────────┘
```

- Grid: `grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3`
- Si `poaps` está vacío y hay wallet: "No POAPs found" con botón re-import.
- Si no hay wallet: "Connect a wallet to see your POAP collection".

**Botón re-import**

```
"Update on-chain data"  [variant="outline", size="sm"]
```

- Solo visible si `profile.wallet_address` existe.
- Al presionar: dispara `useImportTalentScore` y `useImportPoaps` en paralelo.
- Estado loading: spinner + "Importing...".
- Al completar: invalidar `queryKeys.profile`.
- Errores: silent fail — no bloquea al usuario.

---

#### 6. Activity

Sección siempre read-only. Muestra la participación activa del builder en el protocolo.

**Hack Spaces activos**

Cards compactas de los Hack Spaces donde el builder es **creador o miembro** con status `open | full | in_progress`. Usar el mismo componente `HackSpaceCard` existente.

Si no tiene ninguno: "No active Hack Spaces. [Create one →]" con link a `/dashboard/hack-spaces/create`.

**Hacker Houses activas**

Igual que Hack Spaces pero para Hacker Houses. Implementar cuando la feature exista.

---

## `/dashboard/builders/[username]` — Perfil público

Mismo layout y secciones que el perfil propio, con estas diferencias:

| Elemento | Diferencia |
|---|---|
| Botón de lápiz | No existe |
| Handle label "permanent" | No se muestra |
| Wallet address | Solo visible si `is_verified: true` |
| Bio vacía | Mostrar "No bio yet" en muted |
| Sección On-chain | Talent Score y POAPs visibles (read-only). Sin botón re-import. |
| CTA | Botón "Connect" — Fase 2 (friendships). Por ahora omitir o mostrar disabled. |
| Sección Activity | Sus Hack Spaces activos — sin "Create one" link |

**Ruta dinámica:** `[username]` corresponde al `handle` del builder en la tabla `users`. Fetch: `GET /api/builders/[username]`.

**404:** Si no existe el handle → redirect a `/dashboard/builders`.

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/profile` | Perfil del usuario autenticado |
| `PATCH` | `/api/profile` | Actualizar perfil |
| `GET` | `/api/builders/[username]` | Perfil público por handle — ✅ implementado |

`GET /api/builders/[username]`:
- No requiere auth (perfil público).
- Devuelve `UserProfile` filtrado: omite `email`, `privy_id`.
- Si no existe el handle → `404 { message: "Builder not found" }`.

---

## Schemas

`lib/schemas/profile.ts` ya tiene `patchProfileSchema` con todos los campos editables.

Para edit mode, usar `patchProfileSchema` como base pero **solo los campos editables desde perfil**:
- `bio`, `archetype`, `avatar_url`, `skills`, `languages`, `region`, `country`, `city`, `timezone`, `github_url`, `twitter_url`, `farcaster_url`
- Excluir: `handle` (permanente), `onboarding_step`, `is_verified`, `talent_protocol_score`, `poaps`

---

## Servicio

`services/api/profile.ts` — ✅ ya implementado:

```ts
// Perfil público por handle
export const useBuilderProfile = (username: string) => {
  return useAppQuery<UserProfile>({
    fetcher: async () => {
      const { user } = await genericAuthRequest<{ user: UserProfile }>(
        "get",
        `/api/builders/${username}`,
      )
      return user
    },
    queryKey: [queryKeys.builderProfile, username],
    enabled: !!username,
  })
}
```

`lib/query-keys.ts` ya incluye `builderProfile: "builder-profile"`.

---

## Estructura de archivos

```
app/(protected)/dashboard/
  perfil/
    page.tsx                          → /dashboard/perfil
    _components/
      profile-view.tsx                → layout completo (recibe profile + isOwner)
      profile-identity.tsx            → sección Cypher Identity
      profile-skills.tsx              → sección Skills
      profile-location.tsx            → sección Location & Languages
      profile-links.tsx               → sección Social Links
      profile-onchain.tsx             → sección On-chain (Talent Score + POAPs)
      profile-activity.tsx            → sección Activity (Hack Spaces / Houses)
      profile-edit-form.tsx           → wrapper del modo edit (react-hook-form)
      kitten-selector.tsx             → grid de kittens seleccionables (reutiliza lógica de StepIdentity)
      poap-card.tsx                   → card individual de POAP
  builders/
    [username]/
      page.tsx                        → /dashboard/builders/[username]

app/api/builders/
  [username]/
    route.ts                          → GET perfil público
```

**Componente raíz `profile-view.tsx`** recibe `profile: UserProfile` y `isOwner: boolean`. Si `isOwner: true` → muestra botón lápiz. Si `isOwner: false` → oculta edición y adapta visibilidad de campos.

---

## Edge cases

| Caso | Comportamiento |
|---|---|
| Bio vacía | En view: "No bio yet" en `text-muted-foreground`. En perfil público: igual. |
| Sin skills | En view: "No skills added yet". En edit: abre el selector. |
| Sin wallet | Sección On-chain muestra CTA para conectar wallet. Sin botón re-import. |
| POAPs = [] con wallet | "No POAPs found on this wallet". Botón re-import. |
| Re-import en curso | Spinner en botón. Campos on-chain no se actualizan hasta que el query se invalide y refetchee. |
| Handle no encontrado en `/builders/[username]` | `notFound()` de Next.js → 404. |
| Perfil incompleto (onboarding no terminado) | No debería pasar — el layout protegido redirige al onboarding. |

---

## Pendientes / deuda técnica

| Item | Prioridad |
|---|---|
| CTA "Connect" en perfil público (friendship system) | Fase 2 |
| Hacker Houses activas en sección Activity | Cuando feature Hacker Houses esté implementada |
| `is_verified` activado automáticamente tras import exitoso | Fase 2 — hoy siempre es `false` |
| Kitten colección expandida | Bloqueado por assets |
