# Life management app — product plan

React Native · Expo · local-first · Android

## Concept

Goals + consistency tracking with a hard reward gate. You earn things; you don't just buy them.

## Core loop

Open app → see goals + streaks → log something → check what you've unlocked

## Design principle

No guilt. No broken streaks spiralling. Misses are neutral. Progress is cumulative, not fragile.

## Storage

AsyncStorage locally. Cloud sync (Lambda + DynamoDB) added later — same schema, just replicated.

## Sections

Clearly separated, one bottom nav

## Goals

Named goals with milestones. Each milestone has a reward locked behind it. Progress bar. Streak count (forgiving — counts weekly consistency not daily).

## Wants

Wishlist of items (cork mat, desk mat, cube timer...). Each item is locked or unlocked based on a linked milestone. Unlocked = you may buy it.

## Budget

Monthly Pokémon allowance tracker. Fixed monthly allocation. Spend log. Rollover balance. What you can buy this month is gated by milestone too — unlocked = selection opens up.

## Prompts

Random nudges per category. "Have you looked at blind method lately?" surfaces when cubing hasn't been logged in a while. Dismissable, not naggy.

## Reward gate examples

Hard rules — milestone hit, item unlocks

- Learn blind method basics→ desk mat unlocks
- 20h juggling logged→ cork mat for rola bola unlocks
- Sub-20s average achieved→ new cube unlocks
- Pokémon monthly milestone→ broader card selection opens
- Whitstaballs site launched→ something properly special, TBD

## Goals tracked

Milestones + consistency — not time-blocked, not rigid

- Cubing — sub-20 average Blind method — learn basics
- Juggling — 20h logged 5-ball — 50 clean catches Rola bola — 60s balance Rollerblading — zigzag competent
- Unicycle — idling 30s Cardistry — first full routine
- Pokémon — monthly budget kept Whitstaballs — site live

You define these — this is a starter set based on what you've mentioned. All editable.

## Tech stack

### Framework

React Native via Expo — scan QR, runs on your Android immediately

### Storage

AsyncStorage for local. Later: DynamoDB + Lambda behind a tiny API

### Style

StyleSheet only, same as skill journal. Dark, amber accent, monospace data.

### What this is not

Not a todo app. Not a habit tracker that breaks if you miss a day. Not a productivity dashboard with graphs of your productivity. Not something that makes you feel bad for living your life.
