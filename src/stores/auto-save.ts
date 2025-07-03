import { createRoot } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

export interface AutoSaveSettings {
  enabled: boolean;
  savePath: string;
  selectedFriends: string[]; // Array of friend IDs
  lastCheck: string | null; // ISO date string of last check
}

export default createRoot(() => {
  const STORAGE_KEY = "auto_save_settings";
  const INITIAL_DATA = localStorage.getItem(STORAGE_KEY);

  const defaultSettings: AutoSaveSettings = {
    enabled: false,
    savePath: "",
    selectedFriends: [],
    lastCheck: null
  };

  const [get, _set] = createStore({
    value: INITIAL_DATA ? <AutoSaveSettings>JSON.parse(INITIAL_DATA) : defaultSettings
  });

  const set = (value: Partial<AutoSaveSettings>): void => {
    const newValue = { ...get.value, ...value };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    } catch { 
      console.error("Failed to save auto-save settings to localStorage");
    }

    _set("value", reconcile(newValue));
  };

  const toggle = (): void => {
    set({ enabled: !get.value.enabled });
  };

  const setSavePath = (path: string): void => {
    set({ savePath: path });
  };

  const setSelectedFriends = (friendIds: string[]): void => {
    set({ selectedFriends: friendIds });
  };

  const updateLastCheck = (): void => {
    set({ lastCheck: new Date().toISOString() });
  };

  const clear = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    _set("value", reconcile(defaultSettings));
  };

  return { 
    get: () => get.value, 
    set, 
    toggle, 
    setSavePath, 
    setSelectedFriends, 
    updateLastCheck, 
    clear 
  };
});