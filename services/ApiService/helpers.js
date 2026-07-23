import { getWeeklyLogCount } from "../../utils/trajectories";
import {
  FRICTION_BASE_XP,
  RESISTANCE_MULTIPLIERS,
  LEVEL_UP_XP,
  DB_STATE,
  WEEKLY_TARGET_BONUS_XP,
  ATTRIBUTE_XP_RATE,
  XP_DECAY,
} from "./DB.constants";

function getTrajectoryXPReductionFactor(trajectoryId) {
  // Calculate the count of logs already created today for this trajectory
  const today = new Date().toISOString().split('T')[0];
  const todayLogCount = DB_STATE.logs.filter(log => 
    log.trajectoryId === trajectoryId && 
    log.timestamp.startsWith(today)
  ).length;

  // Apply your decay logic directly
  const reduction = Math.pow(XP_DECAY, todayLogCount);
  return reduction;
};


// Creates a log entry, applies XP to profile + trajectory, and handles
// any resulting level-ups (including attribute distribution).
// Returns the created log, mainly so callers can reference pointsAwarded etc if needed.
export function createLogAndApplyXP({
  trajectoryId,
  resistance,
  note,
  durationHours = 0,
  milestoneId = null,
  commitmentId = null,
}) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  if (!RESISTANCE_MULTIPLIERS[resistance]) {
    throw new Error(
      `Invalid resistance: ${resistance}. Must be one of ${Object.keys(
        RESISTANCE_MULTIPLIERS,
      ).join(", ")}`,
    );
  }

  // Reduction factor for logging multiple times a day
  const reduction = getTrajectoryXPReductionFactor(trajectoryId);
  const baseXP = FRICTION_BASE_XP[traj.friction] || 10;
  const multiplier = RESISTANCE_MULTIPLIERS[resistance] * reduction;
  // Always at least 1 xp
  const pointsAwarded = Math.max(Math.floor(baseXP * multiplier), 1);


  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    trajectoryId,
    timestamp: new Date().toISOString(),
    resistance,
    note,
    durationHours,
    pointsAwarded,
    milestoneId,
    bonusXP: 0, // filled in below if this log hits the weekly target
  };

  DB_STATE.logs.unshift(newLog);

  // Weekly target bonus: only fires the log that brings count to EXACTLY target,
  // so it's a one-time nudge per week, not a repeating bonus for every log after.
  // weekly target bonus (sets newLog.bonusXP)
  let weeklyBonus = 0;
  if (traj.weeklyTarget > 0) {
    const weeklyCount = getWeeklyLogCount(trajectoryId, DB_STATE.logs);
    if (weeklyCount === traj.weeklyTarget) {
      weeklyBonus = WEEKLY_TARGET_BONUS_XP;
    }
  }
  newLog.bonusXP = weeklyBonus;

  // commitment bonus (adds onto newLog.bonusXP)
  const fulfilledCommitment = tryFulfillCommitment(commitmentId);
  const commitmentBonus = fulfilledCommitment?.bonusXP ?? 0;
  newLog.commitmentId = fulfilledCommitment?.id ?? null;
  newLog.bonusXP += commitmentBonus;

  const totalGain = pointsAwarded + newLog.bonusXP;

  DB_STATE.profile.heroPoints += totalGain;
  DB_STATE.profile.totalXP += totalGain;

  traj.xp += totalGain;
  traj.lastLoggedAt = new Date().toISOString();

  // Attribute xp
  const totalWeight = Object.values(traj.attributeWeights).reduce(
    (a, b) => a + b,
    0,
  );

  if (totalWeight > 0) {
    Object.entries(traj.attributeWeights).forEach(([attrId, weight]) => {
      const gain = Math.floor(
        totalGain * (weight / totalWeight) * ATTRIBUTE_XP_RATE * reduction,
      );
      if (gain > 0) {
        const existing = DB_STATE.profile.attributes.find(
          (a) => a.id === attrId,
        );
        if (existing) {
          existing.val += gain;
        } else {
          // attributeWeights referenced an attribute that doesn't exist in the
          // profile's seed list yet — create it on the fly so nothing silently drops
          DB_STATE.profile.attributes.push({
            id: attrId,
            label: attrId.toUpperCase(),
            emoji: "❔",
            val: gain,
          });
        }
      }
    });
  }

  // Level-up loop
  // Trajectories have flat level up i.e. no level scaling
  while (traj.xp >= LEVEL_UP_XP) {
    traj.level += 1;
    traj.xp -= LEVEL_UP_XP;
  }

  return newLog;
}

// Marks a milestone cleared and flips any linked loot from LOCKED to AVAILABLE.
export function clearMilestoneAndUnlockLoot(trajectoryId, milestoneId) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  const milestone = traj.milestones.find((m) => m.id === milestoneId);
  if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

  milestone.cleared = true;

  if (milestone.unlocksLootIds?.length > 0) {
    milestone.unlocksLootIds.forEach((lootId) => {
      const lootItem = DB_STATE.lootStore.find((l) => l.id === lootId);
      if (lootItem) lootItem.status = "AVAILABLE";
    });
  }

  return milestone;
}

export function createCommitment(trajectoryId, notes, expiresAt, bonusXP = 0) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  const commitment = {
    id: `commit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    trajectoryId,
    notes,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    expiresAt,
    bonusXP,
  };

  DB_STATE.commitments.unshift(commitment);
  return commitment;
}

// Sweeps all PENDING commitments and flips any past their expiry to MISSED.
// Call this at the start of any read/write that touches commitments,
// so state is always accurate without needing a background timer.
export function sweepExpiredCommitments() {
  const now = new Date();
  DB_STATE.commitments.forEach((c) => {
    if (c.status === "PENDING" && new Date(c.expiresAt) < now) {
      c.status = "MISSED";
    }
  });
}

// Called from inside createLogAndApplyXP after a log is saved —
// checks for a live pending commitment on this trajectory and fulfills it.
export function tryFulfillCommitment(commitmentId) {
  sweepExpiredCommitments();
  const commitment = DB_STATE.commitments.find(
    (c) => c.id === commitmentId && c.status === "PENDING",
  );
  if (!commitment) return null;

  commitment.status = "FULFILLED";
  return commitment;
}

export function markCommitmentMissed(commitmentId) {
  const commitment = DB_STATE.commitments.find((c) => c.id === commitmentId);
  if (!commitment) throw new Error(`Commitment ${commitmentId} not found`);
  commitment.status = "MISSED";
  return commitment;
}

// Patches a commitment's requirement text only, and only while still
// PENDING — expiresAt/bonusXP come from create-time-only preset pickers
// (reluctance/expiryPreset) with no meaningful raw edit form, and editing a
// MISSED/FULFILLED commitment is already history at that point.
export function updateCommitment(commitmentId, patch = {}) {
  sweepExpiredCommitments();

  const commitment = DB_STATE.commitments.find((c) => c.id === commitmentId);
  if (!commitment) throw new Error(`Commitment ${commitmentId} not found`);
  if (commitment.status !== "PENDING") {
    throw new Error(
      `Commitment ${commitmentId} is ${commitment.status}, not PENDING`,
    );
  }

  if (patch.notes !== undefined) commitment.notes = patch.notes;

  return commitment;
}

export function createTrajectory({
  name,
  description = "",
  friction = "medium",
  weeklyTarget = 0,
  minimumUnit = "",
  attributeWeights = {},
}) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  if (DB_STATE.trajectories[id]) {
    throw new Error(`A trajectory with id "${id}" already exists`);
  }

  DB_STATE.trajectories[id] = {
    id,
    name,
    description,
    friction,
    attributeWeights,
    level: 0,
    xp: 0,
    lastLoggedAt: null,
    weeklyTarget,
    minimumUnit,
    archived: false,
    archivedAt: null,
    milestones: [],
  };

  return DB_STATE.trajectories[id];
}

export function archiveTrajectory(trajectoryId, archived = true) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);
  traj.archived = archived;
  traj.archivedAt = archived ? new Date().toISOString() : null;
  return traj;
}

// Patches editable trajectory fields. `id` is deliberately never touched
// here, even if `name` changes — it's the DB_STATE.trajectories object key
// and the FK stored on every note/log/commitment, so regenerating it would
// require cascading rewrites across the whole DB with no rollback.
export function updateTrajectory(trajectoryId, patch = {}) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  if (patch.name !== undefined) traj.name = patch.name;
  if (patch.description !== undefined) traj.description = patch.description;
  if (patch.friction !== undefined) traj.friction = patch.friction;
  if (patch.weeklyTarget !== undefined) traj.weeklyTarget = patch.weeklyTarget;
  if (patch.minimumUnit !== undefined) traj.minimumUnit = patch.minimumUnit;
  if (patch.attributeWeights !== undefined)
    traj.attributeWeights = patch.attributeWeights;

  return traj;
}

export function createNote(trajectoryId, note) {
  const newNote = {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    trajectoryId: trajectoryId ?? null,
    timestamp: new Date().toISOString(),
    note,
  };
  DB_STATE.notes.unshift(newNote);
  return newNote;
}

export function archiveNote(noteId, archived = true) {
  const note = DB_STATE.notes.find((n) => n.id === noteId);
  if (!note) throw new Error(`Note ${noteId} not found`);
  note.archived = archived;
  return note;
}

export function updateNote(noteId, patch = {}) {
  const note = DB_STATE.notes.find((n) => n.id === noteId);
  if (!note) throw new Error(`Note ${noteId} not found`);

  if (patch.note !== undefined) note.note = patch.note;
  if (patch.trajectoryId !== undefined) note.trajectoryId = patch.trajectoryId;

  return note;
}

export function createMilestone(trajectoryId, text) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  const milestone = {
    id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    text,
    cleared: false,
    unlocksLootIds: [],
  };

  traj.milestones.push(milestone);
  return milestone;
}

// Patches a milestone's text only — `cleared`/`unlocksLootIds` are owned by
// clearMilestoneAndUnlockLoot and shouldn't be touched by a generic edit.
export function updateMilestone(trajectoryId, milestoneId, patch = {}) {
  const traj = DB_STATE.trajectories[trajectoryId];
  if (!traj) throw new Error(`Trajectory ${trajectoryId} not found`);

  const milestone = traj.milestones.find((m) => m.id === milestoneId);
  if (!milestone) throw new Error(`Milestone ${milestoneId} not found`);

  if (patch.text !== undefined) milestone.text = patch.text;

  return milestone;
}

// Patches a log entry's note only. resistance/durationHours already fed a
// one-time XP calculation applied to profile/trajectory state at creation
// time (see createLogAndApplyXP) — there's no reversal/recompute mechanism,
// so those fields are intentionally not editable here.
export function updateLog(logId, patch = {}) {
  const log = DB_STATE.logs.find((l) => l.id === logId);
  if (!log) throw new Error(`Log ${logId} not found`);

  if (patch.note !== undefined) log.note = patch.note;

  return log;
}

export function createLootItem({
  name,
  category,
  cost,
  requiredMilestoneId,
  notes,
  recurring = false,
}) {
  const lootItem = {
    id: `loot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    category,
    cost,
    requiredMilestoneId,
    status: requiredMilestoneId ? "LOCKED" : "AVAILABLE", // no milestone = free/available immediately
    notes,
    recurring,
  };

  DB_STATE.lootStore.push(lootItem);

  // If it's tied to a milestone, register it on that milestone's unlocksLootIds
  // so clearMilestoneAndUnlockLoot picks it up correctly later
  if (requiredMilestoneId) {
    for (const traj of Object.values(DB_STATE.trajectories)) {
      const m = traj.milestones.find((m) => m.id === requiredMilestoneId);
      if (m) {
        m.unlocksLootIds.push(lootItem.id);
        break;
      }
    }
  }

  return lootItem;
}

// Patches loot item fields. If requiredMilestoneId changes, unregisters the
// item from its old milestone's unlocksLootIds and registers it on the new
// one (mirroring createLootItem's registration logic), then recomputes
// .status from the new requirement — UNLESS the item is already OWNED,
// which must never be clobbered back to LOCKED/AVAILABLE by an edit.
export function updateLootItem(lootItemId, patch = {}) {
  const item = DB_STATE.lootStore.find((l) => l.id === lootItemId);
  if (!item) throw new Error(`Loot item ${lootItemId} not found`);

  if (patch.name !== undefined) item.name = patch.name;
  if (patch.category !== undefined) item.category = patch.category;
  if (patch.cost !== undefined) item.cost = patch.cost;
  if (patch.notes !== undefined) item.notes = patch.notes;
  if (patch.recurring !== undefined) item.recurring = patch.recurring;

  if (
    patch.requiredMilestoneId !== undefined &&
    patch.requiredMilestoneId !== item.requiredMilestoneId
  ) {
    const trajList = Object.values(DB_STATE.trajectories);

    if (item.requiredMilestoneId) {
      for (const traj of trajList) {
        const oldMilestone = traj.milestones.find(
          (m) => m.id === item.requiredMilestoneId,
        );
        if (oldMilestone) {
          oldMilestone.unlocksLootIds = oldMilestone.unlocksLootIds.filter(
            (id) => id !== item.id,
          );
          break;
        }
      }
    }

    let newMilestone = null;
    if (patch.requiredMilestoneId) {
      for (const traj of trajList) {
        const m = traj.milestones.find(
          (m) => m.id === patch.requiredMilestoneId,
        );
        if (m) {
          newMilestone = m;
          m.unlocksLootIds.push(item.id);
          break;
        }
      }
    }

    item.requiredMilestoneId = patch.requiredMilestoneId;

    if (item.status !== "OWNED") {
      item.status = !patch.requiredMilestoneId
        ? "AVAILABLE"
        : newMilestone?.cleared
          ? "AVAILABLE"
          : "LOCKED";
    }
  }

  return item;
}

export function logLootRedemption(lootItemId, costPaid) {
  const entry = {
    id: `lootlog_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    lootItemId,
    timestamp: new Date().toISOString(),
    costPaid,
  };

  DB_STATE.lootLog.unshift(entry);
  return entry;
}

