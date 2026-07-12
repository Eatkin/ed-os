import { useState } from "react";

export const useMilestoneAdderState = () => {
  const [milestoneAdderModalVisible, setMilestoneAdderModalVisible] = useState(false);
  const [milestoneAdderModalTrajectoryId, setMilestoneAdderModalTrajectoryId] = useState(null);

  const openMilestoneAdderModal = (trajectoryId = null) => {
    setMilestoneAdderModalTrajectoryId(trajectoryId);
    setMilestoneAdderModalVisible(true);
  };

  const closeMilestoneAdderModal = () => {
    setMilestoneAdderModalVisible(false);
    setMilestoneAdderModalTrajectoryId(null);
  };
  return {
    milestoneAdderModalVisible,
    milestoneAdderModalTrajectoryId,
    setMilestoneAdderModalVisible,
    openMilestoneAdderModal,
    closeMilestoneAdderModal,
  };
};
