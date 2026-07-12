import { formatOrdinalDate } from "../../utils/collections";
import {
  getActiveCommitmentsForTrajectory,
  getTrajectoryLogs,
  getWeeklyLogs,
} from "../../utils/trajectories";
import { getLevelProgress } from "../../utils/xp";
import { LEVEL_UP_XP } from "./DB.constants";
import { calculateHeat } from "./DB.utils";

export class Attribute {
  constructor({ id, label, emoji, val } = {}) {
    this.id = id;
    this.label = label;
    this.emoji = emoji;
    this.val = val;
  }
  get progress() {
    return getLevelProgress(this.val, true); // { level, currentXP, xpToNextLevel, xpProgress }
  }
}

export class HeroStats {
  constructor(attributes = []) {
    this.list = attributes.map((a) => new Attribute(a));
  }
  get maxVal() {
    return this.list.length ? Math.max(...this.list.map((a) => a.val)) : 0;
  }
}

export class Profile {
  constructor({
    name = "Unknown",
    totalXP = 0,
    heroPoints = 0,
    attributes = [],
  } = {}) {
    this.name = name;
    this.totalXP = totalXP;
    this.heroPoints = heroPoints;
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
    archived = false,
    archivedAt = null,
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
    this.archived = archived;
    this.archivedAt = archivedAt;

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
    this.activeCommitments = getActiveCommitmentsForTrajectory(
      this.id,
      commitments,
    );
    this.recentLogs = getTrajectoryLogs(this.id, logs);
  }
}

export class Note {
  constructor({ id, trajectoryId = null, timestamp, note } = {}) {
    this.id = id;
    this.trajectoryId = trajectoryId;
    this.timestamp = new Date(timestamp);
    this.note = note;
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
    this.notes = data.notes.map((n) => new Note(n));

    // Enrich trajectories at source
    this.trajectories = Object.entries(data.trajectories).reduce(
      (acc, [key, val]) => {
        acc[key] = new EnrichedTrajectory(val, this.logs, this.commitments);
        return acc;
      },
      {},
    );
  }
}
