import {
  Account,
  Avatars,
  Client,
  Databases,
  Storage,
} from "react-native-appwrite";
import AWS from "aws-sdk";

const EXPO_PUBLIC_APPWRITE_URL = "https://cloud.appwrite.io/v1";
const EXPO_PUBLIC_APPWRITE_PROJECT_ID = "66c055260027040997ae";
const EXPO_PUBLIC_APPWRITE_DATABASE_ID = "66c21054002451625415";
const EXPO_PUBLIC_PPWRITE_STORAGE_ID = "66e0064b0024b1cb76f5";
const EXPO_PUBLIC_PPWRITE_PLATFORM_COL = "com.tchakem12.app";
const EXPO_PUBLIC_PPWRITE_PRODUCT_COL = "66d0a6aa001bc37b2a08";
const EXPO_PUBLIC_APPWRITE_USERS_COL = "66c21069000151e3a2ff";
const EXPO_PUBLIC_PPWRITE_MESSAGE_COL = "66f685d90027c695b212";
const EXPO_PUBLIC_PPWRITE_CHAT_COL = "670bb34b002b53e59dd4";
const EXPO_PUBLIC_PPWRITE_VIEWS_COLLECTION_ID = "67459b08000346b890ae";
const EXPO_PUBLIC_PPWRITE_BANUSER_COL = "67487ea7002d02156e62";
const EXPO_PUBLIC_PPWRITE_REPORT_COL = "6748871700096a7161ad";
const EXPO_PUBLIC_APPWRITE_USER_STATE_ID = "674acc55003860548ed4";
const EXPO_PUBLIC_PPWRITE_LIKES_COL = "6738999b002fc4b3767c";
const EXPO_PUBLIC_IDRIVEe2_endpoint = "https://y4m5.c01.e2-14.dev";
const EXPO_PUBLIC_IDRIVEe2_accessKeyId = "m3lXpSdLJaqBVCizv8rG";
const EXPO_PUBLIC_IDRIVEe2_secretAccessKey =
  "GzIjOF8cv2tBMX9xb4UK1Rm0vA0biYmzkdiBu0TK";

// Define an interface for Appwrite configuration
interface AppwriteConfig {
  url: string;
  projectId: string;
  databaseId: string;
  platform: string;
  storageId: string;
  productsCollectionId: string;
  usersCollectionId: string;
  likesCollectionId: string;
  messageCol: string;
  chatsCollectionId: string;
  viewsCollectionId: string;
  reportUser: string;
  banUser: string;
  userStatus: string;
}

// Appwrite configuration with required environment variables
export const appwriteConfig: AppwriteConfig = {
  url: EXPO_PUBLIC_APPWRITE_URL || "",
  projectId: EXPO_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: EXPO_PUBLIC_APPWRITE_DATABASE_ID || "",
  platform: EXPO_PUBLIC_PPWRITE_PLATFORM_COL || "",
  storageId: EXPO_PUBLIC_PPWRITE_STORAGE_ID || "",
  productsCollectionId: EXPO_PUBLIC_PPWRITE_PRODUCT_COL || "",
  usersCollectionId: EXPO_PUBLIC_APPWRITE_USERS_COL || "",
  likesCollectionId: EXPO_PUBLIC_PPWRITE_LIKES_COL || "",
  messageCol: EXPO_PUBLIC_PPWRITE_MESSAGE_COL || "",
  chatsCollectionId: EXPO_PUBLIC_PPWRITE_CHAT_COL || "",
  viewsCollectionId: EXPO_PUBLIC_PPWRITE_VIEWS_COLLECTION_ID || "",
  reportUser: EXPO_PUBLIC_PPWRITE_REPORT_COL || "",
  banUser: EXPO_PUBLIC_PPWRITE_BANUSER_COL || "",
  userStatus: EXPO_PUBLIC_APPWRITE_USER_STATE_ID || "",
};

// S3 configuration interface
interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3ForcePathStyle: boolean;
}

// Configure S3 client for IDrive e2
export const s3 = new AWS.S3({
  endpoint: EXPO_PUBLIC_IDRIVEe2_endpoint || "",
  accessKeyId: EXPO_PUBLIC_IDRIVEe2_accessKeyId || "",
  secretAccessKey: EXPO_PUBLIC_IDRIVEe2_secretAccessKey || "",
  region: "Oregon", // Set your region
  s3ForcePathStyle: true, // Required for non-AWS S3 providers
} as S3Config);

// Initialize Appwrite Client
export const client = new Client();

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
