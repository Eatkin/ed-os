import { createContext, useContext, useState, useEffect } from "react";
import { ApiService } from "../services/ApiService/ApiService";
import baseStyles from "../style/base";
import { Log, Profile } from "../services/ApiService/DB.types";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [trajectories, setTrajectories] = useState({});
  const [logs, setLogs] = useState([]);
  const [loot, setLoot] = useState([]);
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = baseStyles;

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        // Assuming you added a "fetchAll" or similar to ApiService
        const data = await ApiService.fetchAllData();

        setProfile(data.profile);
        setTrajectories(data.trajectories);
        setLogs(data.logs);
        setLoot(data.loot);
        setVault(data.vault);
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
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
        setTrajectories(response.trajectory);
        return response.trajectory;
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
        styles,
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
