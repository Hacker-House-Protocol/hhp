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
