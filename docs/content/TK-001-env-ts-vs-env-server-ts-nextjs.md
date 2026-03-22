---
id: TK-001
topic: "env.ts vs env.server.ts en Next.js — por qué las variables de servidor no llegan al cliente"
status: draft
duration: 60s
tone: educacional
created: 2026-03-22
---

## HOOK
"Pasé 2 horas debuggeando por qué mi API key no llegaba
al servidor... y el problema era una sola línea."
[text overlay: "el error más silencioso de Next.js"]

## DEVELOPMENT
En Next.js, las variables de entorno sin NEXT_PUBLIC_
NUNCA llegan al cliente. Son invisibles en el browser.

[show code - env.ts]
Aquí defines tus vars públicas — safe to use anywhere.
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_PRIVY_APP_ID...
estas sí viajan al cliente.

[cut to env.server.ts]
Aquí van las secretas — PRIVY_APP_SECRET, DATABASE_URL...
Si importas este archivo desde un componente cliente,
Next.js te explota en build time.

[show import "server-only" at top of file]
Esta línea es tu guardia de seguridad.
Si alguien intenta importarlo en el cliente — error inmediato.
No en runtime. En BUILD TIME.

[cut to terminal — build error]
Ves este error? Gracias a eso, tu secret nunca
llegó al browser.

## CTA
¿Cuántas veces expusiste un secret sin darte cuenta?
Comenta abajo 👇 y guarda este video pa no volver a hacerlo.
[text overlay: "server-only — una línea que cambia todo"]
