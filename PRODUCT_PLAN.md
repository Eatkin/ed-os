# RPG Life Management App — Screen Structure

## Bottom Navigation (5 screens)

### Home (Default)
**Function:** At-a-glance dashboard. Your entry point every time you open the app.

- Profile card: name, current level, total hero points, key attributes (cognition, dexterity, balance, endurance)
- Trajectory grid: all 7 trajectories in a 2-column card layout
  - Each card shows: trajectory name, heat indicator (hot/warm/cold/frozen), weekly log count vs. target
  - Visual heat: red (hot), amber (warm), blue (cold), gray (frozen)
- Quick stats: total XP toward next profile level, number of milestones cleared, loot items owned

---

### Goals
**Function:** Deep dive into trajectory tracking. See milestones, manage logs, track individual trajectory progress.

- Trajectory list: all 7 trajectories, sortable by heat or name
- Per trajectory:
  - Current level, XP to next level (progress bar)
  - Weekly consistency: log count vs. target (e.g., "2/3 this week")
  - Streak: consecutive weeks hitting target
  - Milestones: list of all milestones for this trajectory, checked if cleared
  - Vault entries: reminders/notes specific to this trajectory
  - **Log activity** button: opens modal to record a session (resistance + note)

---

### Wants
**Function:** Loot store. See what you've unlocked via milestones, what's still locked, browse your collection.

- Inventory: items you own (OWNED status)
- Available: items unlocked by milestones, ready to buy with hero points (AVAILABLE status)
- Locked: items behind milestones you haven't cleared yet (LOCKED status)
- Per item:
  - Name, category, cost in hero points
  - Required milestone (if any)
  - **Purchase** button (if AVAILABLE and you have points) → deducts points, marks as OWNED
  - Notes field (tips, description)

---

### Prompts
**Function:** Inspiration screen. Random nudges based on activity, surfaces cold/frozen trajectories, dismissable.

- "What do you feel like doing?" prompt section:
  - Randomized suggestions from cold/frozen trajectories
  - E.g., "Have you looked at blind method lately? (Cubing hasn't been logged in 8 days)"
  - **Dismiss** button (removes this prompt, cycles to next)
- Alternative suggestions:
  - "Try something completely different" → random trajectory regardless of heat
  - "Latest vault reminders" → show recent vault entries across all trajectories
- Historical nudges: list of past prompts you've dismissed (so you can go back if you want)

---

## Data Flow & Key Actions

### Logging an Activity (any screen)
1. User taps "Log Activity" on Goals screen (or quick button on Home)
2. Modal: pick trajectory (if not already picked), select resistance (Flow/Neutral/Resistant/Soul-Crushing), optional note, optional duration hours
3. API calculates XP based on friction × resistance multiplier
4. Log created, trajectory XP/level updated, heat updated, hero points granted
5. State refreshed, user returns to previous screen

### Unlocking Loot
1. User clears a milestone on Goals screen (manual button, or auto-detect if criteria met later)
2. All loot items linked to that milestone flip from LOCKED → AVAILABLE
3. Wants screen shows those items as available for purchase
4. User can buy with hero points (if cost > 0) → status becomes OWNED

### Heat & Prompts
1. Every time state refreshes, trajectories recalculate heat based on `lastLoggedAt`
2. Heat feeds Prompts screen: cold/frozen trajectories get surfaced as nudges
3. No punishment, just visibility and reminder

---

## Schema Refresh (what screens read/write)

| Screen | Reads | Writes |
|--------|-------|--------|
| Home | profile, trajectories (heat), logs (count) | — |
| Goals | trajectories, logs, vault | logs, milestones, vault |
| Wants | lootStore, trajectories | lootStore (purchase) |
| Budget | profile (hero points), logs (filtered Pokémon) | logs (spend entries) |
| Prompts | trajectories (heat), vault | logs (dismiss tracking) |
