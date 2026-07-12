import { useState } from "react";

export const useNoteState = () => {
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteModalTrajectoryId, setNoteModalTrajectoryId] = useState(null);

  const openNoteModal = (trajectoryId = null) => {
    setNoteModalTrajectoryId(trajectoryId);
    setNoteModalVisible(true);
  };

  const closeNoteModal = () => {
    setNoteModalVisible(false);
    setNoteModalTrajectoryId(null);
  };
  return {
    noteModalVisible,
    noteModalTrajectoryId,
    setNoteModalVisible,
    openNoteModal,
    closeNoteModal,
  };
};
