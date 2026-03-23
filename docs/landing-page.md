# Landing Page Brief — Hacker House Protocol

## Objetivo
Capturar emails para el **waitlist** antes del lanzamiento del MVP. No hay acceso directo al producto todavía.

## Assets disponibles
- `/public/assets/hacker-house-protocol-logo.svg` — ícono/logo mark
- `/public/assets/hacker-house-protocol-text.svg` — versión texto del logo
- Cypher Kittens GIFs — existen pero aún no subidos al repo
- Screenshots del prototipo de BsAs — existen pero aún no subidos al repo

## Specs generales
- **Idioma**: inglés
- **CTA principal**: join waitlist (captura de email)
- **Precio**: 100% free — comunicarlo claramente
- **Audiencia**: global, ecosistema crypto/Web3
- **Sin Privy API keys todavía** — el botón de waitlist guarda el email de forma simple (sin auth real)
- **Sin email del proyecto todavía** — el formulario puede ser un placeholder funcional por ahora

## Estructura de secciones (en orden)

### 1. Navbar
- Logo (ícono + texto) alineado a la izquierda
- CTA derecha: "Join Waitlist" (pill primario, `--primary`)
- Fondo transparente con blur al hacer scroll

### 2. Hero
- **Headline**: "Find your Builder. Build together. Live the protocol."
- **Subheadline**: propuesta de valor en 1-2 líneas — qué es HHP, para quién es, qué resuelve
- **CTA primario**: "Join the Waitlist" + campo de email inline
- **Visual**: logo animado o Cypher Kitten (placeholder hasta que lleguen los GIFs)
- Badge: "Coming soon · Free to use · Web3-native"

### 3. What is HHP — Las dos dimensiones
Dos bloques en paralelo explicando las features core:
- 🔗 **Hack Spaces** — "Find your team. Build together." (se presenta primero — es el gancho principal)
- 🏠 **Hacker Houses** — "Live with your team. Show up IRL."
Cada bloque con ícono, título, descripción corta y 2-3 bullets de valor.

### 4. The Three Archetypes
Cards visuales para los 3 arquetipos con su color, símbolo, nombre y descripción de 1 línea.
- 💡 The Visionary `--visionary`
- ♟ The Strategist `--strategist`
- ⚙️ The Builder `--builder-archetype`
Copy de apoyo: "Choose your archetype. The algorithm does the rest."

### 5. How it works
Flujo simplificado en 3 pasos:
1. **Create your Cypher Identity** — connect wallet or sign up with email. Your on-chain credentials import automatically.
2. **Find your match** — browse Hack Spaces looking for your skills, or post your own project and let builders find you.
3. **Build IRL** — when your team is ready, spin up a Hacker House. Meet, build, ship.

### 6. ETH Global Cannes — Event callout
Banner o card destacada:
- "We'll be at ETH Global Cannes 2026"
- Texto corto: "Find us there or use HHP to form your team before the event."
- CTA: "Join the Waitlist"

### 7. Waitlist CTA — sección final
Repetición del CTA principal antes del footer:
- Headline secundario tipo "The builder OS is almost ready."
- Campo de email + botón
- Copy de soporte: "Be among the first builders on the protocol."

### 8. Footer
- Logo
- Links: Twitter/X · GitHub (pendiente handles)
- "hackerhouse.app · © 2026 Hacker House Protocol"

## Notas de implementación
- La ruta `/` es esta landing. La app empieza en `/home` (post-login).
- El formulario de waitlist guarda emails en Supabase (tabla `waitlist`) o en un servicio simple — a definir cuando haya credenciales.
- Sin toggle de dark/light mode — la app es siempre dark.
- Mobile-first, pero debe verse bien en desktop.
