/**
 * RPG Life Management App — Mock API Service
 * Local-first, AsyncStorage compatible, designed for Lambda + DynamoDB swap-in later
 * Heat-based trajectory tracking: no guilt, no decay, just visibility
 */

import {
  DB_STATE,
} from "./DB.constants";
import {
  EnrichedTrajectory,
  Log,
  LootItem,
  Profile,
  VaultItem,
} from "./DB.types";
import { clearMilestoneAndUnlockLoot, createLogAndApplyXP } from "./helpers";
// ============================================================================
// HELPERS
// ============================================================================

/**
 * Simulate network lag (800ms roundtrip, like a Lambda)
 */
function simulateNetworkLag() {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

// ============================================================================
// API SERVICE
// ============================================================================

export const ApiService = {
  fetchAllData: async () => {
    await simulateNetworkLag();
    // Assuming DB_STATE is available here or imported
    return {
      profile: new Profile(DB_STATE.profile),
      trajectories: Object.entries(DB_STATE.trajectories).reduce(
        (acc, [k, v]) => {
          acc[k] = new EnrichedTrajectory(v, DB_STATE.logs);
          return acc;
        },
        {},
      ),
      logs: DB_STATE.logs.map((l) => new Log(l)),
      loot: DB_STATE.lootStore.map((l) => new LootItem(l)),
      vault: DB_STATE.vault.map((v) => new VaultItem(v)),
    };
  },

  // --- Getters ---
  getProfile: async () => {
    await simulateNetworkLag();
    return new Profile(DB_STATE.profile);
  },

  getTrajectories: async (filters = {}) => {
    await simulateNetworkLag();
    const logs = DB_STATE.logs;
    return Object.values(DB_STATE.trajectories).map(
      (t) => new EnrichedTrajectory(t, logs),
    );
  },

  getLootStore: async (category = null) => {
    await simulateNetworkLag();
    const items = DB_STATE.lootStore.map((l) => new LootItem(l));
    return category ? items.filter((i) => i.category === category) : items;
  },

  getLogs: async (trajectoryId = null, limit = 20) => {
    await simulateNetworkLag();
    let logs = DB_STATE.logs.map((l) => new Log(l));
    if (trajectoryId)
      logs = logs.filter((l) => l.trajectoryId === trajectoryId);
    return logs.slice(0, limit); // Easy to add pagination later
  },

  getVault: async () => {
    await simulateNetworkLag();
    const vault = DB_STATE.vault;
    return vault;
  },

  // Mutators
  saveActivityLog: async (
    trajectoryId,
    resistance,
    note,
    durationHours = 0,
  ) => {
    await simulateNetworkLag();
    createLogAndApplyXP({ trajectoryId, resistance, note, durationHours });
    return { success: true, logs: await ApiService.getLogs() };
  },

  /**
   * POST: Mark a milestone as cleared
   * This is where unlocking happens
   */
  clearMilestone: async (trajectoryId, milestoneId) => {
    await simulateNetworkLag();
    clearMilestoneAndUnlockLoot(trajectoryId, milestoneId);
    return {
      success: true,
      trajectories: await ApiService.getTrajectories(),
    };
  },

  /**
   * POST: Clear a milestone AND attach a log entry recording the session
   * that achieved it. Reuses saveActivityLog's XP/attribute logic, then
   */
  clearMilestoneWithLog: async (
    trajectoryId,
    milestoneId,
    resistance,
    note,
    durationHours = 0,
  ) => {
    await simulateNetworkLag();
    createLogAndApplyXP({
      trajectoryId,
      resistance,
      note,
      durationHours,
      milestoneId,
    });
    clearMilestoneAndUnlockLoot(trajectoryId, milestoneId);
    return { success: true };
  },

  /**
   * POST: Purchase/claim an item from the loot store
   * Requires hero points OR milestone unlock
   */
  purchaseLootItem: async (itemId) => {
    await simulateNetworkLag();
    const item = DB_STATE.lootStore.find((l) => l.id === itemId);
    if (!item) throw new Error(`Loot item ${itemId} not found`);

    if (item.status === "OWNED") {
      throw new Error("Item already owned");
    }

    if (item.status === "LOCKED") {
      throw new Error("Item is locked. Unlock the required milestone first.");
    }

    // Item is AVAILABLE: check cost
    if (item.cost && DB_STATE.profile.heroPoints < item.cost) {
      throw new Error(
        `Insufficient hero points. Need ${item.cost}, have ${DB_STATE.profile.heroPoints}`,
      );
    }

    // Deduct cost if applicable
    if (item.cost) {
      DB_STATE.profile.heroPoints -= item.cost;
    }

    item.status = "OWNED";

    return {
      success: true,
      loot: await ApiService.getLootStore(),
    };
  },

  /**
   * POST: Add/update vault entry
   */
  addVaultEntry: async (trajectoryId, text) => {
    await simulateNetworkLag();

    const newEntry = {
      id: `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trajectoryId,
      text,
    };

    DB_STATE.vault.push(newEntry);

    return {
      success: true,
      vault: await ApiService.getVault(),
    };
  },

  /**
   * DELETE: Remove vault entry
   */
  deleteVaultEntry: async (vaultId) => {
    await simulateNetworkLag();

    DB_STATE.vault = DB_STATE.vault.filter((v) => v.id !== vaultId);

    return {
      success: true,
      vault: await ApiService.getVault(),
    };
  },
};
