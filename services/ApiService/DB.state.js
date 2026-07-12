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
  } else {
    // First-ever launch — seed with MOCK_DATA
    Object.assign(DB_STATE, MOCK_DATA);
    await savePersistedState(DB_STATE);
  }
}
