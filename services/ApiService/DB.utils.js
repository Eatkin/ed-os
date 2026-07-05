import { HEAT_THRESHOLDS } from "./DB.constants";

/**
 * Calculate heat based on days since last log
 * Returns: "hot" | "warm" | "cold" | "frozen"
 */
export function calculateHeat(lastLoggedAt) {
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
export function enrichTrajectory(traj) {
  const heat = calculateHeat(traj.lastLoggedAt);

  // Calculate weekly log count (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const weeklyLogs = DB_STATE.logs.filter(
    (log) => log.trajectoryId === traj.id && log.timestamp >= weekAgo,
  );

  return {
    ...traj,
    heat,
    weeklyLogCount: weeklyLogs.length,
  };
}

/**
 * Calculate consecutive weeks at/above target for a trajectory
 * (derived from logs, not stored)
 */
export function calculateStreak(trajectoryId) {
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
