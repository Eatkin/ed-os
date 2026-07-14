import { createContext, useContext, useState, useEffect } from "react";
import { ApiService } from "../services/ApiService/ApiService";
import baseStyles from "../style/base";
import { useConfirmModalState } from "./appStateContextHelpers/ConfirmModal";
import { useQuickActionsState } from "./appStateContextHelpers/QuickActions";
import { useLogState } from "./appStateContextHelpers/LogModal";
import { useMilestoneState } from "./appStateContextHelpers/MilestoneModal";
import { useCommitmentState } from "./appStateContextHelpers/CommitmentModal";
import { useNoteState } from "./appStateContextHelpers/NoteModal";
import { useMilestoneAdderState } from "./appStateContextHelpers/MilestoneAdderModal";
import { useLootAdderState } from "./appStateContextHelpers/LootAdderModal";
import { initializeDB } from "../services/ApiService/DB.state";
import { useTrajectoryState } from "./appStateContextHelpers/CreateTrajectoryModal";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [trajectories, setTrajectories] = useState({});
  const [logs, setLogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [loot, setLoot] = useState([]);
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);

  const logModalSlice = useLogState();
  const milestoneModalSlice = useMilestoneState();
  const quickActionsSlice = useQuickActionsState();
  const confirmModalSlice = useConfirmModalState();
  const commitmentModalSlice = useCommitmentState();
  const noteModalSlice = useNoteState();
  const milestoneAdderModalSlice = useMilestoneAdderState();
  const lootAdderModalSlice = useLootAdderState();
  const trajectoryModalSlice = useTrajectoryState();
  const styles = baseStyles;

  // Single place that re-pulls everything from the mock backend.
  // Used on initial load AND after any mutation (log saved, milestone cleared, etc.)
  const refreshAll = async () => {
    const data = await ApiService.fetchAllData();
    setProfile(data.profile);
    setTrajectories(data.trajectories);
    setLogs(data.logs);
    setNotes(data.notes);
    setCommitments(data.commitments);
    setLoot(data.lootStore);
    setVault(data.vault);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await initializeDB();
      await refreshAll();
      setLoading(false);
    })();
  }, []);

  /**
   * Log an activity: trajectoryId, resistance ("Flow", "Neutral", "Resistant", "Soul-Crushing"), note
   * API calculates XP and updates state
   */
  const logActivity = async (
    trajectoryId,
    resistance,
    note,
    durationHours = 0,
  ) => {
    try {
      const response = await ApiService.saveActivityLog(
        trajectoryId,
        resistance,
        note,
        durationHours,
      );
      if (response.success) {
        setLogs(response.logs);
        return response.logs;
      }
    } catch (err) {
      console.error("Failed to log activity", err);
      throw err;
    }
  };

  /**
   * Clear a milestone (unlock associated loot)
   */
  const clearMilestone = async (trajectoryId, milestoneId) => {
    try {
      const response = await ApiService.clearMilestone(
        trajectoryId,
        milestoneId,
      );
      if (response.success) {
        setTrajectories(response.trajectories);
        return response.trajectories;
      }
    } catch (err) {
      console.error("Failed to clear milestone", err);
      throw err;
    }
  };

  /**
   * Purchase an item from the loot store
   */
  const purchaseItem = async (itemId) => {
    try {
      const response = await ApiService.purchaseLootItem(itemId);
      if (response.success) {
        setLoot(response.loot);
        return response.loot;
      }
    } catch (err) {
      console.error("Failed to purchase item", err);
      throw err;
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        profile,
        trajectories,
        logs,
        commitments,
        loot,
        vault,
        notes,
        loading,
        logActivity,
        clearMilestone,
        purchaseItem,
        styles,
        refreshAll,
        ...milestoneModalSlice,
        ...logModalSlice,
        ...quickActionsSlice,
        ...confirmModalSlice,
        ...commitmentModalSlice,
        ...noteModalSlice,
        ...milestoneAdderModalSlice,
        ...lootAdderModalSlice,
        ...trajectoryModalSlice,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return context;
};
