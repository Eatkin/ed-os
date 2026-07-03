import { createContext, useContext, useState, useEffect } from 'react';
import { ApiService } from '../services/ApiService';
import baseStyles from '../style/base';

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const styles = baseStyles;

  // Hydrate data from API on app mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiService.fetchAppData();
        setState(data);
      } catch (err) {
        console.error("Failed to load app data from ApiService", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /**
   * Log an activity: trajectoryId, resistance ("Flow", "Neutral", "Resistant", "Soul-Crushing"), note
   * API calculates XP and updates state
   */
  const logActivity = async (trajectoryId, resistance, note, durationHours = 0) => {
    try {
      const response = await ApiService.saveActivityLog(trajectoryId, resistance, note, durationHours);
      if (response.success) {
        setState(response.updatedState);
        return response.updatedState;
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
      const response = await ApiService.clearMilestone(trajectoryId, milestoneId);
      if (response.success) {
        setState(response.updatedState);
        return response.updatedState;
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
        setState(response.updatedState);
        return response.updatedState;
      }
    } catch (err) {
      console.error("Failed to purchase item", err);
      throw err;
    }
  };

  /**
   * Get app data
   */
  const getAppData = async () => {
    try {
      const response = await ApiService.fetchAppData();
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error("Failed to purchase item", err);
      throw err;
    }
  }


  return (
    <AppStateContext.Provider
      value={{
        ...state,
        loading,
        styles,
        logActivity,
        clearMilestone,
        purchaseItem,
          getAppData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
