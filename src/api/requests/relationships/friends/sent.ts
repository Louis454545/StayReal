import auth from "../../../../stores/auth";
import { BEREAL_DEFAULT_HEADERS } from "../../../constants";
import { fetch } from "@tauri-apps/plugin-http";

export interface RelationshipsFriendsSent {
  data: Array<{
    id: string
    username: string
    fullname: string
    status: "sent"
    mutualFriends: number
    updatedAt: string
  }>
  next: unknown | null
}

export const relationships_friends_sent = async (): Promise<RelationshipsFriendsSent> => {
  const response = await fetch("https://mobile-l7.bereal.com/api/relationships/friend-requests/sent?page", {
    headers: {
      ...BEREAL_DEFAULT_HEADERS(auth.store.deviceId),
      authorization: `Bearer ${auth.store.accessToken}`
    }
  });

  // if token expired, refresh it and retry
  if (response.status === 401) {
    await auth.refresh();
    return relationships_friends_sent();
  }

  return response.json()
};
