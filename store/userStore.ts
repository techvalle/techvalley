import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser, signOut, updateUserStatus } from "../lib/api";
import { appwriteConfig, databases } from "../lib/config";

interface UserDetails {
  views?: string;
  Rates?: string;
  name?: string;
  birthDay?: string;
  gender?: string;
  address?: string;
  imageUrl?: string;
  password?: string;
}

interface User {
  $id: string;
  email: string;
  phone: string;
  city: string;
  userName: string;
  Details?: UserDetails;
}

interface UserStore {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  views: number;
  rates: number;
  language: "ar" | "en" | "fr";
  error: string | null;

  // Functions
  setLanguage: (lang: string) => void;
  fetchBasicUserData: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserViews: (newViews: number) => void;
  updateUserCity: (newCity: string) => Promise<void>;
  updateUserData: (updatedData: Partial<UserDetails>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (message: string | null) => void;
}

// Error messages
const errorMessages: Record<string, string> = {
  FETCH_USER_ERROR: "Failed to fetch user data.",
  SIGNOUT_ERROR: "Error signing out.",
  UPDATE_USER_ERROR: "Error updating user data.",
};

// Helper function for managing loading and errors
const withLoadingAndError = async (
  callback: () => Promise<void>,
  set: (state: Partial<UserStore>) => void
) => {
  set({ loading: true, error: null });
  try {
    await callback();
  } catch (error: any) {
    console.error(error);
    set({ error: error.message || "An unexpected error occurred." });
  } finally {
    set({ loading: false });
  }
};

// Zustand Store
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      isLogged: false,
      user: null,
      loading: false,
      views: 0,
      rates: 0,
      language: "en",
      error: null,
      password: "",

      // Generic Loading State Handler
      setLoading: (loading) => set({ loading }),

      // Generic Error Handler
      setError: (message) => set({ error: message }),

      // Set Language
      setLanguage: (lang: any) => set({ language: lang }),

      // Fetch Basic User Data
      fetchBasicUserData: async () => {
        await withLoadingAndError(async () => {
          const currentUser = await getCurrentUser();
          if (!currentUser) {
            set({ user: null, isLogged: false });
            return;
          }

          const parsedDetails = currentUser.Details
            ? JSON.parse(currentUser.Details[0] || "{}")
            : {};

          set({
            user: {
              $id: currentUser.$id,
              email: currentUser.email,
              phone: currentUser.phone,
              userName: currentUser.userName,
              city: currentUser.city || "", // Add city here

              Details: parsedDetails,
            },
            isLogged: true,
          });

          await updateUserStatus(currentUser.$id, "online");
        }, set);
      },

      // Fetch User Details
      fetchUserDetails: async () => {
        await withLoadingAndError(async () => {
          const user = get().user;
          if (!user || !user.$id) return;

          const response = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.$id
          );

          const parsedDetails = response.Details
            ? JSON.parse(response.Details[0] || "{}")
            : {};

          set((state: any) => ({
            user: { ...state.user, Details: parsedDetails },
          }));
        }, set);
      },

      // Sign Out User
      signOutUser: async () => {
        await withLoadingAndError(async () => {
          const user = get().user;
          if (!user) return;

          await updateUserStatus(user.$id, "offline");
          await signOut();

          set({
            user: null,
            isLogged: false,
            views: 0,
            rates: 0,
          });
        }, set);
      },

      updateUserCity: async (newCity: string) => {
        if (!newCity) {
          get().setError("City cannot be empty.");
          return;
        }

        await withLoadingAndError(async () => {
          const user = get().user;
          if (!user || !user.$id) return;

          // Update the city in the database
          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.$id,
            { City: newCity }
          );

          // Update the local state
          set((state: any) => ({
            user: { ...state.user, city: newCity },
          }));
        }, set);
      },

      // Update User Views
      updateUserViews: (newViews: number) => {
        const user = get().user;
        if (!user || !user.$id) return;

        set((state: any) => ({
          views: newViews,
          user: {
            ...state.user,
            Details: {
              ...(state.user?.Details || {}),
              views: newViews?.toString(),
            },
          },
        }));
      },

      // Update User Data
      updateUserData: async (updatedData: Partial<UserDetails>) => {
        if (!updatedData || typeof updatedData !== "object") {
          get().setError("Invalid data provided.");
          return;
        }

        await withLoadingAndError(async () => {
          const user = get().user;
          if (!user || !user.$id) return;

          const updatedDetails = {
            ...(user.Details || {}),
            ...updatedData,
          };

          // Update the database document
          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.$id,
            { Details: [JSON.stringify(updatedDetails)] }
          );

          // Update the Zustand state
          set((state: any) => ({
            user: { ...state.user, Details: updatedDetails },
          }));
        }, set);
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
    }
  )
);
