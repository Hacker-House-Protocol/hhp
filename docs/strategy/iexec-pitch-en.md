# iExec Track Pitch — Confidential Hacker Houses

**Track**: iExec — Confidential Computing Infrastructure for Web3
**Team**: Hacker House Protocol
**Angle**: Confidential DeFi & RWA — Key NFTs, private staking, and reputation-based credit for builder co-living

---

## One-liner

> We can't force the best builders in the world to make their financial balances public just to coordinate who they'll build with or where they'll sleep at the next hackathon.

---

## The Problem

Hacker House Protocol connects Web3 builders for physical co-living at events and key cities. Builders pay from their wallet to reserve a spot in a Hacker House — group split, attendance staking, or direct payment. Each slot becomes a **Key NFT**: a transferable physical access ticket on-chain.

**The problem: every on-chain transaction is a sentence of total transparency.**

When a builder pays 0.05 ETH to join a Hacker House, that public transaction exposes:

- **Their full wallet** — anyone can see the total balance, tokens, NFTs
- **Their financial history** — DeFi positions, yields, loans, liquidations
- **Their other Hacker Houses** — which ones they paid for, with whom, when
- **Their life pattern** — which cities they've been to, which events they attend, how much they spend on co-living
- **Their physical security** — anyone now knows where they'll sleep and how much their wallet holds

A builder who just wanted to book a bed ended up doxxing their entire life on-chain. A founder in stealth mode who wants to recruit talent has to choose between finding a team or protecting their identity.

---

## Why This Matters (Not Just a Nice-to-Have)

### For individual builders

A builder with a significant wallet becomes a target for:
- **Targeted phishing** — they know exactly how much you hold and where
- **Social engineering** — "I know you're at the Istanbul Hacker House and you hold 50 ETH"
- **Physical security risk** — they know where you'll sleep and how much your wallet is worth
- **Selection bias** — a Hacker House creator could accept or reject based on wallet balance, not skills

### For high-profile builders and stealth founders

A top developer, investor, or founder working in stealth mode wants to scout talent or apply to a project. To do so, they need to connect their wallet and prove on-chain credentials (POAPs, Talent Protocol skill tags, Custom NFTs). **That means revealing who they are, how much they have, and who they work with.** Top talent simply doesn't participate.

### For the Web3 co-living ecosystem

If paying for a Hacker House means exposing yourself, builders with significant capital simply don't pay on-chain. They use Venmo, bank transfers, or cash. **Web3's payment rail loses to Web2 because of a privacy problem, not a technology problem.**

### For sponsoring organizations

An organization funding sponsored Hacker Houses doesn't want competitors to see:
- How much they invest in community building
- Which builders they're funding
- Which cities and events they have a presence in

---

## The Solution: Confidential Hacker Houses with iExec

HHP integrates iExec's TEEs (Trusted Execution Environments) across three layers:

### Layer 1 — Confidential Payments & Key NFTs

```
Builder wants to join a paid Hacker House
         │
         ▼
Sends payment → iExec TEE (secure enclave in the processor)
         │
         ▼
TEE processes the transaction privately:
  ✓ Verifies the amount is correct
  ✓ Confirms the builder meets on-chain requirements
  ✓ Mints a Key NFT (transferable slot) to the builder
  ✓ Records the payment in the smart contract
         │
         ▼
Public output: "Slot confirmed" (no amount, no source wallet)
Private output (builder only): receipt + Key NFT in their wallet
```

The **Key NFT** is a tokenized physical access ticket. Each paid Hacker House generates N keys (one per slot). The builder can transfer their Key NFT to another builder without the creator's intervention — and that transfer is also confidential.

### Layer 2 — On-chain Verification Without Exposure

Hacker Houses have access filters: required Talent Protocol skill tags, required POAPs, specific NFTs. The TEE verifies the builder meets the conditions against their wallet inside the enclave. Output: "pass / fail". The wallet is never exposed to the creator or other participants.

### Layer 3 — Confidential Reputation Credit

Verified organizations can fund Hacker Houses and grant free access based on the builder's on-chain reputation. The TEE evaluates the builder's credentials (skill tags, history, contributions) privately and determines if they qualify for sponsorship — without the builder revealing their full profile or the organization revealing their internal criteria.

### What Changes with iExec

| Without iExec | With iExec |
|---|---|
| Builder's wallet is exposed in the transaction | Payment is processed in a TEE — wallet not publicly linked to the Hacker House |
| Key NFTs reveal who bought which slot | Key NFTs are minted and transferred confidentially |
| Anyone can see how much each participant paid | Only the smart contract knows payment status (paid/not paid) |
| Verifying on-chain credentials requires exposing the full wallet | TEE verifies and returns only pass/fail |
| Organizations expose their criteria and sponsorship amounts | Evaluation and funding processed confidentially |

---

## Concrete Use Cases

### 1. Key NFT as Confidential RWA

Each paid Hacker House slot is tokenized as a **Key NFT** — a real-world asset (physical access to a space) represented on-chain. The builder can transfer their Key NFT to another builder if they can't attend.

**Today**: Buying and transferring the Key NFT are public transactions. Anyone can see which wallet bought which slot, who it was transferred to, and track both wallets.

**With iExec**: The purchase and transfer of the Key NFT are processed inside the TEE. The smart contract confirms the slot has an owner, but the public blockchain doesn't record which wallet is behind it. **A tokenized real-world asset traded without exposing ownership or allocation on-chain.**

### 2. Private Attendance Staking

A builder stakes 0.1 ETH as a guarantee they'll attend. If they don't show up, they lose the stake. If they do, it's released.

**Today**: The stake is public. Everyone knows that builder has at least 0.1 ETH available, that they're committed to that House, and can track what happens with those funds.

**With iExec**: The TEE manages the entire stake. If the builder attends, it's released confidentially. If they don't, it's redistributed among attendees. The outcome is public (attended/didn't attend), but the amount and wallet remain private.

### 3. Confidential Reputation Credit

A verified organization wants to fund access for 20 builders to a premium Hacker House. Not just any builder — only those with strong credentials (ETHGlobal POAP, relevant Talent Protocol skill tags, contributions to relevant repos).

**Today**: The builder has to expose their entire wallet and credentials to prove they qualify. The organization has to publish their criteria and amounts.

**With iExec**: The TEE evaluates the builder's credentials privately and determines if they qualify for the sponsorship "reputation credit". The builder doesn't reveal their full profile, the organization doesn't reveal their internal criteria. **A new form of credit based on on-chain reputation evaluated confidentially.**

### 4. Private Group Payment (Split)

A Hacker House in Istanbul for 8 builders. Total cost: 0.4 ETH. Split: 0.05 ETH per person.

**Today**: 8 public transactions. Anyone knows who the 8 are, how much each paid, and can track their wallets.

**With iExec**: The TEE receives 8 encrypted payments, verifies each one paid their share, mints 8 Key NFTs, and confirms to the smart contract. Public result: "8/8 slots confirmed. House ready." No wallets exposed.

---

## Why Confidential-First (Not an Add-on)

Privacy is not an optional feature in this context. It's what determines whether builders use Web3's payment rail or escape to Web2.

**Without confidential computing:**
- Builders with significant capital → don't pay on-chain → the protocol loses its reason to exist
- Organizations → don't sponsor transparently → the business model weakens
- Web3 co-living → stays "free forever" because no one wants to expose themselves by paying

**With confidential computing:**
- Paying on-chain is as private as a bank transfer, but with Web3's advantages (no intermediaries, no borders, automatic smart contracts)
- Organizations can invest without revealing their strategy
- The protocol can monetize sustainably

---

## Feasibility — Why It's Buildable

### MVP Scope for iExec (Testnet at D+30)

We're not promising the entire platform. The 30-day deliverable is exclusively the **Confidential Staking + Key NFT engine**:

1. **Smart contract** where a creator sets up a Hacker House with hidden access requirements (required skill tags, required POAPs)
2. **iExec TEE integration** where a builder connects their wallet and proves they have the required credentials or staking funds — without exposing data on the public blockchain
3. **Confidential Key NFT minting** — the contract validates the match, secures the slot, and mints the access token
4. **Minimal interface** for the full flow: create House with requirements → verify builder → pay/stake → receive Key NFT

The HHP platform (landing, profiles, maps, feeds) already exists and works. This MVP adds only the confidential layer.

### Existing Stack That Supports This

| Component | Status |
|---|---|
| Full HHP platform (profiles, Hack Spaces, Hacker Houses) | Implemented and running |
| Payment smart contract (split + staking) | Designed for Phase 2. Solidity/Hardhat. |
| TEE infrastructure | iExec already provides — no need to build the enclave |
| Ethereum integration | HHP already uses Ethereum Mainnet via Alchemy RPC |
| Wallet auth | Privy already manages wallets (embedded + external) |
| Data models for on-chain verification | POAPs, NFTs, Talent Protocol skill tags already designed as TypeScript types |
| Key NFT (metadata: event, dates, slot) | Designed in product docs |

iExec's architecture fits naturally: the TEE acts as a trust intermediary between the builder's wallet and the Hacker House smart contract. No UX changes required — the builder pays normally, but the transaction is processed confidentially.

---

## Market Relevance — Beyond Hacker Houses

### Directly Responds to iExec's Prompts

| iExec Prompt | Our Response |
|---|---|
| "What if tokenized real-world assets could be traded without exposing ownership or allocation on-chain?" | Key NFTs: Hacker House slots as tokenized RWA, buyable and transferable without exposing wallets |
| "What if a DeFi vault could keep its strategy private, protecting LPs from MEV and copy-trading?" | Each Hacker House's staking pool operates as a confidential vault — participants are protected from tracking |
| "What if lending and borrowing positions were private, enabling new forms of credit (e.g. reputation-based)?" | Reputation credit: organizations fund builders based on on-chain reputation evaluated privately |
| "What if governance, rewards, and DAO allocations were confidential by default, while remaining auditable?" | Sponsored Hacker Houses are exactly this: confidential but auditable resource allocation |

### The Pattern Is Replicable

This pattern applies to any platform with crypto payments where privacy matters:

- **Web3 ticketing** — pay for an event without exposing your wallet
- **Co-working / co-living** — any physical reservation paid in crypto
- **DAO memberships** — pay dues without revealing your balance
- **Grants and sponsorships** — organizations that fund without exposing amounts

Hacker House Protocol is the first use case, but **confidential coordination primitives** is what the ecosystem needs.

---

## The 60-Second Pitch

Hacker House Protocol is the operating system for the Web3 builder scene. We connect people to form teams online and co-live at physical events. The platform already works — profiles, Hack Spaces, Hacker Houses, matching.

In our next phase, each Hacker House slot becomes a **Key NFT** — a tokenized real-world asset. Builders pay with crypto, stake as attendance guarantee, and organizations sponsor slots based on on-chain reputation.

But there's a fundamental problem: **every on-chain transaction is an open window into your entire financial life.** Your wallet, your balance, your positions, where you'll sleep at the next hackathon — all public, forever.

We can't force the best builders in the world to make their financial balances public just to coordinate who they'll build with or where they'll sleep.

**Hacker House Protocol builds on iExec because human coordination in Web3 needs a privacy layer.** Payments, staking, credential verification, and Key NFT transfers are processed inside TEEs — secure execution environments where no one, not even us, can see the data.

The smart contract confirms payment was made, credentials are valid, the slot is assigned. But the builder's wallet, balance, and financial identity remain protected.

**Privacy isn't a feature we're adding. It's the primitive that makes on-chain coordination viable for the real world.**

---

## Why This Foundation Fit

> "Hacker House Protocol builds on iExec because human coordination in Web3 needs a privacy layer. We can't force the best builders in the world to make their financial balances public just to coordinate who they'll build with or where they'll sleep at the next hackathon."

---

## Evaluation Criteria

| iExec Criteria | Our Response |
|---|---|
| **Problem clarity** | Paying, staking, or verifying credentials on-chain exposes the builder's full wallet. For physical co-living, this is a personal, financial, and physical security dealbreaker. |
| **Confidential-first logic** | Without confidential computing, builders don't use Web3's payment rail — they escape to Venmo/bank transfer. Stealth founders don't participate. Organizations don't sponsor transparently. Privacy is the unlock that enables the entire model. |
| **Feasibility** | MVP scoped to 30 days: smart contract + TEE + Key NFT + minimal interface. Existing platform already works. Compatible stack (Ethereum, Privy, Solidity). |
| **Market relevance** | Directly responds to 4 of iExec's 5 prompts: tokenized RWA, private vault, reputation credit, and confidential auditable allocation. Replicable pattern across ticketing, co-working, DAO memberships. |
