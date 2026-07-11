import { useState } from "react";

export const useLogState = () => {
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [logModalTrajectoryId, setLogModalTrajectoryId] = useState(null);

  // trajectoryId is optional — set when opened from a detail screen (pre-picked),
  // left undefined/null when opened from the + tab (shows the picker grid)
  const openLogModal = (trajectoryId = null) => {
    setLogModalTrajectoryId(trajectoryId);
    setLogModalVisible(true);
  };

  const closeLogModal = () => {
    setLogModalVisible(false);
    setLogModalTrajectoryId(null);
  };
  return {
    logModalVisible,
    logModalTrajectoryId,
    setLogModalVisible,
    openLogModal,
    closeLogModal,
  };
};
