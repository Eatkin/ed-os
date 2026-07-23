import { useState } from "react";

export const useNoteState = () => {
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteModalTrajectoryId, setNoteModalTrajectoryId] = useState(null);
  const [noteModalEditingId, setNoteModalEditingId] = useState(null);

  const openNoteModal = (trajectoryId = null, editingId = null) => {
    setNoteModalTrajectoryId(trajectoryId);
    setNoteModalEditingId(editingId);
    setNoteModalVisible(true);
  };

  const closeNoteModal = () => {
    setNoteModalVisible(false);
    setNoteModalTrajectoryId(null);
    setNoteModalEditingId(null);
  };
  return {
    noteModalVisible,
    noteModalTrajectoryId,
    noteModalEditingId,
    setNoteModalVisible,
    openNoteModal,
    closeNoteModal,
  };
};
