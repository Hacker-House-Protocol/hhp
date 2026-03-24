# Feature: Hack Spaces — Hacker House Protocol

> **Feature principal de la plataforma.** Es el gancho de uso recurrente — los builders usan Hack Spaces de forma continua y cuando su equipo está completo, el flujo los lleva naturalmente a crear una Hacker House.

Un Hack Space es un proyecto online donde un builder convoca a otros con habilidades específicas para construir algo juntos. No es un job board — es una convocatoria activa donde el creador tiene skin in the game.

> **Estado actual (marzo 2026):** ✅ Implementado. Crear, listar, ver detalle, aplicar y gestionar aplicaciones están completos. Ver rutas en `docs/navigation.md`.

---

## Formulario de Creación (`/dashboard/hack-spaces/create`)

### Sobre el Proyecto
- Nombre del Hack Space
- Descripción del proyecto
- Categoría / Track: `DeFi · DAO tools · AI · Social · Gaming · NFTs · Infrastructure · Other`
- Etapa: `Idea / Prototipo / En desarrollo`
- Repositorio o links relevantes (opcional)

### Evento Relacionado (Opcional)
- Toggle: ¿Está ligado a un evento?
- Nombre del evento
- Link del evento (Luma u otro)
- Fecha del evento
- El Hack Space es para: `antes / durante / después del evento`

> Si está vinculado a un evento, aparece destacado en el mapa en la ciudad del evento. Cuando el equipo se forma, el shortcut para crear una Hacker House ya viene preconfigurado con fechas y ciudad.

### Sobre el Equipo
- Arquetipos buscados (`looking_for`): Visionary / Strategist / Builder — al menos 1 requerido
- Habilidades deseadas (`skills_needed`): skills específicas — opcional
- Tamaño máximo del equipo (`max_team_size`): 2–20
- Nivel de experiencia: `beginner / intermediate / advanced`
- Idioma de trabajo
- Zona horaria o región preferida (opcional)

### Filtros de Acceso
- Aplicación: `abierta / por invitación / curada`
- Deadline para aplicar (opcional)
- ~~Filtros on-chain: POAPs, NFTs, Talent Protocol score~~ → **Pospuesto a Fase 2**

---

## Estados del Hack Space

| Estado | Descripción |
|---|---|
| **Buscando miembros** | Visible públicamente, acepta aplicaciones. El creador puede invitar builders directamente desde sugerencias del algoritmo. |
| **Equipo completo** | Llegó al tamaño deseado. La plataforma sugiere al creador convertir el equipo en una Hacker House (shortcut). |
| **En progreso** | El equipo está activamente construyendo. No acepta nuevas aplicaciones. |
| **Finalizado** | Proyecto terminado o cerrado. Queda como referencia en el perfil de los participantes. |

---

## Aplicación a un Hack Space

- Los builders aplican con su perfil.
- El creador recibe notificación y puede aceptar o rechazar.
- En Fase 1: cualquier builder puede ver el botón de aplicar (sin validación on-chain).

---

## Shortcut: Hack Space → Hacker House

Cuando el Hack Space alcanza su meta de habilidades, la plataforma sugiere al creador convertir el equipo en una Hacker House directamente. Si el Hack Space estaba vinculado a un evento, la Hacker House se crea pre-configurada con fechas y ciudad.

---

## UI: Card de Hack Space

| Elemento | Contenido |
|---|---|
| Header | Nombre + emoji de categoría + badge de estado (color según estado) |
| Descripción | 2–3 líneas truncadas con '...' |
| Skills buscadas | Pills de colores. Máximo 4 visibles + contador '+N más'. |
| Equipo actual | Avatares con borde de color de arquetipo. Contador '3/5 miembros'. |
| Metadata | Idioma · Región · Etapa del proyecto · Hace cuánto se creó |
| Evento vinculado | Badge: 'Para ETH Global Cannes 2026'. Solo si aplica. |
| CTA | 'Aplicar' (pill primario) / 'Ya aplicaste' (disabled) / 'Ver equipo' (si equipo completo) |

### Colores de badge por estado

| Estado | Token de color |
|---|---|
| Buscando miembros | `--primary` |
| Equipo completo | `--builder-archetype` |
| En progreso | `--strategist` |
| Finalizado | `--muted-foreground` |
