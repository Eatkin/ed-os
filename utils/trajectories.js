export const getHeatColour = (heat) => {
  const colours = {
    hot: "#FF4500", // Orange-Red
    warm: "#FFD700", // Gold
    cold: "#1E90FF", // Dodger Blue
    frozen: "#808080", // Gray
  };

  return colours[heat.toLowerCase()] || "#FFFFFF"; // Fallback to white
};

// Logs for one trajectory within the last 7 days (rolling window, not calendar week)
export function getWeeklyLogs(trajectoryId, logs) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return logs.filter(
    (log) =>
      log.trajectoryId === trajectoryId && new Date(log.timestamp) >= weekAgo,
  );
}

export function getWeeklyLogCount(trajectoryId, logs) {
  return getWeeklyLogs(trajectoryId, logs).length;
}

export function getActiveCommitmentsForTrajectory(trajectoryId, commitments) {
  const now = new Date();
  return commitments.filter(
    (c) =>
      c.trajectoryId === trajectoryId &&
      c.status === "PENDING" &&
      new Date(c.expiresAt) > now,
  );
}

export function getTrajectoryLogs(trajectoryId, logs, limit = 10) {
  return logs
    .filter((l) => l.trajectoryId === trajectoryId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

export function getTrajectoryLogCount(trajectoryId, logs) {
  return logs
    .filter((l) => l.trajectoryId === trajectoryId).length;
}

export function getTrajectoryNotes(trajectoryId, notes, limit = 10) {
  return notes
    .filter((n) => n?.trajectoryId === trajectoryId)
    .sort((a, b) => {
      const aArchived = a.archived ? 1 : 0;
      const bArchived = b.archived ? 1 : 0;

      if (aArchived !== bArchived) {
        return aArchived - bArchived;
      }

      const dateA = new Date(a.timestamp).getTime() || 0;
      const dateB = new Date(b.timestamp).getTime() || 0;

      return dateB - dateA;
    })
    .slice(0, limit);
}

export function getArchiveStats(trajectoryId, logs) {
  const trajLogs = logs.filter((l) => l.trajectoryId === trajectoryId);
  if (trajLogs.length === 0) return null;

  const sorted = [...trajLogs].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
  );

  const totalXP = trajLogs.reduce((sum, l) => sum + l.pointsAwarded + (l.bonusXP || 0), 0);

  return {
    totalXP,
    totalLogs: trajLogs.length,
    startDate: sorted[0].timestamp,
    endDate: sorted[sorted.length - 1].timestamp,
  };
}

export function getAllMilestones(trajectories) {
  return Object.values(trajectories).flatMap((traj) =>
    traj.milestones.map((m) => ({ ...m, trajectoryId: traj.id, trajectoryName: traj.name })),
  );
}
