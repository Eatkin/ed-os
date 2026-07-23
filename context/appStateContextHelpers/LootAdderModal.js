import { useState } from "react";

export const useLootAdderState = () => {
  const [lootAdderModalVisible, setLootAdderModalVisible] = useState(false);
  const [lootAdderModalTrajectoryId, setLootAdderModalTrajectoryId] = useState(null);
  const [lootAdderModalEditingId, setLootAdderModalEditingId] = useState(null);

  const openLootAdderModal = (trajectoryId = null, editingId = null) => {
    setLootAdderModalTrajectoryId(trajectoryId);
    setLootAdderModalEditingId(editingId);
    setLootAdderModalVisible(true);
  };

  const closeLootAdderModal = () => {
    setLootAdderModalVisible(false);
    setLootAdderModalTrajectoryId(null);
    setLootAdderModalEditingId(null);
  };
  return {
    lootAdderModalVisible,
    lootAdderModalTrajectoryId,
    lootAdderModalEditingId,
    setLootAdderModalVisible,
    openLootAdderModal,
    closeLootAdderModal,
  };
};
