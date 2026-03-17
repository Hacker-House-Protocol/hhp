# Product Overview — Hacker House Protocol

**Dominio**: hackerhouse.app
**Tagline**: "Find your Builder. Build together. Live the protocol."
**Versión doc**: v2.0 · Marzo 2026

---

## Visión

Plataforma que conecta builders del ecosistema crypto/Web3 en dos dimensiones complementarias:

**🏠 Hacker Houses** — Web3 Airbnb para builders. Co-living físico en eventos y ciudades clave. Pagos en crypto via smart contract. Modalidades: Gratuita / De pago / Con staking. Pueden ser patrocinadas por organizaciones verificadas.

**🔗 Hack Spaces + Builder Matching** — LinkedIn + Tinder para builders. Proyectos virtuales con convocatoria de roles específicos. Matching algorítmico por arquetipos, skills, región e idioma.

Ambas features comparten una sola capa de identidad on-chain, el mismo algoritmo de matching y una sola marca.

> No es un job board. No es una red social genérica. No es un marketplace de hospedaje. Es el sistema operativo de la escena builder.

---

## Los Tres Arquetipos

El arquetipo primario es el núcleo del sistema de matching. Define cómo la plataforma presenta al builder en feeds, sugerencias y búsquedas.

| Color | Arquetipo | Rol | Perfil |
|---|---|---|---|
| `#990070` | 💡 **The Visionary** | El que tiene la idea | Founder con visión clara. Genera narrativa, define dirección del producto, convoca talento. |
| `#8B78E6` | ♟ **The Strategist** | El que conecta los recursos | Operador. Conecta piezas, gestiona relaciones, estructura GTM y ejecución. |
| `#6EE76E` | ⚙️ **The Builder** | El que hace la tecnología | Técnico ejecutor: Frontend, Backend, Smart Contracts, Diseño. El más buscado. |

Los colores de arquetipo se usan en bordes de avatares, badges de perfil, highlights del feed y filtros visuales en todo el sistema.

---

## Tipos de Usuario

### Builder / Hacker
Usuario principal. Puede crear perfil, conectar wallet, importar credenciales Web3, crear y participar en Hack Spaces y Hacker Houses. El onboarding es accesible tanto para crypto-nativos como para quienes aún no tienen wallet.

### Organización
Entidad verificada manualmente por el equipo HHP. Puede financiar Hacker Houses patrocinadas, definir filtros de entrada y requisitos de staking. Onboarding manual en MVP — requiere solicitud con documentación.

### Comunidad (Post-MVP / V2)
Grupos de builders que forman organizaciones propias dentro de la plataforma. Fuera del alcance del MVP.

---

## Stack Tecnológico Decidido

| Capa | Tecnología |
|---|---|
| Auth | Privy — login social + wallets + embedded wallet automática |
| Backend / DB | Supabase — Postgres + RLS + Edge Functions + Realtime |
| Frontend | Next.js + TypeScript (App Router) — deploy en Vercel |
| Blockchain | Ethereum Mainnet via Alchemy RPC. Smart contract propio en Solidity (Hardhat). |
| Mapa | Leaflet + OpenStreetMap — open source, dark mode |
| ORM / Validación | Prisma + Zod |
| Integraciones | Talent Protocol · POAP · Luma (link externo) |

---

## Roadmap Resumido

| Fase | Foco |
|---|---|
| **Fase 0** | Repo, sistema de diseño en Figma, dominio y handles |
| **Fase 1 — MVP Core** | Auth + Cypher Identity + Hack Spaces + Hacker Houses gratuitas + Mapa + Matching + Notificaciones |
| **Fase 2 — Pagos On-chain** | Smart contract auditado + Hacker Houses de pago + Key NFT + POAPs propios + Staking + Organizaciones |
| **V2** | Chat interno + Comunidades + Cypher Kittens NFT + Analytics + EVVM Name Service |
| **V3** | ZK Matching privado + ZK Identity |
