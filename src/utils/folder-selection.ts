import { open } from '@tauri-apps/plugin-dialog';

/**
 * Opens a dialog to select a folder for saving BeReals
 * @returns Promise<string | null> - The selected folder path or null if cancelled
 */
export const selectSaveFolder = async (): Promise<string | null> => {
  try {
    const result = await open({
      directory: true,
      multiple: false,
      title: "Choisir le dossier de sauvegarde des BeReals"
    });

    if (result && typeof result === 'string') {
      return result;
    }

    return null;
  } catch (error) {
    console.error('Error selecting folder:', error);
    return null;
  }
};