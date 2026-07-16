/**
 * RPG Life Management App — Mock API Service
 * Local-first, AsyncStorage compatible, designed for Lambda + DynamoDB swap-in later
 * Heat-based trajectory tracking: no guilt, no decay, just visibility
 */

import { DB_STATE } from "./DB.constants";
import {
  Database,
  EnrichedTrajectory,
  Log,
  LootItem,
  Profile,
} from "./DB.types";
import {
  archiveTrajectory,
  clearMilestoneAndUnlockLoot,
  createCommitment,
  createLogAndApplyXP,
  markCommitmentMissed,
  createNote,
  createMilestone,
  createLootItem,
  archiveNote,
  createTrajectory,
} from "./helpers";
import { savePersistedState } from "./Persistance";

// ============================================================================
// API SERVICE
// ============================================================================

export const ApiService = {
  fetchAllData: async () => {
    return new Database(DB_STATE);
  },

  // --- Getters ---
  getProfile: async () => {
    return new Profile(DB_STATE.profile);
  },

  getTrajectories: async (filters = {}) => {
    const logs = DB_STATE.logs;
    const notes = DB_STATE.notes;
    return Object.values(DB_STATE.trajectories).map(
      (t) => new EnrichedTrajectory(t, logs, notes),
    );
  },

  getLootStore: async (category = null) => {
    const items = DB_STATE.lootStore.map((l) => new LootItem(l));
    return category ? items.filter((i) => i.category === category) : items;
  },

  getLogs: async (trajectoryId = null, limit = 20) => {
    let logs = DB_STATE.logs.map((l) => new Log(l));
    if (trajectoryId)
      logs = logs.filter((l) => l.trajectoryId === trajectoryId);
    return logs.slice(0, limit); // Easy to add pagination later
  },

  getVault: async () => {
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
    createLogAndApplyXP({ trajectoryId, resistance, note, durationHours });
    savePersistedState(DB_STATE);
    return { success: true, logs: await ApiService.getLogs() };
  },

  createCommitment: async (trajectoryId, notes, expiresAt, bonusXP = 0) => {
    const commitment = createCommitment(
      trajectoryId,
      notes,
      expiresAt,
      bonusXP,
    );
    savePersistedState(DB_STATE);
    return { success: true, commitment };
  },

  missCommitment: async (commitmentId) => {
    markCommitmentMissed(commitmentId);
    savePersistedState(DB_STATE);
    return { success: true };
  },

  /**
   * POST: Mark a milestone as cleared
   * This is where unlocking happens
   */
  clearMilestone: async (trajectoryId, milestoneId) => {
    clearMilestoneAndUnlockLoot(trajectoryId, milestoneId);
    savePersistedState(DB_STATE);
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
    createLogAndApplyXP({
      trajectoryId,
      resistance,
      note,
      durationHours,
      milestoneId,
    });
    clearMilestoneAndUnlockLoot(trajectoryId, milestoneId);
    savePersistedState(DB_STATE);
    return { success: true };
  },

  /**
   * POST: Purchase/claim an item from the loot store
   * Requires hero points OR milestone unlock
   */
  purchaseLootItem: async (itemId) => {
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

    if (!item.recurring) {
      item.status = "OWNED";
    } else {
      // Account for items that have never had purchased set
      if (item.purchased === undefined) {
        item.purchased = 0;
      }
      item.purchased += 1;
    }

    savePersistedState(DB_STATE);
    return {
      success: true,
      loot: await ApiService.getLootStore(),
    };
  },

  /**
   * POST: Add/update vault entry
   */
  addVaultEntry: async (trajectoryId, text) => {
    const newEntry = {
      id: `vault_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      trajectoryId,
      text,
    };

    DB_STATE.vault.push(newEntry);

    savePersistedState(DB_STATE);
    return {
      success: true,
      vault: await ApiService.getVault(),
    };
  },

  /**
   * DELETE: Remove vault entry
   */
  deleteVaultEntry: async (vaultId) => {
    DB_STATE.vault = DB_STATE.vault.filter((v) => v.id !== vaultId);

    savePersistedState(DB_STATE);
    return {
      success: true,
      vault: await ApiService.getVault(),
    };
  },
  /**
   * POST: Add trajectory
   */
  createTrajectory: async (trajectoryData) => {
    const trajectory = createTrajectory(trajectoryData);
    savePersistedState(DB_STATE);
    return { success: true, trajectory };
  },
  /**
   * PATCH: Set trajectory status
   */
  setTrajectoryArchived: async (trajectoryId, archived = true) => {
    archiveTrajectory(trajectoryId, archived);
    savePersistedState(DB_STATE);
    return { success: true };
  },

  /**
   * POST: Add note
   */
  addNote: async (trajectoryId, note) => {
    const newNote = createNote(trajectoryId, note);
    savePersistedState(DB_STATE);
    return { success: true, note: newNote };
  },

  /**
   * PATCH: Set note archived
   */
  setNoteArchived: async (noteId, archived = true) => {
    archiveNote(noteId, archived);
    savePersistedState(DB_STATE);
    return { success: true };
  },

  /**
   * POST: Add milestone
   */
  createMilestone: async (trajectoryId, text) => {
    const milestone = createMilestone(trajectoryId, text);
    savePersistedState(DB_STATE);
    return { success: true, milestone };
  },

  /**
   * POST: Add loot
   */
  createLootItem: async (lootData) => {
    const lootItem = createLootItem(lootData);
    savePersistedState(DB_STATE);
    return { success: true, lootItem };
  },
};
