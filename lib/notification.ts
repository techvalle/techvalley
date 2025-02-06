import * as Notifications from "expo-notifications"; // For Expo
import { appwriteConfig, client } from "./config";
import { Message } from "@/types/appwriteTypes";

// Configure notification behavior globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Translations
const translations = {
  en: {
    permissionWarning: "Notification permissions not granted",
    newMessage: "New Message",
    newComment: "New Comment",
    errorRequestingPermissions: "Error requesting notification permissions",
    errorShowingNotification: "Error showing notification",
    errorSubscribingMessages: "Error subscribing to messages",
    errorSubscribingComments: "Error subscribing to comments",
    errorUnsubscribing: "Error unsubscribing",
    userIdRequired:
      "User ID is required to initialize real-time notifications.",
  },
  ar: {
    permissionWarning: "لم يتم منح أذونات الإشعارات",
    newMessage: "رسالة جديدة",
    newComment: "تعليق جديد",
    errorRequestingPermissions: "خطأ في طلب أذونات الإشعارات",
    errorShowingNotification: "خطأ في عرض الإشعار",
    errorSubscribingMessages: "خطأ في الاشتراك في الرسائل",
    errorSubscribingComments: "خطأ في الاشتراك في التعليقات",
    errorUnsubscribing: "خطأ في إلغاء الاشتراك",
    userIdRequired: "معرّف المستخدم مطلوب لتفعيل الإشعارات في الوقت الفعلي.",
  },
  fr: {
    permissionWarning:
      "Les autorisations de notification n'ont pas été accordées",
    newMessage: "Nouveau Message",
    newComment: "Nouveau Commentaire",
    errorRequestingPermissions:
      "Erreur lors de la demande des autorisations de notification",
    errorShowingNotification: "Erreur lors de l'affichage de la notification",
    errorSubscribingMessages: "Erreur lors de l'abonnement aux messages",
    errorSubscribingComments: "Erreur lors de l'abonnement aux commentaires",
    errorUnsubscribing: "Erreur lors de la désinscription",
    userIdRequired:
      "L'ID utilisateur est requis pour initialiser les notifications en temps réel.",
  },
};

// Function to get translated text
const getTranslation = (key: keyof (typeof translations)["ar"]) => {
  return translations["ar"][key];
};

// Function to request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("permissionWarning");
      return false;
    }
    return true;
  } catch (error) {
    console.log("errorRequestingPermissions");
    return false;
  }
};

// Function to show a notification
export const showNotification = async (
  title: string,
  body: string,
  lang: "en" | "ar" | "fr" = "en"
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // Immediate notification
    });
  } catch (error) {
    console.log("errorShowingNotification");
  }
};

// Type for unsubscribe function
type UnsubscribeFunction = () => void;

// Function to initialize real-time subscriptions
export const initializeRealTimeNotifications = (
  userId: string
): UnsubscribeFunction | undefined => {
  if (!userId) {
    console.error(getTranslation("userIdRequired"));
    return undefined;
  }

  const subscriptions: UnsubscribeFunction[] = [];

  // Subscribe to messages
  try {
    const messageSubscription = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messageCol}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const message = response.payload as Message;
          if (message.receiverId === userId) {
            showNotification(getTranslation("newMessage"), message.body);
          }
        }
      }
    );
    subscriptions.push(messageSubscription);
  } catch (error) {
    console.error(getTranslation("errorSubscribingMessages"), error);
  }

  // Subscribe to comments
  try {
    const commentSubscription = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.chatsCollectionId}.documents`,
      (response: any) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          const comment = response.payload as Message;
          if (
            comment.productOwnerId === userId &&
            comment.receiverId === userId
          ) {
            showNotification(getTranslation("newComment"), comment.body);
          } else {
            console.log("Comment not for this user");
          }
        }
      }
    );
    subscriptions.push(commentSubscription);
  } catch (error) {
    console.error(getTranslation("errorSubscribingComments"), error);
  }

  // Return a cleanup function to unsubscribe
  return () => {
    subscriptions.forEach((unsubscribe) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error(getTranslation("errorUnsubscribing"), error);
      }
    });
  };
};
