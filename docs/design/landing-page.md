# Landing Page Brief — Hacker House Protocol

## Objetivo
Convertir visitantes en usuarios del MVP. El producto está live — el CTA principal lleva al flujo de auth/onboarding directamente.

## Assets disponibles
- `/public/assets/hacker-house-protocol-logo.svg` — ícono/logo mark
- `/public/assets/hacker-house-protocol-text.svg` — versión texto del logo
- Cypher Kittens GIFs — existen pero aún no subidos al repo
- Screenshots del prototipo de BsAs — existen pero aún no subidos al repo

## Specs generales
- **Idioma**: inglés
- **CTA principal**: `AuthButton` — conecta wallet o email vía Privy, redirige al onboarding/dashboard
- **Precio**: 100% free — comunicarlo claramente
- **Audiencia**: global, ecosistema crypto/Web3
- **Sin waitlist** — acceso directo al MVP

## Estructura de secciones (en orden)

### 1. Navbar
- Logo (ícono + texto) alineado a la izquierda
- CTA derecha: `AuthButton` — muestra "Connect" si no está autenticado, dirección/email si sí lo está, "Dashboard →" si ya tiene sesión
- Fondo transparente con blur al hacer scroll

### 2. Hero
- **Background**: `MatrixBackground` — canvas animado con lluvia de caracteres (solo cubre la sección hero, no el resto de la página)
- **Badges**: "Open Beta · Free to use · Web3-native"
- **Headline**: "Find your Builder. Build together. Live the protocol."
- **Subheadline**: propuesta de valor en 3 líneas
- **CTA primario**: `AuthButton` + copy "Free forever. Connect your wallet or sign up with email."
- **Visual**: logo animado o Cypher Kitten (placeholder hasta que lleguen los GIFs)

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
- CTA: `AuthButton`

### 7. Final CTA — sección final
Repetición del CTA principal antes del footer:
- Headline: "The builder OS is live."
- Subheadline: "Join the protocol. Find your team. Ship."
- CTA: `AuthButton`
- Copy de soporte: "No credit card. Connect your wallet or sign up with email."

### 8. Footer
- Logo
- Links: Twitter/X · GitHub (pendiente handles)
- "hackerhouse.app · © 2026 Hacker House Protocol"

## Notas de implementación
- La ruta `/` es esta landing. La app empieza en `/dashboard` (post-login).
- Sin waitlist — `waitlist-form.tsx` ya no se usa en ninguna sección.
- Sin toggle de dark/light mode — la app es siempre dark.
- Mobile-first, pero debe verse bien en desktop.
- `MatrixBackground` usa `position: absolute` (no `fixed`) para no afectar secciones fuera del hero.
