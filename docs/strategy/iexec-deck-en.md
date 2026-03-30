# iExec Pitchathon Deck — Hacker House Protocol

**Format**: 9 slides, 4 minutes
**Track**: iExec — Confidential Computing Infrastructure for Web3

---

## Slide 1 — Title / Project Snapshot

**Hacker House Protocol**

> We can't force the best builders in the world to make their financial balances public just to coordinate who they'll build with or where they'll sleep at the next hackathon.

- **Track**: iExec — Confidential DeFi & RWA
- **Team**: Hacker House Protocol
- **Value prop**: Confidential coordination primitives for Web3 co-living — Key NFTs, private staking, and reputation-based credit powered by iExec TEEs.

---

## Slide 2 — Problem

**Every on-chain transaction is a window into your entire financial life.**

When a builder pays 0.05 ETH to join a Hacker House, that public transaction exposes:

- Their full wallet — balance, tokens, NFTs, DeFi positions
- Their movement pattern — which cities, which events, how much they spend on co-living
- Their physical security — anyone now knows where they'll sleep and how much their wallet holds

**The result**: builders with significant wallets don't pay on-chain. They escape to Venmo, bank transfers, or cash. Web3's payment rail loses to Web2 because of a privacy problem, not a technology problem.

Founders in stealth mode can't recruit talent without doxxing their identity. Organizations can't sponsor without exposing their strategy.

---

## Slide 3 — Solution

**Confidential Hacker Houses — 3 layers powered by iExec TEEs:**

**1. Confidential Payments & Key NFTs**
Builder pays → iExec TEE processes the transaction privately → Key NFT (access ticket) is minted → public output: "Slot confirmed" (no amount, no wallet exposed).

**2. On-chain verification without exposure**
Hacker Houses have access filters (min Talent Score, required POAPs). The TEE verifies credentials inside the enclave. Output: pass/fail. The wallet is never exposed to the creator or other participants.

**3. Confidential reputation credit**
Verified organizations fund builder access based on on-chain reputation evaluated privately. The builder doesn't reveal their full profile. The organization doesn't reveal their criteria.

---

## Slide 4 — Why iExec / Ecosystem Fit

> "Hacker House Protocol builds on iExec because human coordination in Web3 needs a privacy layer."

**Direct response to iExec's prompts:**

| iExec prompt | Our answer |
|---|---|
| "Tokenized RWA traded without exposing ownership?" | Key NFTs — Hacker House slots as tokenized RWA, buyable and transferable without exposing wallets |
| "DeFi vault keeping strategy private?" | Each House's staking pool operates as a confidential vault — participants protected from tracking |
| "Private lending enabling reputation-based credit?" | Organizations fund builders based on on-chain reputation evaluated privately inside TEE |
| "Confidential but auditable governance?" | Sponsored Houses = confidential resource allocation, fully auditable |

**Why it must be iExec**: without confidential computing, the entire payment rail breaks. This isn't an add-on — it's the primitive that makes on-chain coordination viable.

---

## Slide 5 — Product / User Journey

```
Builder wants to join a paid Hacker House
         │
         ▼
Sends payment → iExec TEE (secure enclave)
         │
         ▼
TEE processes privately:
  ✓ Verifies correct amount
  ✓ Confirms on-chain credentials (POAPs, Score)
  ✓ Mints Key NFT (transferable access ticket)
  ✓ Records payment in smart contract
         │
         ▼
Public output: "Slot confirmed" (no amount, no wallet)
Private output (builder only): receipt + Key NFT
```

**Key NFT** = tokenized physical access ticket. Transferable on-chain. Transfer is also confidential via TEE.

**Platform already exists**: profiles, Hack Spaces, Hacker Houses, matching — all implemented and running. This MVP adds only the confidential layer.

---

## Slide 6 — What Ships in 30 Days

### In scope
- Smart contract: creator sets up a Hacker House with hidden access requirements (min score, required POAPs)
- iExec TEE integration: builder connects wallet, proves credentials/funds privately
- Confidential Key NFT minting: contract validates match, secures slot, mints access token
- Minimal interface: create House with requirements → verify builder → pay/stake → receive Key NFT

### Out of scope
- Full confidential transfer marketplace
- Multi-chain deployment
- Organization sponsorship flow (Phase 3)

### Success at D+30
- End-to-end flow working on testnet: create → verify → pay → mint Key NFT
- Zero wallet exposure in the public transaction record
- Integrated with existing HHP platform

---

## Slide 7 — Execution Plan / Roadmap

| Week | Milestone |
|---|---|
| **Week 1** | Smart contract spec + iExec TEE setup. Define Key NFT metadata schema. Architecture for TEE ↔ contract communication. |
| **Week 2** | Core build: payment processing inside TEE, credential verification logic, Key NFT minting flow. |
| **Week 3** | Integration with existing HHP platform. Minimal UI for the full flow. Testing on iExec testnet. |
| **Week 4** | Testnet deployment. End-to-end testing. Documentation. Demo preparation. |

**Dependencies**: iExec TEE SDK access, testnet RLC for deployment.

**Existing stack that supports this:**
- HHP platform (profiles, Houses, matching) — already implemented
- Wallet auth via Privy — already working
- Ethereum integration via Alchemy RPC — already configured
- Data models for on-chain verification — already designed as TypeScript types

---

## Slide 8 — Team

*(Fill in with team details)*

- **[Name]** — Role, key skills, relevant experience
- **[Name]** — Role, key skills, relevant experience
- **[Name]** — Role, key skills, relevant experience

**Why us**:
- Platform already built and functional — this isn't a concept, it's an extension of a working product
- Direct experience in Web3 builder communities and co-living coordination
- Technical stack already compatible with iExec integration

---

## Slide 9 — Closing / Why You Should Back Us

**The problem is clear**: on-chain payments for physical coordination expose everything about a builder's financial life.

**The solution is focused**: iExec TEEs as the confidential layer between wallets and Hacker House smart contracts.

**The foundation fit is direct**: we respond to 4 of iExec's 5 prompts with concrete, buildable use cases.

**The execution is realistic**: the platform already works. We're adding one layer — the confidential one — and we'll ship it on testnet in 30 days.

> **Privacy isn't a feature we're adding. It's the primitive that makes on-chain coordination viable for the real world.**

We commit to delivering a working testnet prototype at D+30.
