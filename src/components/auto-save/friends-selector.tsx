import { type Component, createSignal, createEffect, For, Show } from "solid-js";
import { getRelationshipsFriends, type Friend } from "~/api/requests/relationships/friends/list";
import autoSaveStore from "~/stores/auto-save";
import MdiAccount from '~icons/mdi/account';
import MdiCheck from '~icons/mdi/check';
import MdiChevronDown from '~icons/mdi/chevron-down';
import MdiChevronUp from '~icons/mdi/chevron-up';

const FriendsSelector: Component = () => {
  const [friends, setFriends] = createSignal<Friend[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [expanded, setExpanded] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  // Load friends list
  createEffect(async () => {
    try {
      setLoading(true);
      setError(null);
      const friendsList = await getRelationshipsFriends();
      setFriends(friendsList);
    } catch (err) {
      console.error('Error loading friends:', err);
      setError('Impossible de charger la liste des amis');
    } finally {
      setLoading(false);
    }
  });

  const selectedFriends = () => autoSaveStore.get().selectedFriends;
  
  const toggleFriend = (friendId: string) => {
    const currentSelected = selectedFriends();
    const isSelected = currentSelected.includes(friendId);
    
    if (isSelected) {
      autoSaveStore.setSelectedFriends(currentSelected.filter(id => id !== friendId));
    } else {
      autoSaveStore.setSelectedFriends([...currentSelected, friendId]);
    }
  };

  const selectAll = () => {
    autoSaveStore.setSelectedFriends(friends().map(f => f.id));
  };

  const selectNone = () => {
    autoSaveStore.setSelectedFriends([]);
  };

  const getSelectedFriendsText = () => {
    const count = selectedFriends().length;
    const total = friends().length;
    
    if (count === 0) return "Aucun ami sélectionné";
    if (count === total) return "Tous les amis sélectionnés";
    return `${count} ami${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`;
  };

  return (
    <div class="space-y-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded())}
        class="flex items-center w-full px-4 py-3 bg-white/10 rounded-lg"
      >
        <div class="flex items-center gap-4 flex-1">
          <MdiAccount class="text-xl" />
          <div class="flex flex-col items-start">
            <p class="font-medium">Amis à surveiller</p>
            <Show when={!loading()} fallback={<p class="text-sm text-white/50">Chargement...</p>}>
              <Show when={!error()} fallback={<p class="text-sm text-red-400">{error()}</p>}>
                <p class="text-sm text-white/70">{getSelectedFriendsText()}</p>
              </Show>
            </Show>
          </div>
        </div>
        <Show when={expanded()} fallback={<MdiChevronDown class="text-xl text-white/50" />}>
          <MdiChevronUp class="text-xl text-white/50" />
        </Show>
      </button>

      <Show when={expanded() && !loading() && !error()}>
        <div class="bg-white/5 rounded-lg p-4 space-y-3">
          {/* Select all/none buttons */}
          <div class="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              class="px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              Tous
            </button>
            <button
              type="button"
              onClick={selectNone}
              class="px-3 py-1.5 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              Aucun
            </button>
          </div>

          {/* Friends list */}
          <div class="max-h-64 overflow-y-auto space-y-2">
            <For each={friends()}>
              {(friend) => {
                const isSelected = () => selectedFriends().includes(friend.id);
                
                return (
                  <button
                    type="button"
                    onClick={() => toggleFriend(friend.id)}
                    class={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      isSelected() ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Show when={friend.profilePicture} fallback={
                      <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <MdiAccount class="text-sm" />
                      </div>
                    }>
                      <img
                        src={friend.profilePicture!.url}
                        alt={`${friend.fullname} profile`}
                        class="w-8 h-8 rounded-full object-cover"
                      />
                    </Show>
                    
                    <div class="flex-1 text-left">
                      <p class="font-medium">{friend.fullname}</p>
                      <p class="text-sm text-white/70">@{friend.username}</p>
                    </div>
                    
                    <Show when={isSelected()}>
                      <MdiCheck class="text-green-400" />
                    </Show>
                  </button>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default FriendsSelector;