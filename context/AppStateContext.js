import { createContext, useContext, useState, useEffect } from "react";
import { ApiService } from "../services/ApiService/ApiService";
import baseStyles from "../style/base";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [trajectories, setTrajectories] = useState({});
  const [logs, setLogs] = useState([]);
  const [loot, setLoot] = useState([]);
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [logModalTrajectoryId, setLogModalTrajectoryId] = useState(null);
  const [milestoneModalVisible, setMilestoneModalVisible] = useState(false);
  const [milestoneModalData, setMilestoneModalData] = useState(null); // { trajectoryId, milestoneId }

  const styles = baseStyles;

  // Single place that re-pulls everything from the mock backend.
  // Used on initial load AND after any mutation (log saved, milestone cleared, etc.)
  const refreshAll = async () => {
    const data = await ApiService.fetchAllData();
    setProfile(data.profile);
    setTrajectories(data.trajectories);
    setLogs(data.logs);
    setLoot(data.loot);
    setVault(data.vault);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshAll();
      setLoading(false);
    })();
  }, []);

  /**
   * Open / close log modal
   */
  // trajectoryId is optional — set when opened from a detail screen (pre-picked),
  // left undefined/null when opened from the + tab (shows the picker grid)
  const openLogModal = (trajectoryId = null) => {
    setLogModalTrajectoryId(trajectoryId);
    setLogModalVisible(true);
  };

  const closeLogModal = () => {
    setLogModalVisible(false);
    setLogModalTrajectoryId(null);
  };

  /**
   * Open / close milestone modal
   */
  const openMilestoneModal = (trajectoryId, milestoneId) => {
    setMilestoneModalData({ trajectoryId, milestoneId });
    setMilestoneModalVisible(true);
  };

  const closeMilestoneModal = () => {
    setMilestoneModalVisible(false);
    setMilestoneModalData(null);
  };

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
        loot,
        vault,
        loading,
        logActivity,
        clearMilestone,
        purchaseItem,
        logModalVisible,
        logModalTrajectoryId,
        setLogModalVisible,
        openLogModal,
        closeLogModal,
        milestoneModalData,
        milestoneModalVisible,
        openMilestoneModal,
        closeMilestoneModal,
        styles,
        refreshAll,
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
