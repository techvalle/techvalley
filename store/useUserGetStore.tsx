import { getUserAvatarAndName } from "@/lib/api";
import { create } from "zustand";

interface UserDetails {
  userId: string;
  avatarUrl: string | null;
  username: string;
}

interface UserStore {
  userCache: Record<string, UserDetails>;
  inFlightRequests: Record<string, Promise<UserDetails | undefined>>;
  fetchUserDetails: (userIds: string[]) => Promise<void>;
}

export const useUserGetStore = create<UserStore>((set, get) => ({
  userCache: {}, // Caches user details
  inFlightRequests: {}, // Tracks ongoing requests to avoid duplicates

  fetchUserDetails: async (userIds) => {
    const state = get(); // Access Zustand state
    const { userCache, inFlightRequests } = state;

    const requests: Promise<UserDetails | undefined>[] = [];
    const results: (UserDetails | undefined)[] = [];

    for (const userId of userIds) {
      if (userCache[userId]) {
        // Already cached, no need to fetch
        results.push(userCache[userId]);
      } else if (inFlightRequests[userId] as any) {
        // Request already in progress, reuse it
        requests.push(inFlightRequests[userId]);
      } else {
        try {
          // Create a new API request
          const userDetails = await getUserAvatarAndName(userId);
          if (userDetails) {
            const newUser: UserDetails = {
              userId,
              avatarUrl: userDetails.avatarUrl || null,
              username: userDetails.userName || "User",
            };
            // Update cache
            set(
              (state) =>
                ({
                  userCache: { ...state.userCache, [userId]: newUser },
                  inFlightRequests: {
                    ...state.inFlightRequests,
                    [userId]: undefined,
                  },
                } as any)
            );
            results.push(newUser);
          }
        } catch (error) {
          console.error(`Error fetching details for userId: ${userId}`, error);
        }
      }
    }

    // Wait for all API requests to complete
    await Promise.all(requests);
    results.push(...(requests as any));
  },
}));
