# Feature: Notificaciones — Hacker House Protocol

Centro de notificaciones en `/notificaciones`. Las notificaciones se emiten en tiempo real via Supabase Realtime.

---

## Copy por trigger

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

---

## Data model

Ver `data-models.md` — type `Notification` y `NotificationType`.
