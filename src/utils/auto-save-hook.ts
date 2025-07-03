import { createEffect, onCleanup } from "solid-js";
import autoSaveStore from "~/stores/auto-save";
import { autoSaveService } from "./auto-save-service";

/**
 * Hook to manage the auto-save service based on settings
 */
export const useAutoSave = () => {
  // Monitor settings changes and start/stop service accordingly
  createEffect(() => {
    const settings = autoSaveStore.get();
    const shouldRun = settings.enabled && 
                     settings.savePath && 
                     settings.selectedFriends.length > 0;

    if (shouldRun && !autoSaveService.isRunning()) {
      autoSaveService.start();
    } else if (!shouldRun && autoSaveService.isRunning()) {
      autoSaveService.stop();
    }
  });

  // Cleanup on unmount
  onCleanup(() => {
    autoSaveService.stop();
  });

  return {
    isRunning: () => autoSaveService.isRunning(),
    checkNow: () => autoSaveService.checkNow(),
    start: () => autoSaveService.start(),
    stop: () => autoSaveService.stop()
  };
};