import { ID, Models, Query } from "react-native-appwrite";
import {
  account,
  appwriteConfig,
  avatars,
  databases,
  s3,
  storage,
} from "./config";
import {
  AppwriteUser,
  ChatDocument,
  Creator,
  Product,
  ProductDetails,
  ProductResponse,
  ProductViews,
  UserDocument,
  UserStatus,
  ViewDocument,
  UserStatusUpdateResponse,
  Message,
  Chat,
} from "@/types/appwriteTypes";
import {
  BanStatus,
  BanUserPayload,
  ProductDataprops,
  ReportUserPayload,
  UserDetails,
} from "@/types";
import { errorMessagesAPI } from "@/constants";
import uuid from "react-native-uuid";

// Function to get error message in the specified language
function getErrorMessage(errorKey: string, lang: string = "en"): any {
  return (
    errorMessagesAPI[lang]?.[errorKey] ||
    errorMessagesAPI["en"][errorKey] ||
    "Unknown error"
  );
}

// Transliteration map for Arabic to English
const transliterationMap: Record<string, string> = {
  ا: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  أ: "a",
  إ: "i",
  آ: "a",
  ؤ: "w",
  ئ: "y",
  ء: "",
  ى: "a",
  ة: "h",
  "ٓ": "",
  ٱ: "a",
  "ً": "",
  "ٌ": "",
  "ٍ": "",
  "َ": "a",
  "ُ": "u",
  "ِ": "i",
  "ّ": "",
  "ْ": "",
  "ٓ ": "",
  "؟": "?",
  "،": ",",
  "؛": ";",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

// Function to transliterate Arabic name to English
function transliterateArabicToEnglish(name: string): string {
  const isArabic = (char: string) =>
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(char);

  return name
    .split("")
    .map((char) => (isArabic(char) ? transliterationMap[char] || char : char))
    .join("")
    .replace(/\s+/g, ""); // Remove spaces
}

// Function to check if a username already exists
async function isUserNameExisting(userName: string): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("userName", userName)]
    );
    return response.documents.length > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
    return false; // Default to not existing on error
  }
}

export const deleteDocument = async (
  collectionId: string,
  documentId: string
): Promise<void> => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      collectionId,
      documentId
    );
  } catch (error: any) {
    // Add more context to the error message
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(
      `Failed to delete document with ID ${documentId} from collection ${collectionId}: ${errorMessage}`
    );
  }
};
// Function to generate a unique username
async function generateUniqueUserName(
  name: string,
  lang: string
): Promise<string> {
  const englishName = transliterateArabicToEnglish(name.trim());
  let uniqueName = `@${englishName}`;
  let counter = 1;

  while (await isUserNameExisting(uniqueName)) {
    uniqueName = `${uniqueName}${counter}`;
    counter++;
  }

  return uniqueName;
}

// Function to create a user account
export async function createUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  lang: string = "en"
): Promise<AppwriteUser> {
  try {
    // Step 1: Create the Appwrite account
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("failedToCreateUser");

    // Step 2: Generate a unique username and avatar
    const userName = await generateUniqueUserName(name, lang);
    const avatarUrl = avatars.getInitials(userName);

    // Step 3: Authenticate user session
    await account.createEmailPasswordSession(email, password);

    // Step 4: Construct user details
    const userDetails: UserDetails = {
      name: name,
      imageUrl: avatarUrl.href,
      Rates: "0",
      birthDay: "",
      gender: "",
      address: "",
      views: "0",
      password: password,
    };

    // Step 5: Create the user document in the database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      newAccount.$id,
      {
        userName,
        email,
        phone,
        Details: [JSON.stringify(userDetails)],
      }
    );

    return newUser as AppwriteUser; // Return as AppwriteUser type
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error creating user:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to retrieve user avatar and name
export async function getUserAvatarAndName(
  userId: string,
  lang: string = "en"
): Promise<{ userName: string; avatarUrl: string }> {
  try {
    const userDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    if (!userDocument || !userDocument.Details?.length) {
      throw new Error("userNotFound");
    }

    const details: UserDetails = JSON.parse(userDocument.Details[0]);
    const { name: userName, imageUrl: avatarUrl } = details;

    return { userName, avatarUrl };
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error fetching user details:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to check if a phone number exists
export async function isPhoneNumberExisting(
  phone: string,
  lang: string = "en"
): Promise<boolean> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("phone", phone)]
    );
    return response.documents.length > 0;
  } catch (error: any) {
    const errorMsg = getErrorMessage("phoneInUse", lang);
    console.error("Error checking phone number:", errorMsg);
    throw new Error(errorMsg);
  }
}

// Function to fetch chats for a user

export async function fetchUserChats(
  userId: string,
  lang: string = "en"
): Promise<any[]> {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    // Fetch chats where the user is the buyer
    const buyerChatsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      [
        Query.equal("buyerId", userId),
        Query.equal("visibility", userId), // Ensure user is in visibility array
      ]
    );

    // Fetch chats where the user is the product owner
    const ownerChatsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      [
        Query.equal("productOwnerId", userId),
        Query.equal("visibility", userId), // Ensure user is in visibility array
      ]
    );

    // Combine the results from both queries
    const combinedChats = [
      ...(buyerChatsResponse?.documents || []),
      ...(ownerChatsResponse?.documents || []),
    ];

    console.log("Combined Chats:", combinedChats); // Debug log

    // Handle self-chat scenario (user chatting with themselves)
    const selfChat = combinedChats.find(
      (chat) => chat.buyerId === userId && chat.productOwnerId === userId
    );

    if (selfChat) {
      console.log("Self Chat Found:", selfChat); // Debug log
      return [selfChat];
    }

    // If no chats are found, log an appropriate message
    if (combinedChats.length === 0) {
      console.warn("No chats found for user:", userId); // Debug log
      throw new Error("chatNotFound");
    }

    // Return the combined chats
    return combinedChats;
  } catch (error: any) {
    console.error("Error fetching user chats:", error.message); // Detailed debug log
    const errorMsg = getErrorMessage(error.message, lang); // Translate the error
    throw new Error(errorMsg);
  }
}

// Function to create a new chat
export async function createChat(
  buyerId: string,
  productOwnerId: string,
  productId: string,
  visibility: string[],
  lang: string = "en"
): Promise<ChatDocument> {
  try {
    // Create the new chat document in Appwrite
    const newChat = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      ID.unique(),
      { buyerId, productOwnerId, productId, visibility }
    );

    return newChat as ChatDocument; // Cast the result to the ChatDocument type
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToCreateChat", lang);
    console.error("Error creating chat:", errorMsg);
    throw new Error(errorMsg);
  }
}

// Define the expected structure of the user status document

export const checkUserStatus = async (userId: string): Promise<boolean> => {
  if (!userId) {
    console.error("Invalid userId provided to checkUserStatus.");
    return false;
  }

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      [Query.equal("userId", userId)]
    );

    if (!response.documents || response.documents.length === 0) {
      console.error(`User status not found for userId: ${userId}`);
      return false;
    }

    // Extract the first document and cast it to the UserStatus type
    const userStatus = response.documents[0] as UserStatus;

    // Parse the `lastActive` timestamp and calculate the time difference
    const lastActiveDate = new Date(userStatus.lastActive);
    const currentDate = new Date();
    const hoursDifference =
      (currentDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60); // Difference in hours

    // If the difference is more than 3 hours, consider the user offline
    if (hoursDifference > 3) {
      console.log(
        `User ${userId} is offline (last active more than 3 hours ago).`
      );
      return false;
    }

    console.log(`User ${userId} status:`, userStatus.status);

    return userStatus.status === "online";
  } catch (error) {
    console.error("Error checking user status:", error);
    return false;
  }
};
//..................................................//
// Function to check if an email exists in the database
export async function isEmailExisting(
  email: string,
  lang: string = "en"
): Promise<boolean> {
  try {
    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );
    return response.documents.length > 0; // Return true if email exists
  } catch (error) {
    const errorMsg = getErrorMessage("failedToCheckEmail", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to update phone number
export const updatePhoneNumber = async (
  phone: string,
  password: string,
  lang: string = "en"
): Promise<Models.User<Models.Preferences>> => {
  try {
    const result = await account.updatePhone(phone, password);
    return result;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToUpdatePhone", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

//..................................................//
// Function to sign in
export async function signIn(
  email: string,
  password: string,
  lang: string = "en"
): Promise<Models.Session> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSignIn", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to get email by phone number
export const getEmailByPhoneNumber = async (
  phone: string,
  lang: string = "en"
): Promise<string> => {
  try {
    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("phone", phone)]
    );

    if (response.documents.length > 0) {
      return response.documents[0].email;
    } else {
      throw new Error("userNotFound");
    }
  } catch (error: any) {
    const errorMsg = getErrorMessage(error.message, lang);
    console.error("Error fetching email by phone:", errorMsg);
    throw new Error(errorMsg);
  }
};

//..................................................//
// Function to get the current account details
export async function getAccount(): Promise<Models.User<Models.Preferences>> {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error: any) {
    console.error("Error fetching current account:", error.message);
    throw new Error("Failed to fetch current account.");
  }
}

//..................................................//
// Function to update user profile image
export const updateUserProfileImage = async (file: {
  name: string;
  mimeType: string;
  uri: string;
}): Promise<string> => {
  try {
    console.log("File to upload:", file);

    const asset = {
      name: file.name,
      type: file.mimeType,
      size: 4777,
      uri: file.uri,
    } as any;

    // Step 1: Upload the image to Appwrite storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    // Step 2: Generate and return the viewable URI of the uploaded file
    const fileUri = storage.getFileView(
      appwriteConfig.storageId,
      uploadedFile.$id
    );

    console.log("User profile image updated successfully! URI:", fileUri);
    return fileUri.href; // Return the file URL
  } catch (error: any) {
    console.error("Failed to update user profile image:", error.message);
    throw new Error("Failed to upload or update the profile image.");
  }
};

//..................................................//
// Function to sign out the current user
export async function signOut(): Promise<void> {
  try {
    await account.deleteSession("current");
    console.log("User signed out successfully.");
  } catch (error: any) {
    console.error("Error during sign-out:", error.message);
    throw new Error("Failed to sign out.");
  }
}

//..................................................//
// Function to get the current user from the database
export async function getCurrentUser(
  lang: string = "en"
): Promise<UserDocument | null> {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("failedToGetCurrentUser");

    const response = await databases.listDocuments<UserDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("$id", currentAccount.$id)]
    );

    return response?.documents[0] || null;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToGetCurrentUser", lang);
    console.error("Error fetching current user:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to send OTP to email
export async function sendOtpToEmail(
  email: string,
  lang: string = "en"
): Promise<Models.Token> {
  try {
    const response = await account.createEmailToken(ID.unique(), email);
    return response;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSendOTP", lang);
    console.error("Error sending OTP to email:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function verifyOtp(
  userId: string,
  secret: string
): Promise<Models.Session> {
  try {
    const response = await account.updateMagicURLSession(userId, secret);
    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error.message);
    throw new Error("Failed to verify OTP. Please try again.");
  }
}

//..................................................//
// Function to send OTP to phone
export async function sendOtpToPhone(
  phone: string,
  lang: string = "en"
): Promise<string> {
  try {
    const response = await account.createPhoneToken(ID.unique(), phone);
    return response.userId;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToSendOtpToPhone", lang);
    console.error("Error sending OTP to phone:", errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to verify OTP and reset password
export async function verifyOtpAndResetPassword(
  userId: string,
  otp: string,
  lang: string = "en"
): Promise<Models.Session> {
  try {
    const session = await account.createSession(userId, otp);
    return session;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error("Error verifying OTP and resetting password:", errorMsg);
    throw new Error(errorMsg);
  }
}

export async function sendPasswordRecoveryEmail(
  email: string,
  url: string
): Promise<void> {
  try {
    const d = await account.createRecovery(
      email,
      "https://your-app.com/recover"
    );

    console.log(`Password recovery email sent to ${email}`);
  } catch (error: any) {
    console.error("Error sending password recovery email:", error.message);
    throw new Error(
      "Failed to send password recovery email. Please try again."
    );
  }
}

// Function to update user status
export const updateUserStatus = async (
  userId: string,
  status: string
): Promise<UserStatusUpdateResponse | null> => {
  if (!userId || typeof status !== "string") {
    console.error("Invalid userId or status provided to updateUserStatus.");
    return null;
  }

  try {
    // Fetch user and ensure they exist
    const user = await fetchUserById(userId);
    if (!user) {
      console.error(`User not found for userId: ${userId}`);
      return null;
    }

    // Fetch or create user status document
    const userStatus = await fetchOrCreateUserStatus(userId, status);

    // Update status document
    const updatedStatus = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      userStatus.$id,
      {
        status,
        lastActive: new Date().toISOString(),
      }
    );

    console.log("User status updated:", updatedStatus);
    return updatedStatus as UserStatusUpdateResponse;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Failed to update user status");
  }
};

export async function completePasswordReset(
  userId?: any,
  secret?: any,
  newPassword?: string | null
): Promise<void> {
  if (!userId || !secret) {
    throw new Error("Missing required parameter for password reset.");
  }

  console.log("Starting password reset process...");
  console.log("Parameters:", { userId, secret, newPassword });

  try {
    // Attempt to complete the password reset
    console.log("Attempting to update recovery...");
    await account.updateMagicURLSession(userId, secret);
    console.log("Password reset successfully.");
  } catch (error: any) {
    console.error("Error completing password reset:", error.message);

    // Handle specific Appwrite errors
    if (error.message?.includes("Invalid secret")) {
      console.error("Invalid or expired secret key:", secret);
      throw new Error(
        "The secret key is invalid or has expired. Please request a new one."
      );
    }

    // Handle other unexpected errors
    if (error instanceof Error) {
      throw error;
    }

    // Default error handler
    throw new Error("Failed to reset password. Please try again.");
  }
}

export async function getUserIdByPhoneOrEmail(
  identifier: string,
  lang: string = "en"
): Promise<string | null> {
  try {
    // Determine the type of identifier (email or phone)
    const isEmail = identifier.includes("@");
    const fieldName = isEmail ? "email" : "phone";

    // Query the database
    const response = (await databases.listDocuments(
      appwriteConfig.databaseId, // Replace with your database ID
      appwriteConfig.usersCollectionId, // Replace with your users collection ID
      [Query.equal(fieldName, identifier)]
    )) as any;

    if (response.documents.length > 0) {
      return response.documents[0].$id; // Return the user ID
    }

    throw new Error(isEmail ? "emailNotFound" : "phoneNotFound");
  } catch (error) {
    console.error(
      `Failed to fetch userId by ${
        identifier.includes("@") ? "email" : "phone"
      }:`,
      error
    );
    return null;
  }
}

//..................................................//
// Function to reset the password
export async function ResetPasswordN(
  newPassword: string,
  oldPassword: string,
  lang: string = "en"
): Promise<Models.User<Models.Preferences>> {
  try {
    const response = await account.updatePassword(newPassword, oldPassword);
    return response;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error("Error resetting password:", errorMsg);
    throw new Error(errorMsg);
  }
}
// Helper Constants
const MS_IN_A_DAY = 24 * 60 * 60 * 1000;

//..................................................//
// Function to Send Password Reset Email
export async function sendPasswordResetEmail(
  email: string,
  lang: string = "en"
): Promise<void> {
  try {
    const resetUrl = "https://cloud.appwrite.io/v1"; // Replace with your actual reset link
    await account.createRecovery(email, resetUrl);
    console.log("Password reset email sent.");
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToResetPassword", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

//..................................................//
// Function to Update User Details
export const updateUser = async (
  details: UserDetails,
  userId: string,
  lang: string = "en"
): Promise<Models.Document> => {
  try {
    const updatedDetails = {
      name: details.name,
      imageUrl: details.imageUrl,
      Rates: details.Rates,
      birthDay: details.birthDay,
      gender: details.gender,
      address: details.address,
      views: details.views,
      password: details.password,
    };

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      { Details: [JSON.stringify(updatedDetails)] }
    );

    console.log("User updated successfully:", updatedUser);
    return updatedUser;
  } catch (error: any) {
    const errorMsg = getErrorMessage("failedToUpdateUserDetails", lang);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
};

// Helper: Fetch documents from Appwrite
const fetchDocuments = async <T>(
  databaseId: string,
  collectionId: string,
  query: string[]
): Promise<T[]> => {
  try {
    const response = await databases.listDocuments<any>(
      databaseId,
      collectionId,
      query
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    throw new Error("Error fetching data.");
  }
};

//..................................................//
// Function to Ban a User
export const banUser = async ({
  userId,
  reason,
  bannedBy,
}: BanUserPayload): Promise<{
  success: boolean;
  message: string;
  error?: any;
}> => {
  try {
    const existingBans = await fetchDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      [Query.equal("userId", userId), Query.equal("bannedBy", bannedBy)]
    );

    if (existingBans.length > 0) {
      return { success: false, message: "User is already banned." };
    }

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      ID.unique(),
      { userId, reason, bannedBy }
    );

    console.log("User banned successfully:", response);
    return { success: true, message: "User banned successfully." };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, message: "Failed to ban user.", error };
  }
};

//..................................................//
// Function to Report a User
export const reportUser = async ({
  reporterId,
  reportedUserId,
  reason,
  details,
}: ReportUserPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const reports = await fetchDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reportUser,
      [
        Query.equal("reporterId", reporterId),
        Query.equal("reportedUserId", reportedUserId),
      ]
    );

    const now = Date.now();
    const canReport = reports.every((report: any) => {
      const reportDate = new Date(report.$createdAt).getTime();
      return now - reportDate > 20 * MS_IN_A_DAY;
    });

    if (!canReport) {
      return {
        success: false,
        message: "You can only report this user once every 20 days.",
      };
    }

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reportUser,
      ID.unique(),
      { reporterId, reportedUserId, reason, details }
    );

    console.log("Report submitted successfully:", response);
    return { success: true, message: "Report submitted successfully." };
  } catch (error) {
    console.error("Failed to report user:", error);
    return { success: false, message: "Failed to report user." };
  }
};

//..................................................//
// Function to Fetch Ban Status
export const fetchBanStatus = async (
  userId: string,
  bannedBy: string
): Promise<BanStatus> => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.banUser,
      [Query.equal("userId", userId), Query.equal("bannedBy", bannedBy)]
    );

    if (!response.documents.length) {
      return { isBanned: false, reason: null };
    }

    const banDetails = response.documents[0];
    return {
      isBanned: true,
      reason: banDetails.reason || "No reason provided",
    };
  } catch (error) {
    console.error("Error fetching ban status:", error);
    return { isBanned: false, reason: null, error };
  }
};

//..................................................//
// Helper: Fetch User by ID
export const fetchUserById = async (
  userId: string
): Promise<Models.Document | null> => {
  const response = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("$id", userId)]
  );
  return response.documents[0] || null;
};

//..................................................//
// Helper: Fetch or Create User Status
export const fetchOrCreateUserStatus = async (
  userId: string,
  status: string
): Promise<UserStatus> => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      [Query.equal("userId", userId)]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as UserStatus; // Return existing status document
    }

    const newUserStatus = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userStatus,
      userId,
      { userId, status, lastActive: new Date().toISOString() }
    );

    return newUserStatus as UserStatus;
  } catch (error) {
    console.error("Error fetching/creating user status:", error);
    throw new Error("Failed to fetch or create user status.");
  }
};

// home page

// Parser for Creator
const parseCreatorDetails = (creator: any): Creator | null => {
  if (!creator) return null;
  try {
    const details = JSON.parse(creator.Details[0]);
    return {
      ...creator,
      Details: {
        name: details.name || "",
        imageUrl: details.imageUrl || "",
        Rates: details.Rates || "0",
        birthDay: details.birthDay || "",
        gender: details.gender || "",
        address: details.address || "",
        views: details.views || "0",
      },
    };
  } catch (error) {
    console.error("Error parsing creator details:", error);
    return null;
  }
};

// Parser for Product Details
const parseProductDetails = (details: string[]): ProductDetails => {
  try {
    const parsedDetails = JSON.parse(details[0]);
    return {
      salesName: parsedDetails.salesName || "",
      description: parsedDetails.description || "",
      selectedCity: parsedDetails.selectedCity || "",
      categories: parsedDetails.categories || {
        category1: "",
        category2: "",
        category3: "",
      },
      price: parsedDetails.price || "0",
      mainPhoto: parsedDetails.mainPhoto || "",
      descriptionPhotos: parsedDetails.descriptionPhotos || [],
    };
  } catch (error) {
    console.error("Error parsing product details:", error);
    return {
      salesName: "",
      description: "",
      selectedCity: "",
      categories: { category1: "", category2: "", category3: "" },
      price: "0",
      mainPhoto: "",
      descriptionPhotos: [],
    };
  }
};

// Parser for Product Views
const parseProductViews = (views: any): ProductViews | null => {
  if (!views) return null;
  try {
    return {
      ...views,
      view_count: views.view_count || 0,
      viewers: views.viewers || [],
    };
  } catch (error) {
    console.error("Error parsing product views:", error);
    return null;
  }
};

//..................................................//products

export async function recordView(
  userId: string,
  productId: string
): Promise<void> {
  if (!userId || !productId) {
    console.error("Invalid userId or productId provided to recordView.");
    return;
  }

  try {
    // Fetch the product document by productId
    const productResponse = await databases.listDocuments<ViewDocument>(
      appwriteConfig.databaseId,
      appwriteConfig.viewsCollectionId,
      [Query.equal("product_id", productId)]
    );

    const product = productResponse.documents[0];

    if (!product) {
      // No document exists, create a new one
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.viewsCollectionId,
        productId, // Use productId as the document ID
        {
          product_id: productId,
          viewers: [userId], // Add the user as the first viewer
          view_count: 1, // Initial view count
        }
      );
      console.log("New product document created successfully.");
      return;
    }

    // If the user has already viewed the product, no update is needed
    if (product.viewers.includes(userId)) {
      console.log("User already recorded as a viewer.");
      return;
    }

    // Update the document to add the new viewer and increment the view count
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.viewsCollectionId,
      product.$id,
      {
        viewers: [...product.viewers, userId], // Append the new viewer
        view_count: product.view_count + 1, // Increment the view count
      }
    );
    console.log("Viewer relationship updated successfully.");
  } catch (error: any) {
    // Handle network or unexpected errors
    if (error.code === 408 || error.code === 504) {
      console.error("Network error: Unable to reach the server.");
    } else {
      console.error(
        `Error recording view for userId: ${userId} and productId: ${productId}:`,
        error
      );
    }
    throw new Error("Failed to record the view. Please try again later.");
  }
}

export async function fetchAllProducts(
  lastSyncTime: string | null = null,
  offset: number = 0,
  retryCount: number = 3, // Maximum retries
  retryDelay: number = 1000 // Initial retry delay in milliseconds
): Promise<Product[]> {
  const limit = 10; // Number of products to fetch per request

  let attempt = 0;

  while (attempt <= retryCount) {
    try {
      const filters = lastSyncTime
        ? [Query.greaterThan("$updatedAt", lastSyncTime)]
        : [];

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.productsCollectionId,
        [
          Query.offset(offset),
          Query.limit(limit),
          Query.orderDesc("$createdAt"),
          ...filters,
        ]
      );

      const data = response as unknown as ProductResponse;

      // Map and parse fields for each product
      return data.documents.map(
        (product) =>
          ({
            ...product,
            creator: product.creator
              ? parseCreatorDetails(product.creator)
              : null,
            Details: parseProductDetails(product.Details as any),
            views: product.views ? parseProductViews(product.views) : null,
          } as Product as Product)
      );
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed to fetch products:`, error);

      if (attempt === 3) {
        return [];
      }

      // If retry limit is reached, throw the error
      if (attempt >= retryCount) {
        return [];
        throw new Error("Failed to fetch products after multiple attempts.");
      }

      // Increment the attempt and delay before retrying
      attempt++;
      await new Promise(
        (resolve) => setTimeout(resolve, retryDelay * attempt) // Exponential backoff
      );
    }
  }

  // If loop exits without success, return an empty array as a fallback
  return [];
}

interface SearchProductsResponse {
  documents: Product[];
}
export async function searchProducts(
  query: string,
  retryCount: number = 3, // Maximum retries
  retryDelay: number = 1000 // Initial retry delay in milliseconds
): Promise<Product[]> {
  // Edge case: Empty query string
  if (!query.trim()) {
    console.warn("Search query is empty. Returning an empty list.");
    return [];
  }

  let attempt = 0;

  while (attempt <= retryCount) {
    try {
      // Make the database query
      const posts: SearchProductsResponse | undefined =
        await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.productsCollectionId,
          [Query.search("name", query)]
        );

      // Validate the response structure
      const data = posts as unknown as ProductResponse;

      // Map and parse fields for each product
      return data.documents.map(
        (product) =>
          ({
            ...product,
            creator: product.creator
              ? parseCreatorDetails(product.creator)
              : null,
            Details: parseProductDetails(product.Details as any),
            views: product.views ? parseProductViews(product.views) : null,
          } as Product as Product)
      );
    } catch (error) {
      console.error(
        `Attempt ${
          attempt + 1
        } failed to search products with query "${query}":`,
        error
      );

      // If retry limit is reached, throw the error
      if (attempt >= retryCount) {
        throw new Error(
          `Failed to search products after ${retryCount} attempts. Please try again later.`
        );
      }

      // Increment the attempt and delay before retrying
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt)); // Exponential backoff
    }
  }

  // Return an empty array as fallback
  return [];
}

export async function fetchUserProductsDocument(
  accountId: string,
  lastSyncTime: string | null = null,
  offset: number = 0,
  limit: number = 2
): Promise<Product[]> {
  if (!accountId) {
    console.error("User ID is missing.");
    throw new Error("User ID is required to fetch products.");
  }

  try {
    const filters = [
      Query.offset(offset),
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
      Query.equal("creator", accountId), // Filter by user ID
    ];

    if (lastSyncTime) {
      filters.push(Query.greaterThan("$updatedAt", lastSyncTime));
    }

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      filters
    );

    const data = response as unknown as ProductResponse;

    return data.documents.map(
      (product) =>
        ({
          ...product,
          creator: product.creator
            ? parseCreatorDetails(product.creator)
            : null,
          Details: parseProductDetails(product.Details as any),
          views: product.views ? parseProductViews(product.views) : null,
        } as Product as Product)
    );
  } catch (error: any) {
    console.error("Failed to fetch user products data:", error.message);
    throw new Error(
      "Unable to fetch products. Please try again or check your connection."
    );
  }
}

// delete document

////....................................Image Logic..............................

export const deleteImageFromCloud = async (key: string): Promise<void> => {
  try {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: "thakim11", // Replace with your bucket name
      Key: key, // Key of the image to delete
    };

    await s3.deleteObject(params).promise();
    console.log(`Image ${key} deleted successfully.`);
  } catch (error: any) {
    console.error("Error deleting image from cloud:", error.message);

    throw new Error(
      `Image deletion failed for key: ${key}. Ensure the image exists and try again.`
    );
  }
};

// Function to delete multiple images from the cloud storage

export const deleteMultipleImagesFromCloud = async (
  keys: string[]
): Promise<void> => {
  try {
    // Use Promise.all to delete all images concurrently
    await Promise.all(keys.map((key) => deleteImageFromCloud(key)));

    console.log("All images deleted successfully.");
  } catch (error: any) {
    console.error("Error deleting multiple images from cloud:", error.message);

    throw new Error(
      "One or more images could not be deleted. Please try again."
    );
  }
};

// Function to extract the key from a full URL for deletion purposes
export const extractKeyFromUrl = (url: string): string => {
  try {
    // Base URL should match the format you provided
    const baseUrl = "https://y4m5.c01.e2-14.dev/thakim11/";

    if (!url.startsWith(baseUrl)) {
      throw new Error("The provided URL does not match the expected base URL.");
    }

    // Extract the key by removing the base URL part
    const key = url.replace(baseUrl, "");

    if (!key) {
      throw new Error("No key could be extracted from the provided URL.");
    }

    return key;
  } catch (error: any) {
    console.error("Error extracting key from URL:", error.message);
    throw new Error("Invalid URL format. Unable to extract image key.");
  }
};

type Language = "en" | "ar" | "fr";

const translations = {
  en: {
    errorCreating: "Error creating product. Please try again.",
  },
  ar: {
    errorCreating: "حدث خطأ أثناء إنشاء المنتج. يرجى المحاولة مرة أخرى.",
  },
  fr: {
    errorCreating: "Erreur lors de la création du produit. Veuillez réessayer.",
  },
};

export async function createView(
  userId: string,
  productId: string
): Promise<void> {
  if (!userId || !productId) {
    console.error("Invalid userId or productId provided to createView.");
    return;
  }

  console.log(
    "createView called with userId:",
    userId,
    "and productId:",
    productId
  );

  try {
    // Check if the product already exists in the views collection
    const productResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.viewsCollectionId,
      [Query.equal("product_id", productId)]
    );

    if (productResponse.documents.length === 0) {
      // Create a new document if no existing record is found
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.viewsCollectionId,
        productId, // Use productId as the document ID
        {
          product_id: productId,
          viewers: [userId], // Initialize with the first viewer
          userOwner: userId,
          view_count: 0, // Start with a view count of 0
        }
      );
      console.log("New product document created successfully.");
    } else {
      console.log("Product document already exists. No action taken.");
    }
  } catch (error) {
    console.error(
      `Error creating view record for userId: ${userId} and productId: ${productId}`,
      error
    );
    throw new Error(`Failed to create view record. Please try again later.`);
  }
}

export const createProduct = async (
  productData: ProductDataprops,
  userId: string,
  language: Language = "en"
): Promise<any> => {
  try {
    const {
      salesName,
      description,
      selectedCity,
      price,
      categories,
      mainPhoto,
      descriptionPhotos,
    } = productData;

    // Stringify details
    const details = JSON.stringify({
      salesName,
      description,
      selectedCity,
      categories,
      price,
      mainPhoto,
      descriptionPhotos,
    });

    // Generate unique document ID
    const documentId = ID.unique();

    // Create a view document for this product
    await createView(userId, documentId);

    // Create the product document in the database
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      documentId,
      {
        name: salesName,
        creator: userId,
        Details: [details],
        views: documentId,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(translations[language].errorCreating);
  }
};

export const updateProduct = async (
  productId: string,
  productData: ProductDataprops
): Promise<any> => {
  try {
    const {
      salesName,
      description,
      selectedCity,
      price,
      categories,
      mainPhoto,
      descriptionPhotos,
    } = productData;

    // Prepare the Details field
    const details = JSON.stringify({
      salesName,
      description,
      selectedCity,
      categories,
      price,
      mainPhoto,
      descriptionPhotos,
    });

    // Update the product in the database
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      productId,
      {
        name: salesName,
        Details: [details],
      }
    );

    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const uploadImageToCloud = async (
  uri: string,
  folder: string = "images/"
): Promise<string> => {
  try {
    // Fetch the image as a blob
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch the image. Status: ${response.status}`);
    }

    const blob = await response.blob();
    const fileName = `${uuid.v4()}.jpg`;

    const uploadParams = {
      Bucket: "thakim11",
      Key: `${folder}${fileName}`,
      Body: blob,
      ContentType: "image/jpeg",
    };

    // Upload the image to the cloud storage
    const uploadResult = await s3.upload(uploadParams).promise();

    console.log("Image uploaded successfully to:", uploadResult.Location);

    return uploadResult.Location; // Return the image URL
  } catch (error) {
    console.error("Error uploading image to cloud storage:", error);
    throw new Error("Failed to upload image. Please try again later.");
  }
};

//..................................................//massages

interface AppwriteResponse<T> {
  documents: T[]; // List of returned documents
}

export const fetchMessagesByChatId = async (
  chatId: string
): Promise<Message[]> => {
  if (!chatId) {
    throw new Error("chatId is required.");
  }

  try {
    const response: AppwriteResponse<Message> = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.messageCol,
      [Query.equal("chatId", chatId)]
    );
    return response.documents;
  } catch (error: any) {
    console.error(`Error fetching messages for chatId ${chatId}:`, error);
    throw new Error(
      `Failed to fetch messages for chatId ${chatId}: ${error.message || error}`
    );
  }
};

// Delete all messages with the same chatId
export const deleteAllMessagesByChatId = async (
  chatId: string,
  userId: string
): Promise<void> => {
  try {
    // Fetch the chat document
    const chat: Chat = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chatsCollectionId,
      chatId
    );

    if (!chat || !chat.visibility) {
      throw new Error("Chat not found or invalid chat structure");
    }

    // Remove the user from the chat's visibility array
    const updatedVisibility = chat.visibility.filter((id) => id !== userId);

    if (updatedVisibility.length === 0) {
      // If no users remain, fetch and delete all messages for the chat
      const messages: Message[] = await fetchMessagesByChatId(chatId);

      if (messages && messages.length > 0) {
        await Promise.all(
          messages.map((message) =>
            deleteDocument(appwriteConfig.messageCol, message.$id)
          )
        );
        console.log(`Deleted all messages for chatId: ${chatId}`);
      }

      // Delete the chat document
      await deleteDocument(appwriteConfig.chatsCollectionId, chatId);
      console.log(`Deleted chat for chatId: ${chatId}`);
    } else {
      // Update the chat's visibility
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.chatsCollectionId,
        chatId,
        { visibility: updatedVisibility }
      );

      console.log(
        `Updated chat visibility for chatId: ${chatId}, removed userId: ${userId}`
      );

      // Fetch all messages for the chat
      const messages: Message[] = await fetchMessagesByChatId(chatId);

      if (messages && messages.length > 0) {
        // Update message visibility for the user
        await Promise.all(
          messages.map(async (message) => {
            const updatedMessageVisibility = message.visibility.filter(
              (id) => id !== userId
            );

            if (updatedMessageVisibility.length === 0) {
              // If no users remain, delete the message
              await deleteDocument(appwriteConfig.messageCol, message.$id);
              console.log(`Deleted message with ID: ${message.$id}`);
            } else {
              // Otherwise, update the message visibility
              await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.messageCol,
                message.$id,
                { visibility: updatedMessageVisibility }
              );
              console.log(
                `Updated message visibility for messageId: ${message.$id}, removed userId: ${userId}`
              );
            }
          })
        );
      }
    }
  } catch (error: any) {
    console.error(`Error handling delete for chatId ${chatId}:`, error);
    throw new Error(
      `Error handling delete for chatId ${chatId}: ${error.message}`
    );
  }
};

// Define a type for the documents in the views collection

// Function to fetch unique product viewers for a given user
export const fetchProductViewers = async (
  userId: string
): Promise<string[]> => {
  if (!userId) {
    console.error("Invalid userId provided to fetchProductViewers.");
    throw new Error("User ID is required.");
  }

  try {
    // Fetch the product views by userOwner
    const productResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.viewsCollectionId,
      [Query.equal("userOwner", userId)]
    );

    // Collect unique viewer IDs from all documents
    const viewers = new Set<string>(); // Use Set to ensure uniqueness

    productResponse.documents.forEach((doc: any) => {
      if (Array.isArray(doc.viewers)) {
        doc.viewers.forEach((viewerId: any) => viewers.add(viewerId));
      }
    });

    // Convert the Set to an Array and return
    return Array.from(viewers) as string[];
  } catch (error) {
    console.error("Error fetching product viewers:", error);
    throw new Error("Failed to fetch product viewers. Please try again.");
  }
};
