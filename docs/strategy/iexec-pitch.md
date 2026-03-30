# iExec Track Pitch — Confidential Hacker Houses

**Track**: iExec — Confidential Computing Infrastructure for Web3
**Equipo**: Hacker House Protocol
**Ángulo**: Confidential DeFi & RWA — Key NFTs, staking privado y crédito reputacional para co-living de builders

---

## One-liner

> We can't force the best builders in the world to make their financial balances public just to coordinate who they'll build with or where they'll sleep at the next hackathon.

---

## El problema

Hacker House Protocol conecta builders Web3 para co-living físico en eventos y ciudades clave. Los builders pagan desde su wallet para reservar un lugar en una Hacker House — split grupal, staking por asistencia, o pago directo. Cada cupo se convierte en un **Key NFT**: un ticket de acceso físico transferible on-chain.

**El problema: cada transacción on-chain es una sentencia de transparencia total.**

Cuando un builder paga 0.05 ETH para entrar a una Hacker House, esa transacción pública expone:

- **Su wallet completa** — cualquiera puede ver el balance total, tokens, NFTs
- **Su historial financiero** — posiciones DeFi, yields, préstamos, liquidaciones
- **Sus otras Hacker Houses** — a cuáles más pagó, con quién, cuándo
- **Su patrón de vida** — en qué ciudades estuvo, qué eventos frecuenta, cuánto gasta en co-living
- **Su seguridad física** — ahora cualquiera sabe dónde va a dormir y cuánto tiene en su wallet

Un builder que solo quería reservar una cama terminó doxxeando su vida entera on-chain. Un founder en modo stealth que quiere reclutar talento tiene que elegir entre buscar equipo o proteger su identidad.

---

## Por qué esto importa (y no es solo un nice-to-have)

### Para builders individuales

Un builder con una wallet significativa se convierte en target de:
- **Phishing dirigido** — saben exactamente cuánto tiene y dónde lo tiene
- **Social engineering** — "sé que estás en la Hacker House de Estambul y que holdeas 50 ETH"
- **Riesgo de seguridad física** — saben dónde vas a dormir y cuánto vale tu wallet
- **Sesgo en la selección** — un creador de Hacker House podría aceptar o rechazar basándose en el balance de la wallet, no en las skills

### Para builders de alto perfil y founders en stealth

Un desarrollador top, un inversor, o un founder trabajando en modo stealth quiere buscar talento o aplicar a un proyecto. Para hacerlo tiene que conectar su wallet y probar credenciales on-chain (POAPs, skill tags, NFTs). **Eso implica revelar quién es, cuánto tiene, y con quién trabaja.** El talento de alto nivel simplemente no participa.

### Para el ecosistema de co-living Web3

Si pagar por una Hacker House implica exponerse, los builders con más capital simplemente no pagan on-chain. Usan Venmo, transferencia bancaria, o cash. **El payment rail de Web3 pierde ante Web2 por un problema de privacidad, no de tecnología.**

### Para organizaciones que patrocinan

Una organización que financia Hacker Houses patrocinadas no quiere que la competencia vea:
- Cuánto invierte en community building
- A qué builders está financiando
- En qué ciudades y eventos tiene presencia

---

## La solución: Confidential Hacker Houses con iExec

HHP integra los TEEs (Trusted Execution Environments) de iExec en tres capas:

### Capa 1 — Confidential Payments & Key NFTs

```
Builder quiere entrar a una Hacker House de pago
         │
         ▼
Envía el pago → iExec TEE (enclave seguro en el procesador)
         │
         ▼
El TEE procesa la transacción en privado:
  ✓ Verifica que el monto es correcto
  ✓ Confirma que el builder cumple requisitos on-chain
  ✓ Emite un Key NFT (cupo transferible) al builder
  ✓ Registra el pago en el smart contract
         │
         ▼
Output público: "Cupo confirmado" (sin monto, sin wallet origen)
Output privado (solo builder): recibo + Key NFT en su wallet
```

El **Key NFT** es un ticket de acceso físico tokenizado. Cada Hacker House de pago genera N keys (una por cupo). El builder puede transferir su Key NFT a otro builder sin intervención del creador — y esa transferencia también es confidencial.

### Capa 2 — Verificación on-chain sin exposición

Las Hacker Houses tienen filtros de acceso: Talent Protocol skill tags requeridas, POAPs requeridos, NFTs específicos. El TEE verifica que el builder cumple las condiciones contra su wallet dentro del enclave. Output: "cumple / no cumple". La wallet nunca se expone al creador ni a otros participantes.

### Capa 3 — Crédito reputacional confidencial

Las organizaciones verificadas pueden financiar Hacker Houses y otorgar acceso gratuito basado en la reputación on-chain del builder. El TEE evalúa las credenciales del builder (skill tags, historial, contribuciones) de forma privada y determina si califica para el patrocinio — sin que el builder tenga que revelar su perfil completo ni la organización revele sus criterios internos.

### Qué cambia con iExec

| Sin iExec | Con iExec |
|---|---|
| La wallet del builder queda expuesta en la transacción | El pago se procesa en un TEE — la wallet no se vincula públicamente a la Hacker House |
| Key NFTs revelan quién compró qué cupo | Key NFTs se emiten y transfieren de forma confidencial |
| Cualquiera puede ver cuánto pagó cada participante | Solo el smart contract sabe el estado del pago (pagado/no pagado) |
| Verificar credenciales on-chain requiere exponer toda la wallet | El TEE verifica y devuelve solo pass/fail |
| Las organizaciones exponen sus criterios y montos de patrocinio | Evaluación y fondeo procesados de forma confidencial |

---

## Casos de uso concretos

### 1. Key NFT como RWA confidencial (responde a "What if tokenized real-world assets could be traded without exposing ownership...")

Cada cupo de Hacker House de pago se tokeniza como un **Key NFT** — un activo del mundo real (acceso físico a un espacio) representado on-chain. El builder puede transferir su Key NFT a otro builder si no puede asistir.

**Hoy**: Comprar y transferir el Key NFT son transacciones públicas. Cualquiera puede ver qué wallet compró qué cupo, a quién se lo transfirió, y rastrear ambas wallets.

**Con iExec**: La compra y transferencia del Key NFT se procesan dentro del TEE. El smart contract confirma que el cupo tiene dueño, pero la blockchain pública no registra qué wallet está detrás. **Un activo del mundo real tokenizado que se comercia sin exponer propiedad ni asignación on-chain.**

### 2. Staking por asistencia privado

Un builder stakea 0.1 ETH como garantía de que asistirá. Si no va, pierde el stake. Si va, se libera.

**Hoy**: El stake es público. Todos saben que ese builder tiene al menos 0.1 ETH disponibles, que está comprometido con esa House, y pueden rastrear qué pasa con esos fondos.

**Con iExec**: El TEE gestiona el stake completo. Si el builder asiste, se libera de forma confidencial. Si no asiste, se redistribuye entre los asistentes. El resultado es público (asistió/no asistió), pero el monto y la wallet quedan privados. **Similar a cómo un vault DeFi podría mantener su estrategia privada — el staking pool protege a los participantes de tracking externo.**

### 3. Crédito reputacional confidencial (responde a "What if lending and borrowing positions were private, enabling new forms of credit (e.g. reputation-based)?")

Una organización verificada quiere financiar el acceso de 20 builders a una Hacker House premium. No cualquier builder — solo los que tengan credenciales fuertes (POAP de ETHGlobal, Talent Protocol skill tags relevantes, contribuciones a repos relevantes).

**Hoy**: El builder tiene que exponer toda su wallet y credenciales para probar que califica. La organización tiene que publicar sus criterios y montos.

**Con iExec**: El TEE evalúa las credenciales del builder de forma privada y determina si califica para el "crédito reputacional" del patrocinio. El builder no revela su perfil completo, la organización no revela sus criterios internos. **Es una nueva forma de crédito basada en reputación on-chain evaluada de forma confidencial.**

### 4. Pago grupal privado (split)

Una Hacker House en Estambul para 8 builders. Costo total: 0.4 ETH. Split: 0.05 ETH por persona.

**Hoy**: 8 transacciones públicas. Cualquiera sabe quiénes son los 8, cuánto pagó cada uno, y puede rastrear sus wallets.

**Con iExec**: El TEE recibe los 8 pagos cifrados, verifica que cada uno pagó su parte, emite 8 Key NFTs, y confirma al smart contract. Resultado público: "8/8 cupos confirmados. House lista." Sin wallets expuestas.

---

## Por qué confidential-first (no es un add-on)

La privacidad no es un feature opcional en este contexto. Es lo que determina si los builders usan el payment rail de Web3 o escapan a Web2.

**Sin confidential computing:**
- Builders con capital significativo → no pagan on-chain → el protocolo pierde su razón de ser
- Organizaciones → no patrocinan de forma transparente → el modelo de negocio se debilita
- El co-living Web3 → se queda en "gratuito para siempre" porque nadie quiere exponerse pagando

**Con confidential computing:**
- Pagar on-chain es tan privado como una transferencia bancaria, pero con las ventajas de Web3 (sin intermediarios, sin fronteras, smart contract automático)
- Las organizaciones pueden invertir sin revelar su estrategia
- El protocolo puede monetizar de forma sostenible

---

## Feasibility — Por qué es construible

### Scope del MVP para iExec (Testnet a D+30)

No prometemos toda la plataforma. El entregable a 30 días es exclusivamente el **motor de Confidential Staking + Key NFT**:

1. **Smart contract** donde un creador levanta una Hacker House con requisitos de acceso ocultos (skill tags requeridas, POAPs requeridos)
2. **Integración iExec TEE** donde un builder conecta su wallet y prueba que tiene las credenciales o los fondos de staking requeridos — sin exponer datos en la blockchain pública
3. **Emisión de Key NFT** confidencial — el contrato valida el match, asegura el cupo, y emite el token de acceso
4. **Interfaz mínima** para el flujo completo: crear House con requisitos -> verificar builder -> pagar/stakear -> recibir Key NFT

La plataforma HHP (landing, perfiles, mapas, feeds) ya existe y funciona. Este MVP agrega solo la capa confidencial.

### Stack existente que lo soporta

| Componente | Estado |
|---|---|
| Plataforma HHP completa (perfiles, Hack Spaces, Hacker Houses) | Implementado y funcionando |
| Smart contract de pagos (split + staking) | Diseñado para Fase 2. Solidity/Hardhat. |
| Infraestructura TEE | iExec ya provee — no hay que construir el enclave |
| Integración con Ethereum | HHP ya usa Ethereum Mainnet via Alchemy RPC |
| Wallet auth | Privy ya gestiona wallets (embedded + externas) |
| Data models para verificación on-chain | POAPs, NFTs, Talent Protocol skill tags ya diseñados como tipos TypeScript |
| Key NFT (metadata: evento, fechas, cupo) | Diseñado en la doc de producto |

La arquitectura de iExec encaja naturalmente: el TEE actúa como intermediario de confianza entre la wallet del builder y el smart contract de la Hacker House. No requiere cambios en la UX — el builder paga normalmente, pero la transacción se procesa de forma confidencial.

---

## Market relevance — Más allá de Hacker Houses

### Responde directamente a los prompts de iExec

| Prompt de iExec | Nuestra respuesta |
|---|---|
| "What if tokenized real-world assets could be traded without exposing ownership or allocation on-chain?" | Key NFTs: cupos de Hacker Houses como RWA tokenizados, comprables y transferibles sin exponer wallets |
| "What if a DeFi vault could keep its strategy private, protecting LPs from MEV and copy-trading?" | El staking pool de cada Hacker House opera como un vault confidencial — los participantes están protegidos de tracking |
| "What if lending and borrowing positions were private, enabling new forms of credit (e.g. reputation-based)?" | Crédito reputacional: organizaciones financian builders basándose en reputación on-chain evaluada de forma privada |
| "What if governance, rewards, and DAO allocations were confidential by default, while remaining auditable?" | Las Hacker Houses patrocinadas son exactamente esto: asignación de recursos confidencial pero auditable |

### El patrón es replicable

Este patrón aplica a cualquier plataforma con pagos crypto donde la privacidad importa:

- **Ticketing Web3** — pagar por un evento sin exponer tu wallet
- **Co-working / co-living** — cualquier reserva física pagada en crypto
- **Membresías DAO** — pagar dues sin revelar tu balance
- **Grants y patrocinios** — organizaciones que financian sin exponer montos

Hacker House Protocol es el primer caso de uso, pero **confidential coordination primitives** es lo que el ecosistema necesita.

---

## El pitch en 60 segundos

Hacker House Protocol es el sistema operativo de la escena builder Web3. Conectamos personas para formar equipos online y co-vivir en eventos físicos. La plataforma ya funciona — perfiles, Hack Spaces, Hacker Houses, matching.

En nuestra siguiente fase, cada cupo de Hacker House se convierte en un **Key NFT** — un activo del mundo real tokenizado. Los builders pagan con crypto, stakean como garantía de asistencia, y las organizaciones patrocinan cupos basándose en reputación on-chain.

Pero hay un problema fundamental: **cada transacción on-chain es una ventana abierta a toda tu vida financiera.** Tu wallet, tu balance, tus posiciones, dónde vas a dormir en el próximo hackathon — todo público, para siempre.

No podemos obligar a los mejores builders del mundo a hacer públicos sus balances financieros solo para coordinar con quién van a construir o dónde van a dormir.

**Hacker House Protocol elige construir sobre iExec porque la colaboración humana en Web3 necesita una capa de privacidad.** Los pagos, el staking, la verificación de credenciales y la transferencia de Key NFTs se procesan dentro de TEEs — entornos de ejecución seguros donde nadie, ni siquiera nosotros, puede ver los datos.

El smart contract confirma que se pagó, que las credenciales son válidas, que el cupo está asignado. Pero la wallet del builder, su balance, y su identidad financiera quedan protegidos.

**Privacy isn't a feature we're adding. It's the primitive that makes on-chain coordination viable for the real world.**

---

## Why This Foundation Fit (diapositiva recomendada)

> "Hacker House Protocol elige construir sobre iExec porque la colaboración humana en Web3 necesita una capa de privacidad. No podemos obligar a los mejores builders del mundo a hacer públicos sus balances financieros solo para coordinar con quién van a construir o dónde van a dormir en el próximo hackathon."

---

## Criterios de evaluación

| Criterio iExec | Nuestra respuesta |
|---|---|
| **Problem clarity** | Pagar, stakear o verificar credenciales on-chain expone la wallet completa del builder. Para co-living físico, esto es un dealbreaker de seguridad personal, financiera y física. |
| **Confidential-first logic** | Sin confidential computing, los builders no usan el payment rail de Web3 — escapan a Venmo/transferencia. Los founders en stealth no participan. Las organizaciones no patrocinan transparentemente. La privacidad es el unlock que habilita todo el modelo. |
| **Feasibility** | MVP acotado a 30 días: smart contract + TEE + Key NFT + interfaz mínima. Plataforma existente ya funciona. Stack compatible (Ethereum, Privy, Solidity). |
| **Market relevance** | Responde directamente a 4 de los 5 prompts de iExec: RWA tokenizados, vault privado, crédito reputacional, y asignación confidencial auditable. Patrón replicable en ticketing, co-working, membresías DAO. |
