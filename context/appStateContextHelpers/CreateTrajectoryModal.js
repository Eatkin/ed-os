import { useState } from "react";

export const useTrajectoryState = () => {
  const [createTrajectoryModalVisible, setCreateTrajectoryModalVisible] = useState(false);

  const openCreateTrajectoryModal = () => {
    setCreateTrajectoryModalVisible(true);
  };

  const closeCreateTrajectoryModal = () => {
    setCreateTrajectoryModalVisible(false);
  };
  return {
    createTrajectoryModalVisible,
    setCreateTrajectoryModalVisible,
    openCreateTrajectoryModal,
    closeCreateTrajectoryModal,
  };
};
