import { useState } from "react";

export const useMilestoneState = () => {
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [milestoneModalData, setMilestoneModalData] = useState(null); // { trajectoryId, milestoneId }

  const openMilestoneModal = (trajectoryId, milestoneId) => {
    setMilestoneModalData({ trajectoryId, milestoneId });
    setMilestoneModalVisible(true);
  };

  const closeMilestoneModal = () => {
    setMilestoneModalVisible(false);
    setMilestoneModalData(null);
  };

  return {
    milestoneModalData,
    milestoneModalVisible,
    openMilestoneModal,
    closeMilestoneModal,
  };
};
