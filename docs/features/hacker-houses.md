# Feature: Hacker Houses — Hacker House Protocol

Una Hacker House es un espacio de co-living físico donde builders se juntan para networking, compartir gastos y construir relaciones. No tiene un proyecto obligatorio — el valor está en la comunidad y el contexto del evento o ciudad.

---

## ¿Quién puede crear una?

- Builder individual
- Hack Space — via shortcut cuando el equipo está completo
- Organización verificada — financia y gestiona con sus propias reglas

---

## Formulario de Creación (`/hacker-houses/crear`)

### Sobre la Casa
- Nombre de la Hacker House
- Ciudad y país
- Zona / Barrio aproximado (no dirección exacta — privacidad)
- Fechas (inicio y fin)
- Capacidad máxima de personas
- Costo por persona (o si es patrocinada)
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
- Filtros on-chain: POAPs específicos · NFTs · Talent Protocol score mínimo
- Staking requerido (opcional, definido por el creador)

---

## Modalidades

| Modalidad | Descripción |
|---|---|
| **Gratuita** | Sin pago ni staking. Filtros opcionales. Disponible desde Fase 1. |
| **De pago** | Monto total + límite de personas. Cada builder paga su parte via smart contract. El creador claimea fondos solo cuando se alcanza el 100%. Si no se llena 7 días antes, **el smart contract ejecuta reembolso automático**. |
| **Con staking** | Misma lógica que de pago, pero el stake puede perderse si el builder no asiste. El creador gestiona desde su dashboard de asistencia. |

> La plataforma no custodia fondos. Todo opera via smart contract. 100% de responsabilidad recae en los builders.

---

## Hacker Houses de Organizaciones

- Las organizaciones cubren todos los costos.
- Prefiltro automático: si el builder no cumple los requisitos, no ve el botón de aplicar.
- La organización define el monto mínimo de staking y gestiona el dashboard de asistencia.

---

## Dashboard de Asistencia (`/dashboard`)

El creador marca cada builder como: `asistió / no asistió`. El smart contract procesa automáticamente la liberación o pérdida del stake. Solo el creador puede editar el dashboard.

---

## Key NFT — Acceso Transferible *(Fase 2)*

Cada Hacker House de pago genera N keys (una por cupo). Cada key es un NFT con metadata: evento, fechas, número de cupo.

- **Ticket de acceso**: el smart contract valida quién posee la key en el check-in.
- **Proof of attendance**: la key queda en la wallet como registro verificable.
- **Transferible**: si un builder no puede asistir, puede transferir su key sin intervención del creador.

---

## HHP POAPs — Proof of Presence *(Fase 2)*

Cada Hacker House genera su propio POAP para los asistentes confirmados. Queda en el Achievement Gallery del builder como badge on-chain.

Ejemplos: `'Hacker House Buenos Aires — ETH Global 2025'`, `'HHP Cannes 2026'`
