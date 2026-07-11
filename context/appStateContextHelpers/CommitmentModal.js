import { useState } from "react";

export const useCommitmentState = () => {
  const [commitmentModalVisible, setCommitmentModalVisible] = useState(false);
  const [commitmentModalTrajectoryId, setCommitmentModalTrajectoryId] = useState(null);

  const openCommitmentModal = (trajectoryId = null) => {
    setCommitmentModalTrajectoryId(trajectoryId);
    setCommitmentModalVisible(true);
  };

  const closeCommitmentModal = () => {
    setCommitmentModalVisible(false);
    setCommitmentModalTrajectoryId(null);
  };
  return {
    commitmentModalVisible,
    commitmentModalTrajectoryId,
    setCommitmentModalVisible,
    openCommitmentModal,
    closeCommitmentModal,
  };
};
