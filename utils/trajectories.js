export const getHeatColour = (heat) => {
  const colours = {
    hot: '#FF4500',      // Orange-Red
    warm: '#FFD700',     // Gold
    cold: '#1E90FF',     // Dodger Blue
    frozen: '#808080',   // Gray
  };
  
  return colours[heat.toLowerCase()] || '#FFFFFF'; // Fallback to white
};

// Logs for one trajectory within the last 7 days (rolling window, not calendar week)
export function getWeeklyLogs(trajectoryId, logs) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return logs.filter(
    (log) => log.trajectoryId === trajectoryId && new Date(log.timestamp) >= weekAgo,
  );
}

export function getWeeklyLogCount(trajectoryId, logs) {
  return getWeeklyLogs(trajectoryId, logs).length;
}
