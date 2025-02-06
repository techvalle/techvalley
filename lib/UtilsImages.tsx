import { ID } from "react-native-appwrite";
import { appwriteConfig, storage } from "./config";

export interface UploadResponse {
  fileId: string;
  previewUrl: string;
}

// Function to convert image URI to Blob
export async function uriToBlob(uri: string): Promise<Blob> {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch URI: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Error converting URI to Blob:", error);
    throw new Error("Could not convert image URI to Blob.");
  }
}

// Function to get file preview URL
export async function getFilePreview(fileId: string): Promise<string> {
  try {
    const fileUrl = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId
    );

    if (!fileUrl) {
      throw new Error("File preview URL not found.");
    }

    return fileUrl.href; // Convert URL object to string
  } catch (error) {
    console.error("Error fetching file preview:", error);
    throw new Error("Could not retrieve file preview URL.");
  }
}

// Function to compress and upload image
export async function compressAndUploadImage(
  imageUri: string
): Promise<UploadResponse> {
  try {
    console.log("Starting image upload process...");

    // Convert the URI to Blob
    const imageBlob = await uriToBlob(imageUri);

    // Upload the Blob to Appwrite storage
    const fileResponse = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(), // Generate a unique ID for the file
      imageBlob
    );

    console.log("File upload response:", fileResponse);

    if (!fileResponse || !fileResponse.$id) {
      throw new Error("File upload response does not contain $id.");
    }

    // Fetch and return the file preview URL
    const previewUrl = await getFilePreview(fileResponse.$id);
    console.log("File preview URL:", previewUrl);

    return {
      fileId: fileResponse.$id,
      previewUrl,
    };
  } catch (error) {
    console.error("Error compressing and uploading image:", error);
    throw new Error("Image upload process failed.");
  }
}
