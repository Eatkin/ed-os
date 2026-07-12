import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "edos_db_state";

export async function loadPersistedState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load persisted state:", e);
    return null;
  }
}

export async function savePersistedState(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state:", e);
  }
}
