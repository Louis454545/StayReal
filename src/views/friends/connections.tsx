import {
  createResource,
  createSignal,
  For,
  Show,
  type Component,
} from "solid-js";

import MdiMagnify from "~icons/mdi/magnify";

import { relationships_friends } from "../../api/requests/relationships/friends/list";
import { getSearchProfile, type GetSearchProfile } from "~/api/requests/search/profile";
import ProfilePicture from "~/components/profile-picture";
import { postRelationshipsFriendRequests } from "~/api/requests/relationships/friends/send";
import InviteCallout from "~/components/friends/invite-callout";

const FriendsConnectionsView: Component = () => {
  const [friends] = createResource(relationships_friends);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [profilesQuery, { refetch: profilesQueryRefetch }] = createResource(searchQuery, (query) => getSearchProfile(query).catch(() => void 0));

  const filteredFriends = () => {
    const query = searchQuery().toLowerCase();
    const friendsList = friends()?.data || [];

    if (!query) return friendsList;

    return friendsList.filter(
      (friend) =>
        friend.username.toLowerCase().includes(query) ||
        friend.fullname.toLowerCase().includes(query)
    );
  };

  const SearchProfileEntry: Component<{ profile: GetSearchProfile["data"][number] }> = (props) => {
    const [loading, setLoading] = createSignal(false);

    const handleAdd = async () => {
      try {
        setLoading(true);
        await postRelationshipsFriendRequests(props.profile.id);
        await profilesQueryRefetch();
      }
      finally {
        setLoading(false);
      }
    }

    return (
      <div class="flex items-center justify-between">
        <a href="#" class="w-full flex items-center gap-4 p-1.5 rounded-lg focus:scale-[0.98] active:scale-95 transition-transform">
          <div class="relative">
            <ProfilePicture
              fullName={props.profile.fullname}
              username={props.profile.username}
              media={props.profile.profilePicture}
              size={60}
            />
          </div>

          <div class="flex flex-col">
            <p class="font-500">{props.profile.fullname}</p>
            <p class="text-sm text-white/60">@{props.profile.username}</p>
          </div>
        </a>
        <button type="button" class="shrink-0 bg-white/20 text-hite uppercase font-600 rounded-full text-xs px-2.5 py-1.5 disabled:opacity-50"
          disabled={loading() || props.profile.status === "sent"}
          onClick={handleAdd}
        >
          {props.profile.status === "sent" ? "Sent" : "Add"}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Query input to search for friends or new users. */}
      <div class="px-4 mb-6">
        <div class="relative flex items-center">
          <MdiMagnify class="absolute w-6 h-6 left-4 text-white/40 text-2xl" />
          <input
            type="text"
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            placeholder="Add or search friends"
            class="w-full bg-[#121212] rounded-xl py-2.5 pl-14 pr-4 text-[16px] placeholder:text-white/55 focus:outline-none"
          />
        </div>
      </div>

      <InviteCallout />

      {/* Show friends and also friends related to the query. */}
      <Show when={friends() && ((searchQuery().length >= 3 && filteredFriends().length !== 0) || searchQuery().length < 3)}>
        <section class="px-4">
          <h2 class="text-sm text-white/60 uppercase font-600 mb-4">
            My Friends ({filteredFriends().length})
          </h2>

          <div class="flex flex-col gap-2">
            <For each={filteredFriends()} fallback={<p class="text-sm">No friends found, add some !</p>}>
              {(friend) => (
                <a href="#" class="flex items-center gap-4 p-1.5 rounded-lg focus:scale-[0.98] active:scale-95 transition-transform">
                  <div class="relative">
                    <ProfilePicture
                      fullName={friend.fullname}
                      username={friend.username}
                      media={friend.profilePicture}
                      size={60}
                    />
                  </div>

                  <div class="flex flex-col">
                    <p class="font-500">{friend.fullname}</p>
                    <p class="text-sm text-white/60">@{friend.username}</p>
                  </div>
                </a>
              )}
            </For>
          </div>
        </section>
      </Show>

      {/* Show results of the query. */}
      <Show when={searchQuery().length >= 3 && profilesQuery()}>
        {profiles => (
          <section class="px-4 mt-4">
            <h2 class="text-sm text-white/60 uppercase font-600 mb-4">
              More Results ({profiles().data.length})
            </h2>

            <For each={profiles().data}>
              {profile => (
                <SearchProfileEntry profile={profile} />
              )}
            </For>
          </section>
        )}
      </Show>
    </>
  );
};

export default FriendsConnectionsView;
