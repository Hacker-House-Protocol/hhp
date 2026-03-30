# iExec Pitchathon Deck — Hacker House Protocol

**Formato**: 9 slides, 4 minutos
**Track**: iExec — Confidential Computing Infrastructure for Web3

---

## Slide 1 — Título / Snapshot del Proyecto

**Hacker House Protocol**

> No podemos obligar a los mejores builders del mundo a hacer públicos sus balances financieros solo para coordinar con quién van a construir o dónde van a dormir en el próximo hackathon.

- **Track**: iExec — Confidential DeFi & RWA
- **Equipo**: Hacker House Protocol
- **Propuesta de valor**: Primitivas de coordinación confidencial para co-living Web3 — Key NFTs, staking privado y crédito reputacional impulsados por los TEEs de iExec.

---

## Slide 2 — Problema

**Cada transacción on-chain es una ventana a toda tu vida financiera.**

Cuando un builder paga 0.05 ETH para entrar a una Hacker House, esa transacción pública expone:

- Su wallet completa — balance, tokens, NFTs, posiciones DeFi
- Su patrón de movimiento — en qué ciudades, qué eventos, cuánto gasta en co-living
- Su seguridad física — cualquiera sabe dónde va a dormir y cuánto vale su wallet

**El resultado**: los builders con wallets significativas no pagan on-chain. Escapan a Venmo, transferencia bancaria o cash. El payment rail de Web3 pierde ante Web2 por un problema de privacidad, no de tecnología.

Los founders en stealth no pueden reclutar talento sin doxxear su identidad. Las organizaciones no pueden patrocinar sin exponer su estrategia.

---

## Slide 3 — Solución

**Confidential Hacker Houses — 3 capas con los TEEs de iExec:**

**1. Pagos confidenciales & Key NFTs**
Builder paga → el TEE de iExec procesa la transacción en privado → se mintea el Key NFT (ticket de acceso) → output público: "Cupo confirmado" (sin monto, sin wallet expuesta).

**2. Verificación on-chain sin exposición**
Las Hacker Houses tienen filtros de acceso (min Talent Score, POAPs requeridos). El TEE verifica credenciales dentro del enclave. Output: pass/fail. La wallet nunca se expone al creador ni a otros participantes.

**3. Crédito reputacional confidencial**
Organizaciones verificadas financian el acceso de builders basándose en reputación on-chain evaluada de forma privada. El builder no revela su perfil completo. La organización no revela sus criterios.

---

## Slide 4 — Por qué iExec / Ecosystem Fit

> "Hacker House Protocol construye sobre iExec porque la coordinación humana en Web3 necesita una capa de privacidad."

**Respuesta directa a los prompts de iExec:**

| Prompt de iExec | Nuestra respuesta |
|---|---|
| "RWA tokenizados sin exponer propiedad?" | Key NFTs — cupos de Hacker Houses como RWA tokenizados, comprables y transferibles sin exponer wallets |
| "Vault DeFi con estrategia privada?" | El staking pool de cada House opera como un vault confidencial — participantes protegidos de tracking |
| "Crédito basado en reputación privada?" | Organizaciones financian builders basándose en reputación on-chain evaluada de forma privada dentro del TEE |
| "Gobernanza confidencial pero auditable?" | Houses patrocinadas = asignación de recursos confidencial, completamente auditable |

**Por qué debe ser iExec**: sin confidential computing, todo el payment rail se rompe. No es un add-on — es la primitiva que hace viable la coordinación on-chain.

---

## Slide 5 — Producto / User Journey

```
Builder quiere entrar a una Hacker House de pago
         │
         ▼
Envía pago → iExec TEE (enclave seguro)
         │
         ▼
El TEE procesa en privado:
  ✓ Verifica monto correcto
  ✓ Confirma credenciales on-chain (POAPs, Score)
  ✓ Mintea Key NFT (ticket de acceso transferible)
  ✓ Registra pago en el smart contract
         │
         ▼
Output público: "Cupo confirmado" (sin monto, sin wallet)
Output privado (solo builder): recibo + Key NFT
```

**Key NFT** = ticket de acceso físico tokenizado. Transferible on-chain. La transferencia también es confidencial vía TEE.

**La plataforma ya existe**: perfiles, Hack Spaces, Hacker Houses, matching — todo implementado y funcionando. Este MVP agrega solo la capa confidencial.

---

## Slide 6 — Qué se entrega en 30 días

### En scope
- Smart contract: el creador levanta una Hacker House con requisitos de acceso ocultos (min score, POAPs requeridos)
- Integración iExec TEE: el builder conecta su wallet, prueba credenciales/fondos de forma privada
- Minteo confidencial de Key NFT: el contrato valida el match, asegura el cupo, mintea el token de acceso
- Interfaz mínima: crear House con requisitos → verificar builder → pagar/stakear → recibir Key NFT

### Fuera de scope
- Marketplace completo de transferencia confidencial
- Deploy multi-chain
- Flujo de patrocinio por organizaciones (Fase 3)

### Éxito en D+30
- Flujo end-to-end funcionando en testnet: crear → verificar → pagar → mintear Key NFT
- Cero exposición de wallets en el registro público de transacciones
- Integrado con la plataforma HHP existente

---

## Slide 7 — Plan de ejecución / Roadmap

| Semana | Milestone |
|---|---|
| **Semana 1** | Spec del smart contract + setup del TEE de iExec. Definir schema de metadata del Key NFT. Arquitectura de comunicación TEE ↔ contrato. |
| **Semana 2** | Build core: procesamiento de pagos dentro del TEE, lógica de verificación de credenciales, flujo de minteo de Key NFT. |
| **Semana 3** | Integración con la plataforma HHP existente. UI mínima para el flujo completo. Testing en testnet de iExec. |
| **Semana 4** | Deploy en testnet. Testing end-to-end. Documentación. Preparación del demo. |

**Dependencias**: acceso al SDK TEE de iExec, RLC de testnet para deploy.

**Stack existente que lo soporta:**
- Plataforma HHP (perfiles, Houses, matching) — ya implementada
- Wallet auth vía Privy — ya funcionando
- Integración Ethereum vía Alchemy RPC — ya configurada
- Data models para verificación on-chain — ya diseñados como tipos TypeScript

---

## Slide 8 — Equipo

*(Completar con los datos del equipo)*

- **[Nombre]** — Rol, skills clave, experiencia relevante
- **[Nombre]** — Rol, skills clave, experiencia relevante
- **[Nombre]** — Rol, skills clave, experiencia relevante

**Por qué nosotros**:
- La plataforma ya está construida y funcional — esto no es un concepto, es una extensión de un producto funcionando
- Experiencia directa en comunidades de builders Web3 y coordinación de co-living
- Stack técnico ya compatible con la integración de iExec

---

## Slide 9 — Cierre / Por qué apoyarnos

**El problema es claro**: los pagos on-chain para coordinación física exponen todo sobre la vida financiera de un builder.

**La solución es enfocada**: los TEEs de iExec como la capa confidencial entre wallets y smart contracts de Hacker Houses.

**El fit con la fundación es directo**: respondemos a 4 de los 5 prompts de iExec con casos de uso concretos y construibles.

**La ejecución es realista**: la plataforma ya funciona. Estamos agregando una capa — la confidencial — y la entregaremos en testnet en 30 días.

> **La privacidad no es un feature que estamos agregando. Es la primitiva que hace viable la coordinación on-chain para el mundo real.**

Nos comprometemos a entregar un prototipo funcional en testnet en D+30.
