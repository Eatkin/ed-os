export const WEEKLY_TARGET_BONUS_XP = 50; // flat bonus for hitting weekly target
export const ATTRIBUTE_XP_RATE = 0.1; // How many XP points go to attributes
export const ATTRIBUTE_LEVEL_UP_THRESHOLD = 100; // How many XP points required to level up an attribute
export const BASE_LEVEL_XP = 500; // XP needed for level 1
export const XP_STEP = 100; // extra XP required per level thereafter

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

export const COMMITMENT_RELUCTANCE_BONUS = {
  "Meh, I'll manage": 10,
  "Kind of dreading it": 20,
  "Really don't want to": 35,
  "Everything in me says no": 50,
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

const ATTRIBUTES = [
  { id: "cognition", label: "COGNITION", emoji: "🧠", val: 0 },
  { id: "dexterity", label: "DEXTERITY", emoji: "⚡", val: 0 },
  { id: "balance", label: "BALANCE", emoji: "⚖️", val: 0 },
  { id: "endurance", label: "ENDURANCE", emoji: "🔋", val: 0 },
];

let MOCK_DATA = {
  // User profile: global level, hero points, base attributes
  profile: {
    name: "Ed",
    level: 1,
    totalXP: 0, // cumulative, never resets
    heroPoints: 0, // currency for loot store
    attributes: ATTRIBUTES,
  },

  // Trajectories: skill/habit tracks with milestones
  // Each trajectory has its own level, XP, milestones, and heat
  trajectories: {
    cubing_3x3: {
      id: "cubing_3x3",
      name: "3x3 Cubing",
      description: "Standard speedcubing progression",
      friction: "low",
      attributeWeights: { cognition: 1.0 },
      level: 1,
      xp: 0,
      lastLoggedAt: "2026-07-03T18:00:00Z",
      weeklyTarget: 3,
      minimumUnit: "One untimed slow solve",
      milestones: [
        {
          id: "m_cubing_sub35_ao100",
          text: "Sub-35s ao100",
          cleared: false,
          unlocksLootIds: ["loot_rubiks_clock"],
        },
        {
          id: "m_cubing_4x4_sub2min",
          text: "Sub-2-minute 4x4 solve",
          cleared: false,
          unlocksLootIds: ["loot_qiyi_smart_timer"],
        },
      ],
    },

    juggling: {
      id: "juggling",
      name: "Juggling and circus arts",
      description: "Working towards clean cascades and tricks",
      friction: "medium",
      attributeWeights: { dexterity: 0.7, cognition: 0.3 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      minimumUnit: "Five ball flash",
      milestones: [
        {
          id: "m_juggling_40clean",
          text: "40 consecutive clean catches in 5 ball cascade",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_juggling_53_half_shower",
          text: "Qualify 5-3 half shower",
          cleared: false,
          unlocksLootIds: ["loot_contact_ball"],
        },
        {
          id: "m_juggling_cigar_box_routine",
          text: "1 minute cigar box routine without dropping",
          cleared: false,
          unlocksLootIds: ["loot_spinning_plates"],
        },
      ],
    },

    cardistry: {
      id: "cardistry",
      name: "Cardistry",
      description: "Card manipulation and flourishes",
      friction: "low",
      attributeWeights: { dexterity: 0.8, cognition: 0.2 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      minimumUnit: "One card pirouette",
      milestones: [],
    },

    pen_spinning: {
      id: "pen_spinning",
      name: "Pen Spinning",
      description: "Linkages and trick progression",
      friction: "low",
      attributeWeights: { dexterity: 1.0 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      minimumUnit: "Ten charge attempts",
      milestones: [],
    },

    banjo: {
      id: "banjo",
      name: "Banjo",
      description: "Picking practice",
      friction: "medium",
      attributeWeights: { dexterity: 0.6, cognition: 0.4 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      minimumUnit: "Five minutes of picking",
      milestones: [],
    },

    guitar: {
      id: "guitar",
      name: "Guitar",
      description: "General practice",
      friction: "medium",
      attributeWeights: { dexterity: 0.6, cognition: 0.4 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      minimumUnit: "Five minutes of playing",
      milestones: [],
    },

    drums: {
      id: "drums",
      name: "Drums",
      description: "General practice",
      friction: "medium",
      attributeWeights: { dexterity: 0.5, endurance: 0.5 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      minimumUnit: "Five minutes on the pad",
      milestones: [],
    },

    board_game: {
      id: "board_game",
      name: "Make a Board Game (Moondrop Hill)",
      description: "Design and build an original cooperative board game",
      friction: "high",
      attributeWeights: { cognition: 1.0 },
      level: 1,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      minimumUnit: "Ten minutes on the GDD",
      milestones: [
        {
          id: "m_boardgame_planning_doc",
          text: "Planning document complete",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_boardgame_prototype",
          text: "Playable prototype built",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_boardgame_test_play",
          text: "First full test play",
          cleared: false,
          unlocksLootIds: [
            "loot_boardgame_sky_team",
            "loot_boardgame_lost_cities",
          ],
        },
      ],
    },

    novella: {
      id: "novella",
      name: "Write My Novella (Authorised Clowns Only)",
      description: "Surreal British comic novella, third draft",
      friction: "low",
      attributeWeights: { cognition: 1.0 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      minimumUnit: "One paragraph written",
      milestones: [
        {
          id: "m_novella_20k_words",
          text: "20,000 words",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_novella_third_draft_complete",
          text: "Complete third draft",
          cleared: false,
          unlocksLootIds: [],
        },
      ],
    },

    whitstaballs: {
      id: "whitstaballs",
      name: "Whitstaballs",
      description: "Site launch and community building",
      friction: "high",
      attributeWeights: { cognition: 0.8, dexterity: 0.2 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 1,
      milestones: [
        {
          id: "m_whitstaballs_pattern_final",
          text: "Finalise juggling ball pattern",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_whitstaballs_first_set_faux_leather",
          text: "Make first set of faux-leather juggling balls",
          cleared: false,
          unlocksLootIds: ["loot_whitstaballs_launch"],
        },
      ],
    },

    rollerblading: {
      id: "rollerblading",
      name: "Rollerblading",
      description: "Freestyle progression and conditioning",
      friction: "high",
      attributeWeights: { balance: 0.6, endurance: 0.4 },
      level: 0,
      xp: 0,
      lastLoggedAt: null,
      weeklyTarget: 2,
      minimumUnit: "Go to park, put skates on.",
      milestones: [
        {
          id: "m_rollerblading_zigzag",
          text: "Zig-zag mastery",
          cleared: false,
          unlocksLootIds: [],
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
          text: "Unassisted 30 second idle",
          cleared: false,
          unlocksLootIds: [],
        },
        {
          id: "m_unicycle_100_catches_3ball",
          text: "100 catches in 3 ball cascade while riding",
          cleared: false,
          unlocksLootIds: [],
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
    },
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
      id: "loot_qiyi_smart_timer",
      name: "QiYi Smart Bluetooth Timer",
      category: "cubing",
      requiredMilestoneId: "m_cubing_4x4_sub2min",
      cost: 1500,
      status: "LOCKED",
      notes: "For bleak integration / solve logging",
    },
    {
      id: "loot_rubiks_clock",
      name: "Rubik's Clock",
      category: "cubing",
      requiredMilestoneId: null,
      cost: 2300,
      status: "AVAILABLE",
      notes: "Just because",
    },
    {
      id: "loot_contact_ball",
      name: "Contact Juggling Ball",
      category: "juggling",
      requiredMilestoneId: "m_juggling_53_half_shower",
      cost: 2000,
      status: "LOCKED",
      notes: "Isolation/contact practice",
    },
    {
      id: "loot_spinning_plates",
      name: "Set of Three Spinning Plates with Sticks",
      category: "circus",
      requiredMilestoneId: "m_juggling_cigar_box_routine",
      cost: 1500,
      status: "LOCKED",
      notes: "",
    },
    {
      id: "loot_cork_mat",
      name: "Cork Mat (Rola Bola)",
      category: "circus",
      requiredMilestoneId: null,
      cost: 2000,
      status: "AVAILABLE",
      notes: "For rola bola practice",
    },
    {
      id: "loot_spinning_staff",
      name: "Contact Staff",
      category: "circus",
      requiredMilestoneId: null,
      cost: 6000,
      status: "AVAILABLE",
      notes: "TBD which length/weight",
    },
    {
      id: "loot_boardgame_sky_team",
      name: "Sky Team Boardgame",
      category: "boardgames",
      requiredMilestoneId: "m_boardgame_test_play",
      cost: 3000,
      status: "LOCKED",
      notes: "TBD based on availability",
    },
    {
      id: "loot_boardgame_lost_cities",
      name: "Lost Cities Boardgame",
      category: "boardgames",
      requiredMilestoneId: "m_boardgame_test_play",
      cost: 2000,
      status: "LOCKED",
      notes: "TBD based on availability",
    },
    {
      id: "loot_mickey_cards",
      name: "Mickey Mouse Bicycle Playing Cards",
      category: "cardistry",
      requiredMilestoneId: null,
      cost: 800,
      status: "AVAILABLE",
      notes: "Pair with Minnie deck",
    },
    {
      id: "loot_minnie_cards",
      name: "Minnie Mouse Bicycle Playing Cards",
      category: "cardistry",
      requiredMilestoneId: null,
      cost: 800,
      status: "AVAILABLE",
      notes: "Pair with Mickey deck",
    },
    {
      id: "loot_whitstaballs_launch",
      name: "Whitstaballs Launch Celebration",
      category: "whitstaballs",
      requiredMilestoneId: "m_whitstaballs_first_set_faux_leather",
      cost: null,
      status: "LOCKED",
      notes: "Something properly special — TBD",
    },
    {
      id: "loot_bavaria_24pack",
      name: "Bavaria Non-Alcoholic Beer (24 pack)",
      category: "recurring",
      requiredMilestoneId: null,
      cost: 2400,
      status: "AVAILABLE",
      recurring: true,
      notes: "Restock reward",
    },
    {
      id: "loot_candy_kittens",
      name: "Candy Kittens",
      category: "recurring",
      requiredMilestoneId: null,
      cost: 300,
      status: "AVAILABLE",
      recurring: true,
      notes: "Sweet treat reward",
    },
  ],
};

export const DB_STATE = MOCK_DATA;
