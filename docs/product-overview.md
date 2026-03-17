# Product Overview — Hacker House Protocol

**Dominio**: hackerhouse.app
**Tagline**: "Find your Builder. Build together. Live the protocol."
**Versión doc**: v2.0 · Marzo 2026

---

## Visión

Plataforma que conecta builders del ecosistema crypto/Web3 en dos dimensiones complementarias:

**🔗 Hack Spaces + Builder Matching** — LinkedIn + Tinder para builders. Proyectos virtuales con convocatoria de roles específicos. Matching algorítmico por arquetipos, skills, región e idioma. **Es el gancho principal de la plataforma** — genera uso recurrente y lleva naturalmente a la creación de Hacker Houses.

**🏠 Hacker Houses** — Web3 Airbnb para builders. Co-living físico en eventos y ciudades clave. Pagos en crypto via smart contract (Fase 2). Pueden ser patrocinadas por organizaciones verificadas.

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
Usuario principal. Puede crear perfil, conectar wallet, importar credenciales Web3, crear y participar en Hack Spaces y Hacker Houses. El onboarding es accesible tanto para crypto-nativos como para quienes aún no tienen wallet (Privy genera una embedded wallet automáticamente).

Builders sin wallet pueden usar la plataforma pero no pueden participar en Hacker Houses de pago o con staking.

### Organización
Entidad verificada manualmente por el equipo HHP. Puede financiar Hacker Houses patrocinadas con sus propias reglas. Onboarding manual en MVP — requiere solicitud con documentación. Feature de Fase 2.

### Comunidad (V2)
Grupos de builders que forman organizaciones propias. Fuera del alcance del MVP.

---

## Decisiones de Producto Confirmadas

| Decisión | Resolución |
|---|---|
| Modelo de negocio MVP | **100% free** — sin fees ni planes de pago en el MVP |
| Mercado objetivo | **Global** — ecosistema crypto/Web3, sin foco geográfico específico |
| Feature principal | **Hack Spaces** — es el gancho de uso recurrente. Hacker Houses son el paso siguiente natural |
| Filtros on-chain (POAPs, NFTs, Talent Protocol score) | **Pospuestos a Fase 2** — los campos existen en el formulario pero no se validan en MVP |
| Modalidades de pago en Hacker Houses | **Solo gratuitas en Fase 1** — de pago y staking son Fase 2 (requieren smart contract auditado) |
| Landing page | **Waitlist** — captura emails, CTA "Join the Waitlist", en inglés |
| Routing | `/` es la landing, `/home` es la app post-login |
| Sin competidores directos conocidos en el mercado | Propuesta única — no anclar vs. otro producto |

---

## Assets Disponibles

| Asset | Ruta |
|---|---|
| Logo mark (ícono) | `/public/assets/hacker-house-protocol-logo.svg` |
| Logo texto | `/public/assets/hacker-house-protocol-text.svg` |
| Cypher Kittens GIFs | Existen, pendientes de subir al repo |
| Screenshots del prototipo | Existen, pendientes de subir al repo |

---

## Stack Tecnológico Decidido

| Capa | Tecnología |
|---|---|
| Auth | Privy — login social + wallets + embedded wallet (API keys pendientes) |
| Backend / DB | Supabase — Postgres + RLS + Edge Functions + Realtime |
| Frontend | Next.js + TypeScript (App Router) — deploy en Vercel |
| Blockchain | Ethereum Mainnet via Alchemy RPC. Smart contract Solidity/Hardhat (Fase 2) |
| Mapa | Leaflet + OpenStreetMap |
| ORM / Validación | Prisma + Zod |
| Integraciones | Talent Protocol · POAP · Luma |

---

## Roadmap Resumido

| Fase | Foco |
|---|---|
| **Fase 0** | Repo, design system, dominio y handles |
| **Fase 1 — MVP Core** | Auth + Cypher Identity + Hack Spaces + Hacker Houses gratuitas + Mapa + Matching + Notificaciones |
| **Fase 2 — Pagos On-chain** | Smart contract auditado + Hacker Houses de pago + Key NFT + POAPs propios + Staking + Organizaciones + Filtros on-chain |
| **V2** | Chat interno + Comunidades + Cypher Kittens NFT + Analytics + EVVM Name Service |
| **V3** | ZK Matching privado + ZK Identity |

---

## Pendientes Operativos

| Ítem | Estado |
|---|---|
| Privy API keys | Pendiente |
| Email del proyecto | Pendiente |
| Handles Twitter/X, GitHub org | Pendiente |
| Cypher Kittens GIFs subidos al repo | Pendiente |
| Screenshots prototipo subidos | Pendiente |
| Auditoría smart contract | A definir (Fase 2) |
