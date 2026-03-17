# Componentes Reutilizables — Hacker House Protocol

## Card de Hack Space

| Elemento | Contenido |
|---|---|
| Header | Nombre + emoji de categoría + badge de estado (color según estado) |
| Descripción | 2–3 líneas truncadas con '...' |
| Skills buscadas | Pills de colores. Máximo 4 visibles + contador '+N más'. |
| Equipo actual | Avatares con borde de color de arquetipo. Contador '3/5 miembros'. |
| Metadata | Idioma · Región · Etapa del proyecto · Hace cuánto se creó |
| Evento vinculado | Badge: 'Para ETH Global Cannes 2026'. Solo si aplica. |
| CTA | 'Aplicar' (pill primario) / 'Ya aplicaste' (disabled) / 'Ver equipo' (si equipo completo) |

### Estados del Hack Space
| Estado | Color del badge |
|---|---|
| Buscando miembros | `primary` (#6B00C9) |
| Equipo completo | `Builder` (#6EE76E) |
| En progreso | `Strategist` (#8B78E6) |
| Finalizado | `muted` (#7B7A8E) |

---

## Card de Hacker House

| Elemento | Contenido |
|---|---|
| Header | Nombre + ciudad + país. Badge de modalidad: Gratuita / De pago / Con staking. |
| Fechas | '15–22 Marzo 2026' con ícono calendario. Countdown si quedan < 7 días. |
| Progreso | Barra: 'X/Y ETH recaudados' + 'X/Y cupos llenos'. Solo en modalidades de pago. |
| Qué incluye | Íconos: 🛏 Cuarto · 🍳 Comidas · 💻 Workspace · 🌐 Internet. Solo los que aplican. |
| Participantes | Avatares de builders confirmados con colores de arquetipo. |
| Evento vinculado | Badge con ícono: 'Antes / Durante / Después de ETH Global Cannes'. |
| CTA | 'Aplicar' / 'Pagar mi parte' / 'Lista de espera' según estado del builder. |

---

## Card de Builder

| Elemento | Contenido |
|---|---|
| Avatar | GIF Cypher Kitten con borde del color del arquetipo. |
| Username + Arquetipo | Username bold + badge del arquetipo con color. |
| Wallet | Truncada en JetBrains Mono (0xd7ed...6C0e). Solo si tiene wallet conectada. |
| Verified badge | Checkmark si tiene Talent Protocol y/o POAP conectados. |
| Skills | Hasta 3 skills en pills. Colores por categoría. |
| POAPs recientes | Últimos 3 badges de POAP importados. Contador total si hay más. |
| Onchain since | 'Onchain since Aug 2022' en JetBrains Mono. Solo con wallet. |
| CTA | 'Conectar' / 'Pendiente' / 'Amigos' según estado de la relación. |

---

## Cypher Identity (Perfil)

| Elemento | Descripción |
|---|---|
| Avatar / Cypher Kitten | GIF animado con borde de color del arquetipo seleccionado. |
| Username / Alias | Nombre público. Oculta wallet real en interfaces públicas. |
| Arquetipo | Visionary / Strategist / Builder con color correspondiente. |
| Wallet address | Truncada (0xd7ed...6C0e) en JetBrains Mono. |
| Onchain since | Derivado de la wallet. Antigüedad en el ecosistema. |
| Achievement Gallery | Colección horizontal de POAPs + badges importados con contador total. |
| Linked accounts | Twitter/X, GitHub, Farcaster, Worldcoin. |
| Verified badge | Cuando conecta Talent Protocol y/o POAP. |

---

## Arquetipos — Visual Reference

| Arquetipo | Color | Símbolo | Descripción breve |
|---|---|---|---|
| 💡 The Visionary | `#990070` | — | El que tiene la idea. Founder con visión. |
| ♟ The Strategist | `#8B78E6` | — | El que conecta los recursos. Operador. |
| ⚙️ The Builder | `#6EE76E` | — | El que hace la tecnología. El más buscado. |

Los colores de arquetipo aparecen en: bordes de avatares, badges de perfil, highlights del feed y filtros visuales.

---

## Skills — Pills de Colores

Categorías de skills para el picker del perfil y filtros:
- Frontend
- Backend
- Smart Contracts
- Design
- PM
- Research

---

## Notificaciones — Mensajes

| Trigger | Texto |
|---|---|
| Alguien aplica a tu Hack Space | '[Username] quiere unirse a [Nombre del Hack Space]' |
| Te aceptaron en un Hack Space | '¡Estás dentro! [Nombre del Hack Space] te aceptó' |
| Alguien aplica a tu Hacker House | '[Username] quiere ir a [Nombre de la House]' |
| Te aceptaron en Hacker House | '¡Confirmado! Eres parte de [Nombre de la House]' |
| Solicitud de amistad recibida | '[Username] quiere conectar contigo' |
| Solicitud de amistad aceptada | '[Username] aceptó tu solicitud' |
| Pago confirmado | 'Tu pago de 0.05 ETH fue recibido. Quedan X/Y pagos para completar la house.' |
| Reembolso automático | 'La house no se completó. Tu ETH fue reembolsado automáticamente.' |
| Hack Space team completo | 'Tu equipo está completo. ¿Querés crear una Hacker House con ellos?' + shortcut |
