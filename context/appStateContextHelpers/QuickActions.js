import { useState } from "react";

export const useQuickActionsState = () => {
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  const openQuickActions = () => setQuickActionsVisible(true);
  const closeQuickActions = () => setQuickActionsVisible(false);

  return {
        quickActionsVisible,
        openQuickActions,
        closeQuickActions,
  };
};
