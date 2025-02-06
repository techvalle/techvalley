import * as Notifications from "expo-notifications"; // Expo Notifications
import { appwriteConfig, client } from "./config"; // Appwrite config

// Configure notification behavior globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Type for real-time subscription cleanup
type UnsubscribeFunction = () => void;

// Function to request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.warn("Notification permissions not granted.");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

// Function to show a notification
export const showNotification = async (
  title: string,
  body: string
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // Immediate notification
    });
  } catch (error) {
    console.error("Error showing notification:", error);
  }
};

// Function to initialize real-time notifications
export const initializeRealTimeNotifications = (
  userId: string
): UnsubscribeFunction | undefined => {
  if (!userId) {
    console.warn("User ID is required to initialize real-time notifications.");
    return;
  }

  const subscriptions: UnsubscribeFunction[] = [];

  // Subscribe to real-time updates for messages
  try {
    const messageSubscription = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messageCol}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const message = response.payload as {
            receiverId: string;
            body: string;
          };
          console.log("Message payload received:", message);
          if (message.receiverId === userId) {
            showNotification("New Message", message.body);
          }
        }
      }
    );
    subscriptions.push(messageSubscription);
  } catch (error) {
    console.error("Error subscribing to messages:", error);
  }

  // Subscribe to real-time updates for comments
  try {
    const commentSubscription = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatsCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const comment = response.payload as {
            productOwnerId: string;
            body: string;
          };
          console.log("Comment payload received:", comment);
          if (comment.productOwnerId === userId) {
            showNotification("New Comment", comment.body);
          }
        }
      }
    );
    subscriptions.push(commentSubscription);
  } catch (error) {
    console.error("Error subscribing to comments:", error);
  }

  // Return a cleanup function to unsubscribe from all subscriptions
  return () => {
    subscriptions.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error unsubscribing from notifications:", error);
      }
    });
  };
};
