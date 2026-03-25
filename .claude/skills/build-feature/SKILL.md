# Skill: build-feature

Orchestrates the full Plan → Implement → Verify pipeline for a new feature in Hacker House Protocol.

Launches three agents in sequence: **Planner** → **Implementer** → **Verifier**.

You (the main Claude) act as the orchestrator — you do not implement anything yourself.

---

## Step 1 — Extract the feature description

The argument passed to this skill is the feature description. If it's vague, do NOT ask for clarification — make reasonable assumptions based on `docs/prd.md` and `docs/features/`.

---

## Step 2 — Launch the Planner

Launch the `planner` agent with this prompt:

```
Produce a complete implementation plan for the following feature in Hacker House Protocol:

<feature description>

Follow your instructions exactly. Output the full structured plan.
```

Wait for the plan to complete. Save the full plan output — you will pass it to the next agents.

---

## Step 3 — Show the plan to the user

Display the plan output to the user with this header:

```
## Plan ready — review before implementing

<plan output>

---
Proceed with implementation? (the Implementer will execute this plan)
```

Wait for user confirmation before continuing.

---

## Step 4 — Launch the Implementer

Launch the `implementer` agent with this prompt:

```
Implement the following feature for Hacker House Protocol.

## Plan

<full plan output from Step 2>

Follow your instructions exactly. Execute every task in the ordered task list. Run pnpm build at the end and fix all errors.
```

Wait for implementation to complete.

---

## Step 5 — Launch the Verifier

Launch the `verifier` agent with this prompt:

```
Verify the implementation of the following feature in Hacker House Protocol.

## Original Plan

<full plan output from Step 2>

Run pnpm build, review all changed files, and produce the full verification report.
```

Wait for verification to complete.

---

## Step 6 — Final report

Show the user a summary:

```
## build-feature complete

**Feature**: <feature name>
**Status**: ✅ PASS / ❌ NEEDS FIXES

### What was built
<bullet list from Implementer report>

### Verification
<Verifier verdict + any remaining issues>
```

If the Verifier found 🔴 bugs that weren't auto-fixed, launch the Implementer again with just those fixes before reporting.
