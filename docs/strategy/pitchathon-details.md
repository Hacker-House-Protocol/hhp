# Pitchathon — Platform Details

## What is Hacker House Protocol?

Hacker House Protocol is a social coordination network for Web3 builders. It connects people to form teams online and co-live at physical events — using on-chain identity as the foundation for matching.

It operates across two dimensions:

- **Hack Spaces** — Virtual project rooms where builders post open roles (frontend, smart contracts, design, strategy) and apply to join teams. Matching is driven by archetypes, skill tags, region, and language — not self-reported bios.
- **Hacker Houses** — Physical co-living spaces at hackathons, conferences, and key cities. Builders coordinate where they'll stay, with whom, and for how long. Same identity, same matching algorithm.

Both dimensions share a single on-chain identity layer, a unified matching system, and one brand.

## The Problem

Building a team in Web3 is slow, fragmented, and luck-dependent. Builders currently rely on Telegram groups, Twitter DMs, and hallway conversations at events. There's no structured way to find someone who has the right technical skills AND is aligned with your project.

The result: teams form too late, builders waste critical hours at hackathons searching instead of building, and every connection made at an event disappears when the event ends. There is no persistent identity, no accumulated reputation, and no coordination layer.

## Why On-chain Identity Changes Everything

For the first time, Web3 builders have real, verifiable credentials:

- **POAPs** — Proof of attendance at events, hackathons, and communities
- **Talent Protocol skill tags** — Verified technical abilities and domain expertise
- **Wallet history** — Contributions, deployments, and on-chain activity

Traditional platforms have no way to verify skills — they rely on self-reported data. Hacker House Protocol uses cryptographically verified credentials as the core of the builder profile. The matching algorithm runs on real data, not resumes.

## How It Works

1. **Onboard** — Sign in with wallet or social login (Privy handles both). Import POAPs and Talent Protocol skill tags automatically. Choose your archetype: Visionary (ideas), Builder (code), or Strategist (operations).
2. **Find your team** — Browse Hack Spaces, filter by skills and archetypes, apply to open roles. The feed ranks builders by relevance based on on-chain credentials.
3. **Co-live** — Join or create a Hacker House for an upcoming event or city. Coordinate logistics, confirm attendance, and arrive with your team already formed.

## Three Builder Archetypes

The archetype system is the core of matching. Every builder picks one:

- **The Visionary** — Has the idea, needs the team. Founders, product thinkers, narrative builders.
- **The Builder** — Has the skills, needs the project. Frontend, backend, smart contracts, design.
- **The Strategist** — Connects the pieces. GTM, operations, partnerships, execution.

Archetypes drive how builders appear in feeds, search results, and suggestions.

## What's Built Today

The platform is live and functional:

- Landing page with direct access to the MVP
- Full onboarding flow with wallet auth, POAP import, Talent Protocol skill tag import, and archetype selection
- Hack Spaces: create, list with filters, apply, accept/reject applications, status tracking
- Hacker Houses: create, list, apply, accept/reject (free tier)
- Builder profiles with verified credentials, skills, POAPs, and links
- Builder feed with relevance-based ordering

## Tech Stack

| Layer | Technology |
|---|---|
| Auth | Privy — social login + wallets + embedded wallets |
| Backend | Supabase — Postgres + RLS + Edge Functions |
| Frontend | Next.js + TypeScript (App Router) — deployed on Vercel |
| Blockchain | Ethereum Mainnet via Alchemy RPC |
| Integrations | Talent Protocol · POAP · Luma |

## The Vision

Be the human coordination layer of the crypto ecosystem. The place where every team, every project, and every collaboration begins. Not a social network. Not a job board. The protocol that connects the people who build Web3.

> "I arrived at ETHGlobal with my team already formed. I didn't waste a single day searching."
>
> That's the product working. That's the problem solved.
