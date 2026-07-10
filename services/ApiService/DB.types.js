import { formatOrdinalDate } from "../../utils/collections";
import { getActiveCommitmentsForTrajectory, getTrajectoryLogs, getWeeklyLogs } from "../../utils/trajectories";
import { getLevelProgress } from "../../utils/xp";
import { LEVEL_UP_XP } from "./DB.constants";
import { calculateHeat } from "./DB.utils";

export class HeroStats {
  constructor({
    cognition = 0,
    dexterity = 0,
    balance = 0,
    endurance = 0,
  } = {}) {
    this.cognition = cognition;
    this.dexterity = dexterity;
    this.balance = balance;
    this.endurance = endurance;
  }

  // Returns an array of objects to map over in your UI
  get list() {
    return [
      {
        key: "cognition",
        label: "COGNITION",
        emoji: "🧠",
        val: this.cognition,
      },
      {
        key: "dexterity",
        label: "DEXTERITY",
        emoji: "⚡",
        val: this.dexterity,
      },
      { key: "balance", label: "BALANCE", emoji: "⚖️", val: this.balance },
      {
        key: "endurance",
        label: "ENDURANCE",
        emoji: "🔋",
        val: this.endurance,
      },
    ];
  }

  get maxVal() {
    // Default to 1 if no attributes given
    return Math.max(
      this.cognition,
      this.dexterity,
      this.balance,
      this.endurance,
      1,
    );
  }
}

export class Profile {
  constructor({
    name = "Unknown",
    totalXP = 0,
    heroPoints = 0,
    attributes = {},
  } = {}) {
    this.name = name;
    this.totalXP = totalXP;
    this.heroPoints = heroPoints;
    // Instantiate the nested class so you always have access to methods on attributes
    this.attributes = new HeroStats(attributes);
  }

  get levelProgress() {
    return getLevelProgress(this.totalXP);
  }

  get level() {
    return this.levelProgress.level;
  }

  get xpProgress() {
    return this.levelProgress.xpProgress;
  }

  get xpToNextLevel() {
    return this.levelProgress.xpToNextLevel;
  }

  get currentLevelXP() {
    return this.levelProgress.currentXP;
  }
}

export class Milestone {
  constructor({ id, text, cleared = false, unlocksLootIds = [] } = {}) {
    this.id = id;
    this.text = text;
    this.cleared = cleared;
    this.unlocksLootIds = unlocksLootIds;
  }
}

export class Trajectory {
  constructor({
    id,
    name,
    description = "",
    friction = "medium",
    attributeWeights = {},
    level = 0,
    xp = 0,
    lastLoggedAt = null,
    weeklyTarget = 0,
    minimumUnit = "",
    milestones = [],
  } = {}) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.friction = friction;
    this.attributeWeights = attributeWeights; // { cognition: 1.0 }
    this.level = level;
    this.xp = xp;
    this.lastLoggedAt = lastLoggedAt ? new Date(lastLoggedAt) : null;
    this.weeklyTarget = weeklyTarget;
    this.minimumUnit = minimumUnit;

    // Ensure milestones are actual instances of the Milestone class
    this.milestones = milestones.map((m) => new Milestone(m));
  }

  // Handy helper: check if the trajectory is "hot" (logged recently)
  get temperature() {
    return calculateHeat(this.lastLoggedAt);
  }

  get xpProgress() {
    return Math.min((this.xp / LEVEL_UP_XP) * 100, 100);
  }

  toJSON() {
    return {
      ...this,
      lastLoggedAt: this.lastLoggedAt ? this.lastLoggedAt.toISOString() : null,
      milestones: this.milestones.map((m) => ({ ...m })),
    };
  }
}

export class EnrichedTrajectory extends Trajectory {
  constructor(trajData, logs = [], commitments = []) {
    super(trajData);
    this.weeklyLogs = getWeeklyLogs(this.id, logs);
    this.weeklyLogCount = this.weeklyLogs.length;
    this.activeCommitments = getActiveCommitmentsForTrajectory(this.id, commitments);
    this.recentLogs = getTrajectoryLogs(this.id, logs);
  }
}

export class Note {
  constructor({ id, trajectoryId = null, timestamp, note } = {}) {
    this.id = id;
    this.trajectoryId = trajectoryId;
    this.timestamp = timestamp;
    this.note = note;
  }
}

// Log class — add optional milestoneId
export class Log {
  constructor({
    id,
    trajectoryId,
    timestamp,
    resistance,
    note,
    pointsAwarded,
    milestoneId = null,
    bonusXP = 0,
  } = {}) {
    this.id = id;
    this.trajectoryId = trajectoryId;
    this.timestamp = new Date(timestamp);
    this.resistance = resistance;
    this.note = note;
    this.pointsAwarded = pointsAwarded;
    this.milestoneId = milestoneId;
    this.bonusXP = bonusXP;
  }

  get formattedTime() {
    return this.timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  get formattedDate() {
    return formatOrdinalDate(this.timestamp);
  }
}

export class VaultItem {
  constructor({ id, trajectoryId, text } = {}) {
    this.id = id;
    this.trajectoryId = trajectoryId;
    this.text = text;
  }
}

export class LootItem {
  constructor({
    id,
    name,
    category,
    requiredMilestoneId,
    cost,
    status = "LOCKED",
    notes,
    recurring = false,
    purchased = 0,
  } = {}) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.requiredMilestoneId = requiredMilestoneId;
    this.cost = cost;
    this.status = status;
    this.notes = notes;
    this.recurring = recurring;
    this.purchased = purchased;
  }

  // Helper to determine if the user CAN buy/unlock this
  isUnlockable(completedMilestoneIds = []) {
    if (this.status === "OWNED") return false;
    // Check if the required milestone is in the user's completed list
    return completedMilestoneIds.includes(this.requiredMilestoneId);
  }
}

export class Commitment {
  constructor({
    id,
    trajectoryId,
    notes,
    status = "PENDING", // PENDING | FULFILLED | MISSED
    createdAt = new Date().toISOString(),
    expiresAt,
    bonusXP = 0,
  } = {}) {
    this.id = id;
    this.trajectoryId = trajectoryId;
    this.notes = notes;
    this.status = status;
    this.createdAt = new Date(createdAt);
    this.expiresAt = new Date(expiresAt);
    this.bonusXP = bonusXP;
  }

  get isExpired() {
    return this.status === "PENDING" && new Date() > this.expiresAt;
  }
}

// models/Database.js
export class Database {
  constructor(data) {
    this.profile = new Profile(data.profile);
    this.logs = data.logs.map((l) => new Log(l));
    this.vault = data.vault.map((v) => new VaultItem(v));
    this.lootStore = data.lootStore.map((l) => new LootItem(l));
    this.commitments = data.commitments.map((c) => new Commitment(c));

    // The Database constructor now handles the enrichment
    this.trajectories = Object.entries(data.trajectories).reduce(
      (acc, [key, val]) => {
        acc[key] = new EnrichedTrajectory(val, this.logs);
        return acc;
      },
      {},
    );
  }
}
