# 30-Day Milestones — Hacker House Protocol x iExec

**Goal**: Deliver Hacker Houses with confidential access verification, staking, and Key NFT minting on iExec testnet.

**Starting point**: The HHP platform already has Hacker Houses implemented (create, list, filter, apply, accept/reject, status management, image upload). This plan adds the on-chain confidential layer powered by iExec TEE.

---

## Week 1 — Smart Contract Foundation

**Focus**: Solidity contracts for Hacker House access and staking.

- [ ] Define Hacker House smart contract: creator deploys a House with hidden access requirements (required skill tags, required POAPs, capacity, stake amount)
- [ ] Implement staking logic: builders deposit ETH as attendance guarantee, locked until House ends
- [ ] Implement stake resolution: release on attendance confirmation, redistribute on no-show
- [ ] Write Key NFT contract (ERC-721): metadata includes event name, dates, slot number
- [ ] Unit tests for all contract functions (Hardhat + Chai)
- [ ] Deploy contracts to iExec testnet

**Deliverable**: Smart contracts deployed on testnet. Staking and Key NFT minting work via CLI/scripts.

---

## Week 2 — iExec TEE Integration

**Focus**: Confidential credential verification and private staking inside Trusted Execution Environments.

- [ ] Set up iExec SDK and TEE development environment
- [ ] Build TEE dApp for credential verification: receives builder wallet, checks POAPs and Talent Protocol skill tags against House requirements, returns pass/fail — wallet never exposed to House creator
- [ ] Build TEE dApp for confidential staking: processes stake deposit inside enclave, records payment in smart contract without exposing amount or wallet publicly
- [ ] Connect TEE verification output to Key NFT minting: on pass → mint Key NFT to builder
- [ ] Test full flow on iExec testnet: connect wallet → verify credentials in TEE → stake → receive Key NFT
- [ ] Handle edge cases: insufficient credentials, duplicate applications, capacity full

**Deliverable**: End-to-end confidential flow working on testnet. Builder connects wallet, TEE verifies credentials privately, stake is processed, Key NFT is minted.

---

## Week 3 — Frontend Integration

**Focus**: Connect the existing Hacker House UI to smart contracts and iExec TEE.

- [ ] Add on-chain requirements to House creation form: required skill tags, required POAPs, stake amount (new Step 4 fields replacing the current Phase 2 placeholders)
- [ ] Build "Verify & Join" flow in House detail page: builder clicks Join → Privy wallet signs → TEE verifies credentials → stake is processed → Key NFT minted → UI confirms slot
- [ ] Display Key NFT in builder profile (Achievement Gallery)
- [ ] Show verification status on House card: "Verified" badge for builders who passed TEE check
- [ ] Add stake info to House detail: total staked, builder's stake status, attendance resolution
- [ ] Update House dashboard for creators: attendance marking triggers on-chain stake resolution
- [ ] Connect existing Privy wallet auth to smart contract interactions (ethers.js / viem)

**Deliverable**: Full UI flow working. A builder can create a House with on-chain requirements, another builder can verify + stake + receive Key NFT — all from the existing HHP interface.

---

## Week 4 — Testing, Polish & Demo

**Focus**: End-to-end testing, bug fixing, and demo preparation.

- [ ] End-to-end testing of complete flow: create House → set requirements → builder applies → TEE verification → stake → Key NFT mint → attendance → stake release
- [ ] Test Key NFT transfer between builders (confidential via TEE)
- [ ] Edge case testing: failed verification, stake timeout, House cancellation
- [ ] Gas optimization on smart contracts
- [ ] Fix UI bugs and polish loading/error states for on-chain interactions
- [ ] Record demo video: full user journey showing confidential verification in action
- [ ] Write technical documentation: architecture, contract addresses, TEE dApp specs
- [ ] Prepare pitch presentation with live testnet demo

**Deliverable**: Working testnet demo ready for presentation. Documentation complete. Video recorded.

---

## Summary

| Week | Focus | Deliverable |
|---|---|---|
| 1 | Smart contracts (staking + Key NFT) | Contracts deployed on testnet |
| 2 | iExec TEE (credential verification + confidential staking) | End-to-end confidential flow on testnet |
| 3 | Frontend (connect UI to contracts + TEE) | Full flow working from HHP interface |
| 4 | Testing + polish + demo | Testnet demo ready for presentation |

**What already exists** (not part of the 30 days):
- Hacker House CRUD (create, list, filter, apply, accept/reject)
- Builder profiles with POAP and Talent Protocol skill tag imports
- Wallet auth via Privy (embedded + external)
- Ethereum Mainnet integration via Alchemy RPC
- Full platform UI (landing, onboarding, dashboard, feeds)
