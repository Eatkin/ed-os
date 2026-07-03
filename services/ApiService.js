/**
 * RPG Life Management App — Mock API Service
 * Local-first, AsyncStorage compatible, designed for Lambda + DynamoDB swap-in later
 * Heat-based trajectory tracking: no guilt, no decay, just visibility
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const RESISTANCE_MULTIPLIERS = {
  Flow: 1.0,
  Neutral: 1.1,
  Resistant: 1.3,
  "Soul-Crushing": 1.5,
};

const FRICTION_BASE_XP = {
  low: 10,
  medium: 25,
  high: 40,
};

// Heat calculation: how many days since last log before we say "cold"?
const HEAT_THRESHOLDS = {
  hot: 2, // logged in last 2 days
  warm: 7, // logged in last week
  cold: 30, // older than a week
  frozen: 999, // never logged or absurdly old
};

const LEVEL_UP_XP = 500; // XP needed to level (can scale per level later)

// ============================================================================
// SCHEMA
// ============================================================================

let DB_STATE = {
  // User profile: global level, hero points, base attributes
  profile: {
    name: "Ed",
    level: 1,
    totalXP: 0, // cumulative, never resets
    heroPoints: 0, // currency for loot store
    attributes: {
      cognition: 0,
      dexterity: 0,
      balance: 0,
      endurance: 0,
    },
  },

  // Trajectories: skill/habit tracks with milestones
  // Each trajectory has its own level, XP, milestones, and heat
  trajectories: {
    cubing_3x3: {
      id: "cubing_3x3",
      name: "3x3 Cubing",
      description: "Standard speedcubing progression",
      friction: "low", // low | medium | high
      attributeWeights: { cognition: 1.0 }, // how XP distributes to attributes
      level: 0,
      xp: 0,
      lastLoggedAt: null, // ISO string or null; used for heat calc
      weeklyTarget: 3,
      milestones: [
        {
          id: "m_cubing_sub25",
          text: "Achieve sub-25s average",
          cleared: false,
          unlocksLootIds: ["loot_cube_speedcube"],
        },
        {
          id: "m_cubing_blind",
          text: "Learn blind method basics",
          cleared: false,
          unlocksLootIds: ["loot_cubing_desk_mat"],
        },
      ],
    },

    juggling_5ball: {
      id: "juggling_5ball",
      name: "5-Ball Juggling",
      description: "Working towards clean cascades and tricks",
      friction: "medium",
      attributeWeights: { dexterity: 0.7, cognition: 0.3 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      milestones: [
        {
          id: "m_juggling_50clean",
          text: "50 consecutive clean catches",
          cleared: false,
          unlocksLootIds: ["loot_juggling_balls"],
        },
        {
          id: "m_juggling_20h",
          text: "20 hours logged",
          cleared: false,
          unlocksLootIds: ["loot_cork_mat"],
        },
      ],
    },

    rollerblading: {
      id: "rollerblading",
      name: "Rollerblading",
      description: "Freestyle progression and conditioning",
      friction: "high", // get ready, travel, skate, cool down
      attributeWeights: { balance: 0.6, endurance: 0.4 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      milestones: [
        {
          id: "m_rollerblading_zigzag",
          text: "Consistent zigzag competency",
          cleared: false,
          unlocksLootIds: ["loot_skate_upgrade"],
        },
      ],
    },

    unicycling: {
      id: "unicycling",
      name: "Unicycling",
      description: "Idling and freemount practice",
      friction: "high",
      attributeWeights: { balance: 1.0 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      milestones: [
        {
          id: "m_unicycle_30s_idle",
          text: "30 second idle hold",
          cleared: false,
          unlocksLootIds: [],
        },
      ],
    },

    cardistry: {
      id: "cardistry",
      name: "Cardistry",
      description: "Card manipulation and flourishes",
      friction: "low",
      attributeWeights: { dexterity: 0.8, cognition: 0.2 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      milestones: [
        {
          id: "m_cardistry_full_routine",
          text: "First complete routine",
          cleared: false,
          unlocksLootIds: ["loot_special_deck"],
        },
      ],
    },

    pokemon_collecting: {
      id: "pokemon_collecting",
      name: "Pokémon Collecting",
      description: "Monthly budget discipline and singles hunting",
      friction: "low",
      attributeWeights: { cognition: 1.0 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      milestones: [
        {
          id: "m_pokemon_monthly_budget",
          text: "Keep monthly budget all year",
          cleared: false,
          unlocksLootIds: ["loot_pokemon_grail"],
        },
      ],
    },

    whitstaballs: {
      id: "whitstaballs",
      name: "Whitstaballs",
      description: "Site launch and community building",
      friction: "high", // dev work is chunky
      attributeWeights: { cognition: 0.8, dexterity: 0.2 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      milestones: [
        {
          id: "m_whitstaballs_site_live",
          text: "Site live and public",
          cleared: false,
          unlocksLootIds: ["loot_whitstaballs_launch"],
        },
      ],
    },
  },

  // Activity logs: every time you log something, create an entry here
  logs: [
    {
      id: "log_abc123",
      trajectoryId: "cubing_3x3",
      timestamp: "2026-07-03T18:00:00Z",
      resistance: "Neutral",
      note: "Easy solves today, cube felt smooth",
      pointsAwarded: 11, // calculated: baseXP * multiplier
    }
  ],

  // Vault: persistent notes/reminders per trajectory
  vault: [
    {
      id: "vault_cubing_1",
      trajectoryId: "cubing_3x3",
      text: "J Perm blind execution algorithm — check out when you have 20 mins",
    },
    {
      id: "vault_rollerblading_1",
      trajectoryId: "rollerblading",
      text: "Left skate: tighten second buckle before next session",
    },
  ],

  // Loot Store: items unlocked by milestones or buyable with hero points
  lootStore: [
    {
      id: "loot_cube_speedcube",
      name: "Premium 3x3 Speedcube",
      category: "cubing",
      requiredMilestoneId: "m_cubing_sub25",
      cost: 1000, // hero points (or null if free unlock)
      status: "LOCKED", // LOCKED | AVAILABLE | OWNED
      notes: "High-tension magnetic cube, smooth corner cuts",
    },
    {
      id: "loot_cubing_desk_mat",
      name: "Desk Mat (Cubing)",
      category: "cubing",
      requiredMilestoneId: "m_cubing_blind",
      cost: 500,
      status: "LOCKED",
      notes: "Cork mat, 45x30cm, non-slip",
    },
    {
      id: "loot_juggling_balls",
      name: "Professional Juggling Balls (set of 5)",
      category: "juggling",
      requiredMilestoneId: "m_juggling_50clean",
      cost: 300,
      status: "LOCKED",
      notes: "Cascade-friendly weight distribution",
    },
    {
      id: "loot_cork_mat",
      name: "Cork Mat (Rola Bola)",
      category: "juggling",
      requiredMilestoneId: "m_juggling_20h",
      cost: 250,
      status: "LOCKED",
      notes: "For rola bola practice",
    },
    {
      id: "loot_skate_upgrade",
      name: "Skate Wheel Upgrade",
      category: "rollerblading",
      requiredMilestoneId: "m_rollerblading_zigzag",
      cost: 600,
      status: "LOCKED",
      notes: "Faster, smoother rollout",
    },
    {
      id: "loot_special_deck",
      name: "Limited Edition Cardistry Deck",
      category: "cardistry",
      requiredMilestoneId: "m_cardistry_full_routine",
      cost: 150,
      status: "LOCKED",
      notes: "Hand-cut, artisan finish",
    },
    {
      id: "loot_pokemon_grail",
      name: "Pokémon Grail Card (WotC)",
      category: "pokemon",
      requiredMilestoneId: "m_pokemon_monthly_budget",
      cost: null, // Free unlock, special achievement
      status: "LOCKED",
      notes: "TBD based on market finds",
    },
    {
      id: "loot_whitstaballs_launch",
      name: "Whitstaballs Launch Celebration",
      category: "whitstaballs",
      requiredMilestoneId: "m_whitstaballs_site_live",
      cost: null,
      status: "LOCKED",
      notes: "Something properly special — TBD",
    },
  ],
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Calculate heat based on days since last log
 * Returns: "hot" | "warm" | "cold" | "frozen"
 */
function calculateHeat(lastLoggedAt) {
  if (!lastLoggedAt) return "frozen";
  const daysSince = Math.floor(
    (Date.now() - new Date(lastLoggedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysSince <= HEAT_THRESHOLDS.hot) return "hot";
  if (daysSince <= HEAT_THRESHOLDS.warm) return "warm";
  if (daysSince <= HEAT_THRESHOLDS.cold) return "cold";
  return "frozen";
}

/**
 * Enrich a trajectory with derived heat and weekly stats
 */
function enrichTrajectory(traj) {
  const heat = calculateHeat(traj.lastLoggedAt);

  // Calculate weekly log count (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weeklyLogs = DB_STATE.logs.filter(
    (log) => log.trajectoryId === traj.id && log.timestamp >= weekAgo,
  );

  // Derive streak (consecutive weeks at or above target)
  const streakWeeks = calculateStreak(traj.id);

  return {
    ...traj,
    heat,
    weeklyLogCount: weeklyLogs.length,
    streakWeeks,
  };
}

/**
 * Calculate consecutive weeks at/above target for a trajectory
 * (derived from logs, not stored)
 */
function calculateStreak(trajectoryId) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj || traj.milestones.length === 0) return 0;

  let streak = 0;
  const now = new Date();

  for (let weekOffset = 0; weekOffset < 52; weekOffset++) {
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (now.getDay() + 7 * weekOffset),
    );
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const logsThisWeek = DB_STATE.logs.filter(
      (log) =>
        log.trajectoryId === trajectoryId &&
        log.timestamp >= weekStart.toISOString() &&
        log.timestamp < weekEnd.toISOString(),
    );

    if (logsThisWeek.length >= traj.weeklyTarget) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Simulate network lag (800ms roundtrip, like a Lambda)
 */
function simulateNetworkLag() {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

// ============================================================================
// API SERVICE
// ============================================================================

export const ApiService = {
  /**
   * GET: Fetch entire app state
   * Client calls once on mount, then manages local state updates
   * Returns enriched trajectories with heat + weekly stats
   */
  fetchAppData: async () => {
    await simulateNetworkLag();

    const enrichedTrajectories = Object.entries(DB_STATE.trajectories).reduce(
      (acc, [key, traj]) => {
        acc[key] = enrichTrajectory(traj);
        return acc;
      },
      {},
    );

    return {
      success: true,
      data: {
        profile: DB_STATE.profile,
        trajectories: enrichedTrajectories,
        logs: DB_STATE.logs,
        vault: DB_STATE.vault,
        lootStore: DB_STATE.lootStore,
      },
    };
  },

  /**
   * POST: Log an activity for a trajectory
   * Calculates XP, updates profile, updates lastLoggedAt
   * Returns updated app state
   */
  saveActivityLog: async (
    trajectoryId,
    resistance,
    note,
    durationHours = 0,
  ) => {
    await simulateNetworkLag();

    const traj = DB_STATE.trajectories[trajectoryId];
    if (!traj) {
      throw new Error(`Trajectory ${trajectoryId} not found`);
    }

    if (!RESISTANCE_MULTIPLIERS[resistance]) {
      throw new Error(
        `Invalid resistance: ${resistance}. Must be one of ${Object.keys(
          RESISTANCE_MULTIPLIERS,
        ).join(", ")}`,
      );
    }

    // Calculate XP awarded
    const baseXP = FRICTION_BASE_XP[traj.friction] || 10;
    const multiplier = RESISTANCE_MULTIPLIERS[resistance];
    const pointsAwarded = Math.floor(baseXP * multiplier);

    // Create log entry
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trajectoryId,
      timestamp: new Date().toISOString(),
      resistance,
      note,
      durationHours,
      pointsAwarded,
    };

    // Mutate DB state (mock backend)
    DB_STATE.logs.unshift(newLog);
    DB_STATE.profile.heroPoints += pointsAwarded;
    DB_STATE.profile.totalXP += pointsAwarded;

    // Update trajectory: XP, lastLoggedAt, check level-up
    traj.xp += pointsAwarded;
    traj.lastLoggedAt = new Date().toISOString();

    while (traj.xp >= LEVEL_UP_XP) {
      traj.level += 1;
      traj.xp -= LEVEL_UP_XP;

      // Distribute XP to profile attributes based on weights
      const totalWeight = Object.values(traj.attributeWeights).reduce(
        (a, b) => a + b,
        0,
      );
      Object.entries(traj.attributeWeights).forEach(([attr, weight]) => {
        const gain = Math.floor(
          (pointsAwarded / LEVEL_UP_XP) * (weight / totalWeight),
        );
        DB_STATE.profile.attributes[attr] =
          (DB_STATE.profile.attributes[attr] || 0) + gain;
      });
    }

    // Check milestones (simplified: for now, you'd unlock manually in the UI)
    // In a real app, milestones have completion criteria that logic here would evaluate

    return {
      success: true,
      updatedState: await this.fetchAppData(),
    };
  },

  /**
   * POST: Mark a milestone as cleared
   * This is where unlocking happens
   */
  clearMilestone: async (trajectoryId, milestoneId) => {
    await simulateNetworkLag();

    const traj = DB_STATE.trajectories[trajectoryId];
    if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

    const milestone = traj.milestones.find((m) => m.id === milestoneId);
    if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

    milestone.cleared = true;

    // Unlock associated loot items
    if (milestone.unlocksLootIds && milestone.unlocksLootIds.length > 0) {
      milestone.unlocksLootIds.forEach((lootId) => {
        const lootItem = DB_STATE.lootStore.find((l) => l.id === lootId);
        if (lootItem) {
          lootItem.status = "AVAILABLE";
        }
      });
    }

    return {
      success: true,
      updatedState: await this.fetchAppData(),
    };
  },

  /**
   * POST: Purchase/claim an item from the loot store
   * Requires hero points OR milestone unlock
   */
  purchaseLootItem: async (itemId) => {
    await simulateNetworkLag();

    const item = DB_STATE.lootStore.find((l) => l.id === itemId);
    if (!item) throw new Error(`Loot item ${itemId} not found`);

    if (item.status === "OWNED") {
      throw new Error("Item already owned");
    }

    if (item.status === "LOCKED") {
      throw new Error("Item is locked. Unlock the required milestone first.");
    }

    // Item is AVAILABLE: check cost
    if (item.cost && DB_STATE.profile.heroPoints < item.cost) {
      throw new Error(
        `Insufficient hero points. Need ${item.cost}, have ${DB_STATE.profile.heroPoints}`,
      );
    }

    // Deduct cost if applicable
    if (item.cost) {
      DB_STATE.profile.heroPoints -= item.cost;
    }

    item.status = "OWNED";

    return {
      success: true,
      updatedState: await this.fetchAppData(),
    };
  },

  /**
   * POST: Add/update vault entry
   */
  addVaultEntry: async (trajectoryId, text) => {
    await simulateNetworkLag();

    const newEntry = {
      id: `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trajectoryId,
      text,
    };

    DB_STATE.vault.push(newEntry);

    return {
      success: true,
      updatedState: await this.fetchAppData(),
    };
  },

  /**
   * DELETE: Remove vault entry
   */
  deleteVaultEntry: async (vaultId) => {
    await simulateNetworkLag();

    DB_STATE.vault = DB_STATE.vault.filter((v) => v.id !== vaultId);

    return {
      success: true,
      updatedState: await this.fetchAppData(),
    };
  },
};

// ============================================================================
// EXPORTS FOR REFERENCE (schema shape)
// ============================================================================

export const SCHEMA = {
  resistanceMultipliers: RESISTANCE_MULTIPLIERS,
  frictionBaseXP: FRICTION_BASE_XP,
  heatThresholds: HEAT_THRESHOLDS,
  levelUpXp: LEVEL_UP_XP,
};
