import { Database } from "./DB.types";

const getTomorrowEndOfDay = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

export const RESISTANCE_MULTIPLIERS = {
  Flow: 1.0,
  Neutral: 1.1,
  Resistant: 1.3,
  "Soul-Crushing": 1.5,
};

export const FRICTION_BASE_XP = {
  low: 10,
  medium: 25,
  high: 40,
};

// Heat calculation: how many days since last log before we say "cold"?
export const HEAT_THRESHOLDS = {
  hot: 2, // logged in last 2 days
  warm: 7, // logged in last week
  cold: 30, // older than a week
  frozen: 999, // never logged or absurdly old
};

export const LEVEL_UP_XP = 500; // XP needed to level (can scale per level later)
export const WEEKLY_TARGET_BONUS_XP = 50; // flat bonus for hitting weekly target

let MOCK_DATA = {
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
  // TODO: Add trajectories for banjo, pen spinning, guitar
  trajectories: {
    cubing_3x3: {
      id: "cubing_3x3",
      name: "3x3 Cubing",
      description: "Standard speedcubing progression",
      friction: "low", // low | medium | high
      attributeWeights: { cognition: 1.0 }, // how XP distributes to attributes
      level: 0,
      xp: 0,
      lastLoggedAt: "2026-07-03T18:00:00Z", // ISO string or null; used for heat calc
      weeklyTarget: 3,
      minimumUnit: "One untimed slow solve",
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

    juggling: {
      id: "juggling",
      name: "Juggling and circus arts",
      description: "Working towards clean cascades and tricks",
      friction: "medium",
      attributeWeights: { dexterity: 0.7, cognition: 0.3 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      minimumUnit: "Five ball flash",
      milestones: [
        {
          id: "m_juggling_50clean",
          text: "50 consecutive clean catches in 5 ball cascade",
          cleared: false,
          unlocksLootIds: ["loot_juggling_balls"],
        },
        {
          id: "m_juggling_20h",
          text: "20 hours logged on circus planner",
          cleared: false,
          unlocksLootIds: ["loot_cork_mat"],
        },
        {
          id: "m_juggling_cigar_box_routine",
          text: "1 minute cigar box routine without dropping",
          cleared: false,
          unlocksLootIds: ["spinning_plates"],
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
      minimumUnit: "Go to park, put skates on.",
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
      minimumUnit: "Take unicycle out, free mount, go as far as you want.",
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
      minimumUnit: "One card pirouette",
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

  commitments: [
    {
      id: "commit_seed_1",
      trajectoryId: "unicycling",
      notes: "Take unicycle out, free mount, go as far as you want.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      expiresAt: getTomorrowEndOfDay(),
      bonusXP: 25,
    },
    {
      id: "commit_seed_2",
      trajectoryId: "cubing_3x3",
      notes: "Just do 5 solves, doesn't matter how slow.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      expiresAt: getTomorrowEndOfDay(),
      bonusXP: 20,
    },
    {
      id: "commit_seed_3",
      trajectoryId: "juggling",
      notes: "Pick up the balls, attempt one clean 5-throw flash.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      expiresAt: getTomorrowEndOfDay(),
      bonusXP: 20,
    },
  ],

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
    {
      id: "loot_boardgame_sky_team",
      name: "Sky Team Boardgame",
      category: "boardgames",
      requiredMilestoneId: "m_board_games",
      cost: 1000,
      status: "LOCKED",
      notes: "TBD based on board game availability",
    },
    {
      id: "loot_boardgame_unmatched_adventures",
      name: "Unmatched Adventures Tales to Amaze Boardgame",
      category: "boardgames",
      requiredMilestoneId: "m_board_games",
      cost: 1000,
      status: "LOCKED",
      notes: "TBD based on board game availability",
    },
    {
      id: "loot_spinning_plates",
      name: "A set of three spinning plates with sticks",
      category: "circus",
      required_milestone_id: "m_juggling_cigar_box_routine",
      cost: 1000,
      status: "LOCKED",
      notes: "What up",
    },
  ]
};

export const DB_STATE = new Database(MOCK_DATA);
