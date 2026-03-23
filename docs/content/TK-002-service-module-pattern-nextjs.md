---
id: TK-002
topic: "Service Module Pattern — organizar data fetching en Next.js con TanStack Query"
status: draft
duration: 60s
tone: educational
created: 2026-03-22
---

## HOOK

Tu carpeta hooks/ tiene 40 archivos.
Nadie sabe dónde está nada.
Hay una solución.

[text overlay: "40 archivos. 1 operación. 3 carpetas distintas."]

---

## DEVELOPMENT

[show file tree]

El problema: una sola operación de datos vive fragmentada en tres lugares.

lib/api/hack-spaces.ts — la llamada HTTP
hooks/queries/use-hack-spaces.ts — el query hook
hooks/mutations/use-create-hack-space.ts — el mutation hook

[cut to terminal, navigate between files slowly]

Si alguien toca hack-spaces, tiene que abrir tres archivos.
Y cuando el proyecto crece, esto se multiplica por cada dominio.

[text overlay: "La regla: un dominio = un archivo"]

[show code — services/api/hack-spaces.ts]

La solución es el Service Module Pattern.
Un archivo por dominio dentro de services/api/.

Ese archivo tiene todo:
la llamada con genericAuthRequest,
el query hook con useAppQuery,
y los mutation hooks con useAppMutation.

[highlight each section of the file as you mention it]

Cuando alguien necesita hack-spaces, abre un solo archivo.
Todo está ahí: fetching, cache, mutaciones, invalidación.

[cut to terminal]

Los query keys van en lib/query-keys.ts como strings planos.
Sin factories, sin funciones, solo strings.
El array va en el call site.

[show code]

queryKey: [queryKeys.hackSpaces]

[cut to terminal]

Y el token de autenticación no lo manejas tú.
Lo inyecta el ApiAuthSetup dentro del QueryProvider una sola vez.
Tu service file no sabe nada de auth, solo hace la llamada.

[text overlay: "Un archivo. Un dominio. Todo en un lugar."]

---

## CTA

Si tu proyecto ya tiene la carpeta hooks/ llena de archivos sueltos,
este patrón te va a ahorrar mucho tiempo de navegación.

Guarda este video para cuando lo necesites.
Y si trabajas con Next.js y TanStack Query, sigue para más patrones como este.

[text overlay: "Guarda este video"]
