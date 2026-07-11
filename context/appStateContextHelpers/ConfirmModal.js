import { useState } from "react";

export const useConfirmModalState = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState(null); 

  const openConfirmModal = ({
    title,
    message,
    confirmLabel = "Confirm",
    onConfirm,
  }) => {
    setConfirmModalData({ title, message, confirmLabel, onConfirm });
    setConfirmModalVisible(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalVisible(false);
    setConfirmModalData(null);
  };

  // Return the raw values so AppStateProvider can grab and share them
  return {
    confirmModalData,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
  };
};
