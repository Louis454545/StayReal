import { type Component, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import autoSaveStore from "~/stores/auto-save";
import { useAutoSave } from "~/utils/auto-save-hook";
import FolderSelector from "~/components/auto-save/folder-selector";
import FriendsSelector from "~/components/auto-save/friends-selector";
import MdiChevronLeft from '~icons/mdi/chevron-left';
import MdiDownload from '~icons/mdi/download';
import MdiCheck from '~icons/mdi/check';
import MdiRefresh from '~icons/mdi/refresh';
import { message } from '@tauri-apps/plugin-dialog';

const AutoSaveSettings: Component = () => {
  const navigate = useNavigate();
  const autoSave = useAutoSave();
  const [isCheckingNow, setIsCheckingNow] = createSignal(false);

  const settings = () => autoSaveStore.get();

  const toggleAutoSave = () => {
    autoSaveStore.toggle();
  };

  const handleCheckNow = async () => {
    if (!settings().savePath || settings().selectedFriends.length === 0) {
      await message("Veuillez d'abord configurer un dossier de sauvegarde et sélectionner des amis", {
        title: "Configuration incomplète",
        kind: 'warning'
      });
      return;
    }

    try {
      setIsCheckingNow(true);
      await autoSave.checkNow();
      await message("Vérification terminée ! Les nouveaux BeReals ont été sauvegardés.", {
        title: "Vérification terminée",
        kind: 'info'
      });
    } catch (error) {
      console.error('Error checking now:', error);
      await message("Erreur lors de la vérification des BeReals", {
        title: "Erreur",
        kind: 'error'
      });
    } finally {
      setIsCheckingNow(false);
    }
  };

  const isConfigured = () => {
    return settings().savePath && settings().selectedFriends.length > 0;
  };

  const getStatusText = () => {
    if (!settings().enabled) return "Désactivé";
    if (!isConfigured()) return "Configuration incomplète";
    if (autoSave.isRunning()) return "Actif - Vérification automatique";
    return "Configuré mais arrêté";
  };

  const getStatusColor = () => {
    if (!settings().enabled) return "text-white/50";
    if (!isConfigured()) return "text-yellow-400";
    if (autoSave.isRunning()) return "text-green-400";
    return "text-orange-400";
  };

  return (
    <>
      <header class="pt-[env(safe-area-inset-top)]">
        <nav class="flex items-center justify-between px-4 h-[72px]">
          <button 
            onClick={() => navigate("/settings")} 
            class="p-2.5 rounded-full ml-[-10px]" 
            aria-label="Retour aux paramètres"
          >
            <MdiChevronLeft class="text-2xl" />
          </button>
          <h1 class="text-lg font-bold">Sauvegarde automatique</h1>
          <div class="w-10" /> {/* Spacer for centering */}
        </nav>
      </header>

      <div class="p-4 space-y-6">
        {/* Status Section */}
        <section class="space-y-3">
          <h2 class="uppercase font-bold text-white/50 text-sm">Statut</h2>
          
          <div class="bg-white/10 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="font-medium">Sauvegarde automatique</p>
                <p class={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
              </div>
              <button
                type="button"
                onClick={toggleAutoSave}
                class={`relative w-12 h-6 rounded-full transition-colors ${
                  settings().enabled ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div
                  class={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings().enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            
            <Show when={settings().lastCheck}>
              <p class="text-xs text-white/50">
                Dernière vérification : {new Date(settings().lastCheck!).toLocaleString()}
              </p>
            </Show>
          </div>

          <Show when={settings().enabled && isConfigured()}>
            <button
              type="button"
              onClick={handleCheckNow}
              disabled={isCheckingNow()}
              class="flex items-center justify-center gap-2 w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Show when={isCheckingNow()} fallback={<MdiRefresh />}>
                <div class="animate-spin">
                  <MdiRefresh />
                </div>
              </Show>
              {isCheckingNow() ? "Vérification en cours..." : "Vérifier maintenant"}
            </button>
          </Show>
        </section>

        {/* Configuration Section */}
        <section class="space-y-3">
          <h2 class="uppercase font-bold text-white/50 text-sm">Configuration</h2>
          
          <div class="space-y-3">
            <FolderSelector />
            <FriendsSelector />
          </div>
        </section>

        {/* Information Section */}
        <section class="space-y-3">
          <h2 class="uppercase font-bold text-white/50 text-sm">Informations</h2>
          
          <div class="bg-white/5 rounded-lg p-4 space-y-2">
            <div class="flex items-start gap-3">
              <MdiDownload class="text-blue-400 mt-0.5" />
              <div>
                <p class="font-medium text-sm">Comment ça marche</p>
                <p class="text-xs text-white/70 mt-1">
                  L'application vérifie automatiquement toutes les 5 minutes s'il y a de nouveaux BeReals 
                  de vos amis sélectionnés et les sauvegarde dans le dossier choisi.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <MdiCheck class="text-green-400 mt-0.5" />
              <div>
                <p class="font-medium text-sm">Organisation des fichiers</p>
                <p class="text-xs text-white/70 mt-1">
                  Les BeReals sont organisés par utilisateur, puis par date : 
                  <code class="bg-white/10 px-1 rounded text-xs">/@username/YYYY-MM-DD/</code>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AutoSaveSettings;