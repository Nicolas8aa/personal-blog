---
title: "How We Switched to Stripe in Under 2 Hours After Our Provider Closed Our Account"
description: "An emergency payment migration story: provider account closure, fast Stripe rollout, and an AI + MCP workflow that kept checkout alive."
pubDatetime: 2026-02-18T15:00:00-05:00
tags:
  - stripe
  - payments
  - saas
  - nextjs
  - nestjs
  - ai
  - mcp
  - webhooks
draft: false
---

Our previous payment provider closed our account, and we had to switch fast to avoid breaking revenue.

This was not a planned migration with a long runway. It was an operational fire:
- checkout could not go down
- existing users still had active flows
- we had to ship safely, not just quickly

I integrated Stripe in under 2 hours by combining a provider-first architecture with AI-assisted implementation and MCP-powered doc lookup.

## Why This Had to Move Fast

The business constraint was simple: no provider, no payments.

At the same time, the product constraint was harder:
- standalone checkout had to keep working
- upsell flow had to keep working
- lobby checkout drawer had to keep working

And we still needed:
- Apple Pay support
- saved payment methods separated by provider
- token reuse for upsells
- coupon and wallet-balance compatibility
- reliable webhooks with no double grants

## What Made the 2-Hour Migration Possible

### 1. Provider-first architecture (before Stripe code)

Instead of injecting Stripe directly into old services, I formalized a provider boundary:
- `payments/providers/latpay/*`
- `payments/providers/stripe/*`
- shared services for business rules, transactions, and post-purchase effects

This kept Stripe as an implementation detail, not a rewrite.

### 2. AI + MCP docs loop

I used AI for:
- code generation and refactors
- fast retrieval of official Stripe docs through MCP

That removed most context switching and reduced wrong SDK assumptions.

### 3. Small vertical slices

I shipped in this order:
1. Stripe intent/session creation path
2. frontend payment UI with Stripe React SDK
3. Apple Pay and token handling
4. upsell token/payment-method reuse
5. coupon and wallet logic alignment
6. focused tests for shared logic and provider-specific behavior

Each slice was independently testable, which lowered rollback risk.

## Technical Decisions That Paid Off

- Kept money math in minor units to reduce rounding bugs
- Centralized post-purchase side effects (logs, CRM sync, tracking)
- Filtered saved methods by `provider` to prevent cross-provider token misuse
- Treated slow side effects as background/best-effort when safe
- Replaced nested ternaries with explicit mappings for provider event types

## Biggest Pitfalls (and Fixes)

- **DTO drift:** frontend payload had fields rejected by strict validation  
  Fix: align DTO contracts and sanitize payload shape.

- **Coupon + wallet edge cases:** discount ordering and wallet deduction conflicted  
  Fix: single source of truth for purchase amount and wallet usage.

- **Webhook overlap risk:** old and new handlers could both grant benefits  
  Fix: idempotency on transaction reference plus strict provider boundaries.

- **Apple Pay inconsistency across flows:** one surface worked, another failed  
  Fix: standardize Stripe Elements/Payment Request setup and domain prerequisites.

## Outcome

In less than 2 hours:
- Stripe worked across all checkout surfaces
- Apple Pay worked on the Stripe path
- saved methods worked with provider filtering
- upsell token reuse worked
- shared payment logic was cleaner and easier to maintain
- tests covered the highest-risk money and webhook paths

## If You Need to Do This Under Pressure

1. Define provider boundaries before writing new provider code.
2. Keep side effects centralized and idempotent.
3. Model all money in minor units (`amountMinorUnits`).
4. Use AI for speed, but verify payment invariants with tests.
5. Pull official docs through MCP while coding.

## Reusable Prompt Pattern

Use this pattern if you want to reproduce the workflow:

> "Analyze current payment flows (standalone, upsell, drawer), add Stripe as a new provider without breaking existing behavior, isolate provider-specific code, use official docs via MCP, and add tests for wallet/coupon/token/webhook edge cases."

## Final Takeaway

AI did not replace engineering judgment.

It accelerated execution once architecture, constraints, and verification rules were explicit.
That is why we could migrate fast after the provider shutdown without compromising payment reliability.
