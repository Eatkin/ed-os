import { useState } from "react";

export const useLootAdderState = () => {
  const [lootAdderModalVisible, setLootAdderModalVisible] = useState(false);
  const [lootAdderModalTrajectoryId, setLootAdderModalTrajectoryId] = useState(null);

  const openLootAdderModal = (trajectoryId = null) => {
    setLootAdderModalTrajectoryId(trajectoryId);
    setLootAdderModalVisible(true);
  };

  const closeLootAdderModal = () => {
    setLootAdderModalVisible(false);
    setLootAdderModalTrajectoryId(null);
  };
  return {
    lootAdderModalVisible,
    lootAdderModalTrajectoryId,
    setLootAdderModalVisible,
    openLootAdderModal,
    closeLootAdderModal,
  };
};
