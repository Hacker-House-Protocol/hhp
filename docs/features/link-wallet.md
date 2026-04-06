# Feature: Link Wallet — Hacker House Protocol

> Allow users who signed up with email to link their crypto wallet from the profile page, then auto-import on-chain data (Talent Protocol score/tags and POAPs).

**Status**: Spec written — 2026-04-06
**Complexity**: Small

---

## Overview

Users who register with email (no wallet) currently see static "Connect a wallet to import..." messages in the on-chain section of their profile. There is no interactive way to link a wallet after onboarding. This feature adds a "Link Wallet" button that opens Privy's wallet linking modal, syncs the wallet address to the database, and auto-imports on-chain credentials.

## Scope (MVP)

### In scope
- Expose `linkWallet` from Privy via `useAuth` hook
- Add "Link Wallet" button in `profile-onchain.tsx` when no wallet is connected
- After successful wallet link: call `/api/auth/sync` to persist wallet address, then auto-import Talent Protocol + POAPs
- Show importing state (spinner/animation) during the sync+import process
- On success: on-chain section updates to show score, tags, and POAPs
- Button should also work for users who want to change/add a wallet

### Out of scope (Phase 2)
- Unlink wallet functionality
- Multiple wallet support
- Wallet-specific permissions or signing

## Changes needed

- **DB**: none — `wallet_address` column already exists in `users` table
- **API**: none — `/api/auth/sync` already syncs wallet, `/api/integrations/talent-protocol` and `/api/integrations/poap` already handle imports
- **UI**: modify `profile-onchain.tsx` — replace static text with interactive "Link Wallet" button + import flow
- **Hooks**: modify `hooks/use-auth.ts` — expose `linkWallet` from `usePrivy()`
- **Service**: none — `useImportTalentScore` and `useImportPoaps` already exist in `services/api/integrations.ts`

## Notes

- Privy's `linkWallet()` opens a modal — no custom UI needed for the wallet connection itself
- After `linkWallet()` resolves, need to call `syncAndGetProfile()` to persist the wallet address to Supabase before triggering imports
- The `profile-onchain.tsx` component already handles the "has wallet" vs "no wallet" states — just need to add the interactive button for the "no wallet" case
- Related features: onboarding (step-scanning does the same import), profile (on-chain section)
