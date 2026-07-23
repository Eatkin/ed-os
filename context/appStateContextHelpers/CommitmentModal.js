import { useState } from "react";

export const useCommitmentState = () => {
  const [commitmentModalVisible, setCommitmentModalVisible] = useState(false);
  const [commitmentModalTrajectoryId, setCommitmentModalTrajectoryId] = useState(null);
  const [commitmentModalEditingId, setCommitmentModalEditingId] = useState(null);

  const openCommitmentModal = (trajectoryId = null, editingId = null) => {
    setCommitmentModalTrajectoryId(trajectoryId);
    setCommitmentModalEditingId(editingId);
    setCommitmentModalVisible(true);
  };

  const closeCommitmentModal = () => {
    setCommitmentModalVisible(false);
    setCommitmentModalTrajectoryId(null);
    setCommitmentModalEditingId(null);
  };
  return {
    commitmentModalVisible,
    commitmentModalTrajectoryId,
    commitmentModalEditingId,
    setCommitmentModalVisible,
    openCommitmentModal,
    closeCommitmentModal,
  };
};
