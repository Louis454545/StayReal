import { type Component, Show } from "solid-js";
import { selectSaveFolder } from "~/utils/folder-selection";
import autoSaveStore from "~/stores/auto-save";
import MdiFolder from '~icons/mdi/folder';
import MdiChevronRight from '~icons/mdi/chevron-right';

const FolderSelector: Component = () => {
  const handleSelectFolder = async () => {
    const selectedPath = await selectSaveFolder();
    if (selectedPath) {
      autoSaveStore.setSavePath(selectedPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSelectFolder}
      class="flex items-center w-full px-4 py-3 bg-white/10 rounded-lg"
    >
      <div class="flex items-center gap-4 flex-1">
        <MdiFolder class="text-xl" />
        <div class="flex flex-col items-start">
          <p class="font-medium">Dossier de sauvegarde</p>
          <Show 
            when={autoSaveStore.get().savePath} 
            fallback={<p class="text-sm text-white/50">Aucun dossier sélectionné</p>}
          >
            <p class="text-sm text-white/70 truncate max-w-[250px]">
              {autoSaveStore.get().savePath}
            </p>
          </Show>
        </div>
      </div>
      <MdiChevronRight class="text-xl text-white/50" />
    </button>
  );
};

export default FolderSelector;