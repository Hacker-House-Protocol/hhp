# Feature: Matching y Feed — Hacker House Protocol

El matching opera en dos ejes: **contenido** (Hack Spaces y Hacker Houses relevantes) y **personas** (sugerencias de builders). El feed es el punto de entrada principal post-login.

---

## Variables del Algoritmo

- Habilidades del builder vs. roles requeridos en Hack Spaces y Hacker Houses
- Arquetipo primario (afinidad entre arquetipos complementarios)
- Región, zona horaria, idioma
- POAPs y comunidades compartidas (bonus de afinidad)
- Participación en los mismos Hack Spaces o Hacker Houses previos
- Talent Protocol score y credenciales verificadas
- Eventos próximos marcados como 'voy a asistir'

---

## Matching Hack Space → Builder

Cuando un Hack Space necesita un rol (ej: Frontend Developer), la plataforma:
1. Identifica builders con esa habilidad
2. Los muestra como sugerencia al creador del Hack Space
3. Esos builders ven ese Hack Space destacado en su feed como oportunidad relevante

---

## Matching Builder → Builder

Sugerencias en el sidebar del feed, similar al panel de X (Twitter). **No es match bidireccional tipo Tinder** — es descubrimiento pasivo. El builder puede enviar solicitud de amistad. Al aceptar, aparecen como primera opción al crear Hacker Houses.

---

## Mapa Interactivo — Comportamiento del Algoritmo

| Trigger | Comportamiento |
|---|---|
| Hack Space vinculado a evento | Aparece destacado en el mapa en la ciudad del evento |
| Hacker House vinculada a evento | Pin en el mapa con badge del evento. Prioridad en feed de builders que siguen ese evento |
| Builder marcó que asistirá a evento | El algoritmo sugiere Hack Spaces y Hacker Houses vinculadas a ese evento. Su presencia aparece en el mapa. |

---

## Sistema de Amistad

- Solicitud de amistad → notificación → aceptar/rechazar
- Amigos aparecen como primera opción al crear Hacker Houses
- Amigos que van a un evento se muestran en el mapa: 'X builders de tu red van a este evento'

---

## UI: Card de Builder

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

## UI: Cypher Identity (Perfil)

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
