import { MOCK_DATA } from "./DB.constants";
import { loadPersistedState, savePersistedState } from "./Persistance";

export let DB_STATE = MOCK_DATA;

export async function initializeDB() {
  const persisted = await loadPersistedState();
  if (persisted) {
    // Wipe existing keys, replace with persisted data — same object reference,
    // so every module that already imported DB_STATE sees the update
    Object.keys(DB_STATE).forEach((k) => delete DB_STATE[k]);
    Object.assign(DB_STATE, persisted);
    // Defend against schema growth: a persisted blob saved before this key
    // existed won't have it, and DB_STATE is used directly (not merged
    // with MOCK_DATA), so it would otherwise be missing entirely.
    if (!DB_STATE.lootLog) DB_STATE.lootLog = [];
  } else {
    // First-ever launch — seed with MOCK_DATA
    Object.assign(DB_STATE, MOCK_DATA);
    await savePersistedState(DB_STATE);
  }
}
