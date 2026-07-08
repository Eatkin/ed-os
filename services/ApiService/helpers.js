import { getWeeklyLogCount } from "../../utils/trajectories";
import {
  FRICTION_BASE_XP,
  RESISTANCE_MULTIPLIERS,
  LEVEL_UP_XP,
  DB_STATE,
  WEEKLY_TARGET_BONUS_XP,
} from "./DB.constants";

// Creates a log entry, applies XP to profile + trajectory, and handles
// any resulting level-ups (including attribute distribution).
// Returns the created log, mainly so callers can reference pointsAwarded etc if needed.
export function createLogAndApplyXP({
  trajectoryId,
  resistance,
  note,
  durationHours = 0,
  milestoneId = null,
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

  const baseXP = FRICTION_BASE_XP[traj.friction] || 10;
  const multiplier = RESISTANCE_MULTIPLIERS[resistance];
  const pointsAwarded = Math.floor(baseXP * multiplier);

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
  let bonusXP = 0;
  if (traj.weeklyTarget > 0) {
    const weeklyCount = getWeeklyLogCount(trajectoryId, DB_STATE.logs);
    if (weeklyCount === traj.weeklyTarget) {
      bonusXP = WEEKLY_TARGET_BONUS_XP;
      newLog.bonusXP = bonusXP;
    }
  }

  const totalGain = pointsAwarded + bonusXP;

  DB_STATE.profile.heroPoints += totalGain;
  DB_STATE.profile.totalXP += totalGain;

  traj.xp += totalGain;
  traj.lastLoggedAt = new Date().toISOString();

  while (traj.xp >= LEVEL_UP_XP) {
    traj.level += 1;
    traj.xp -= LEVEL_UP_XP;

    const totalWeight = Object.values(traj.attributeWeights).reduce(
      (a, b) => a + b,
      0,
    );
    Object.entries(traj.attributeWeights).forEach(([attr, weight]) => {
      const gain = Math.floor(
        (totalGain / LEVEL_UP_XP) * (weight / totalWeight),
      );
      DB_STATE.profile.attributes[attr] =
        (DB_STATE.profile.attributes[attr] || 0) + gain;
    });
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
