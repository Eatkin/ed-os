import { useState } from "react";

export const useTrajectoryState = () => {
  const [createTrajectoryModalVisible, setCreateTrajectoryModalVisible] = useState(false);
  const [createTrajectoryModalEditingId, setCreateTrajectoryModalEditingId] = useState(null);

  const openCreateTrajectoryModal = (editingId = null) => {
    setCreateTrajectoryModalEditingId(editingId);
    setCreateTrajectoryModalVisible(true);
  };

  const closeCreateTrajectoryModal = () => {
    setCreateTrajectoryModalVisible(false);
    setCreateTrajectoryModalEditingId(null);
  };
  return {
    createTrajectoryModalVisible,
    createTrajectoryModalEditingId,
    setCreateTrajectoryModalVisible,
    openCreateTrajectoryModal,
    closeCreateTrajectoryModal,
  };
};
