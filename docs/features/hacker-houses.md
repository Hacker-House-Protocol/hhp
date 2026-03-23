# Feature: Hacker Houses — Hacker House Protocol

Una Hacker House es un espacio de co-living físico donde builders se juntan para networking, compartir gastos y construir relaciones. No tiene un proyecto obligatorio — el valor está en la comunidad y el contexto del evento o ciudad.

---

## ¿Quién puede crear una?

- Builder individual
- Hack Space — via shortcut cuando el equipo está completo
- Organización verificada — financia y gestiona con sus propias reglas (Fase 2)

---

## Formulario de Creación (`/hacker-houses/crear`)

### Sobre la Casa
- Nombre de la Hacker House
- Ciudad y país
- Zona / Barrio aproximado (no dirección exacta — privacidad)
- Fechas (inicio y fin)
- Capacidad máxima de personas
- Costo por persona (solo si es de pago — Fase 2)
- Qué incluye: cuarto privado/compartido · comidas · internet · workspace

### Sobre la Comunidad
- Perfil buscado: Builders, Founders, Designers, Researchers...
- Idioma de comunicación
- Reglas básicas de la casa

### Evento Relacionado (Opcional)
- Toggle: ¿Está ligada a uno o varios eventos?
- Nombre, link y fecha del evento
- La Hacker House es: `antes / durante / después del evento`

> Si está vinculada a un evento, aparece destacada en el mapa. Los builders que siguen ese evento la ven en su feed con prioridad.

### Filtros de Acceso
- Aplicación: `abierta / por invitación / curada`
- Deadline para aplicar
- ~~Filtros on-chain: POAPs, NFTs, Talent Protocol score~~ → **Pospuesto a Fase 2**
- ~~Staking requerido~~ → **Pospuesto a Fase 2**

---

## Modalidades

| Modalidad | Fase | Descripción |
|---|---|---|
| **Gratuita** | Fase 1 ✅ | Sin pago ni staking. Filtros opcionales de acceso. |
| **De pago** | Fase 2 🔒 | Pago grupal via smart contract auditado. Split automático. Reembolso si no se llena en 7 días. |
| **Con staking** | Fase 2 🔒 | Stake perdible si el builder no asiste. Gestionado por el creador via dashboard. |

> La plataforma no custodia fondos. Todo opera via smart contract (Fase 2).

---

## Hacker Houses de Organizaciones (Fase 2)

Fuera del alcance de Fase 1. Las organizaciones cubren todos los costos y definen sus propias reglas de acceso y staking.

---

## Dashboard de Asistencia (`/dashboard`) — Fase 2

El creador marca cada builder como `asistió / no asistió`. El smart contract procesa automáticamente la liberación o pérdida del stake.

---

## Key NFT — Acceso Transferible (Fase 2)

Cada Hacker House de pago genera N keys (una por cupo). NFT con metadata: evento, fechas, número de cupo. Transferible entre builders sin intervención del creador.

---

## HHP POAPs — Proof of Presence (Fase 2)

Cada Hacker House genera su propio POAP para los asistentes confirmados. Queda en el Achievement Gallery del builder como badge on-chain.

---

## UI: Card de Hacker House

| Elemento | Contenido |
|---|---|
| Header | Nombre + ciudad + país. Badge de modalidad: Gratuita / De pago / Con staking. |
| Fechas | '15–22 Marzo 2026' con ícono calendario. Countdown si quedan < 7 días. |
| Progreso | Barra: 'X/Y ETH recaudados' + 'X/Y cupos llenos'. Solo en modalidades de pago. |
| Qué incluye | Íconos: 🛏 Cuarto · 🍳 Comidas · 💻 Workspace · 🌐 Internet. Solo los que aplican. |
| Participantes | Avatares de builders confirmados con colores de arquetipo. |
| Evento vinculado | Badge con ícono: 'Antes / Durante / Después de ETH Global Cannes'. |
| CTA | 'Aplicar' / 'Pagar mi parte' / 'Lista de espera' según estado del builder. |
