import { useState } from "react";

export const useMilestoneAdderState = () => {
  const [milestoneAdderModalVisible, setMilestoneAdderModalVisible] = useState(false);
  const [milestoneAdderModalTrajectoryId, setMilestoneAdderModalTrajectoryId] = useState(null);
  const [milestoneAdderModalEditingId, setMilestoneAdderModalEditingId] = useState(null);

  const openMilestoneAdderModal = (trajectoryId = null, editingId = null) => {
    setMilestoneAdderModalTrajectoryId(trajectoryId);
    setMilestoneAdderModalEditingId(editingId);
    setMilestoneAdderModalVisible(true);
  };

  const closeMilestoneAdderModal = () => {
    setMilestoneAdderModalVisible(false);
    setMilestoneAdderModalTrajectoryId(null);
    setMilestoneAdderModalEditingId(null);
  };
  return {
    milestoneAdderModalVisible,
    milestoneAdderModalTrajectoryId,
    milestoneAdderModalEditingId,
    setMilestoneAdderModalVisible,
    openMilestoneAdderModal,
    closeMilestoneAdderModal,
  };
};
