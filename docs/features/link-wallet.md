# Feature: Link Wallet — Hacker House Protocol

> Allow users who signed up with email to link their crypto wallet from the profile page, then auto-import on-chain data (Talent Protocol score/tags and POAPs).

**Status**: ✅ Implemented — 2026-04-06
**Complexity**: Small

---

## Overview

Users who register with email (no wallet) currently see static "Connect a wallet to import..." messages in the on-chain section of their profile. There is no interactive way to link a wallet after onboarding. This feature adds a "Link Wallet" button that opens Privy's wallet linking modal, syncs the wallet address to the database, and auto-imports on-chain credentials.

## Scope (MVP)

### In scope
- "Link Wallet" button in `profile-onchain.tsx` when no wallet is connected (owner only)
- Uses `useLinkAccount` from `@privy-io/react-auth` directly in the component (not via `useAuth`)
- After successful wallet link: `syncAndGetProfile()` persists wallet address, then auto-imports Talent Protocol + POAPs via `Promise.allSettled`
- Show importing state (spinner + "Importing...") during the sync+import process
- On success: invalidates profile query, on-chain section updates to show score, tags, and POAPs

### Out of scope (Phase 2)
- Unlink wallet functionality
- Multiple wallet support
- Wallet-specific permissions or signing

## Implementation

- **DB**: none — `wallet_address` column already exists in `users` table
- **API**: none — `syncAndGetProfile()` already syncs wallet, `/api/integrations/talent-protocol` and `/api/integrations/poap` already handle imports
- **UI**: modified `profile-onchain.tsx` — added "Link Wallet" button with `useLinkAccount` hook + `onSuccess` callback for sync+import flow
- **Hooks**: `hooks/use-auth.ts` was NOT modified — `useLinkAccount` is used directly in the component instead of going through `useAuth`
- **Service**: none — `useImportTalentScore` and `useImportPoaps` already exist in `services/api/integrations.ts`

## Notes

- Privy's `useLinkAccount` provides `linkWallet` — opens a modal, no custom UI needed for wallet connection
- The `onSuccess` callback in `useLinkAccount` handles the full chain: `syncAndGetProfile()` → `Promise.allSettled([importTalent, importPoaps])` → `invalidateQueries`
- The component tracks `isLinkingWallet` state separately from `isImporting` (Sync button state)
- Both the Sync button and Link Wallet button are disabled while either operation is in progress
- The button only shows for the profile owner (`isOwner`) when there is no wallet connected
- Related features: onboarding (step-scanning does the same import), profile (on-chain section)
