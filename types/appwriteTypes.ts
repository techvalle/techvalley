import { Models } from "react-native-appwrite"; // Use Appwrite SDK types if available

// Base interface for an Appwrite document
export interface AppwriteDocument extends Models.Document {
  $id: string;
  $collectionId: string;
  $createdAt: string;
  $updatedAt: string;
  $databaseId: string;
  $permissions: string[];
}

// Relationship for products and liked items
export interface ProductRelation extends AppwriteDocument {
  name: string; // Name of the product
  price: number; // Price of the product
  description: string; // Description of the product
  imageUrl: string; // Image URL for the product
}

// Relationship for likes
export interface LikeRelation extends AppwriteDocument {
  productId: string; // The ID of the liked product
  userId: string; // The ID of the user who liked the product
}

// Appwrite User Document
export interface AppwriteUser extends AppwriteDocument {
  email: string; // User's email
  userName: string; // User's username
  phone: string; // User's phone number
  Details: string[]; // Details as a JSON string array
  products: ProductRelation[]; // Relationship with products
  liked: LikeRelation[]; // Relationship with liked products
}

// Chat Document interface
export interface ChatDocument extends AppwriteDocument {
  productId: string; // ID of the associated product
  buyerId: string; // User ID of the buyer
  productOwnerId: string; // User ID of the product owner
  messages?: string[]; // Relationship to message IDs
  visibility: string[]; // Array of user IDs who can see the chat
}

// User Document interface
export interface UserDocument extends AppwriteDocument {
  userName: string; // Username
  email: string; // User's email
  phone: string; // User's phone
  Details: string[]; // User details as a JSON array
}

// User Status interface
export interface UserStatus extends AppwriteDocument {
  userId: string; // ID of the user
  status: string; // Status of the user (e.g., online, offline)
  lastActive: string; // Timestamp of the user's last activity
}

// User Status Update Response
export interface UserStatusUpdateResponse extends AppwriteDocument {
  userId: string; // ID of the user whose status was updated
  status: string; // Updated status
  lastActive: string; // Updated last active timestamp
}

// User Details interface
export interface UserDetails {
  name: string; // User's name
  imageUrl: string; // URL to the user's profile image
  Rates: string; // Rating for the user
  birthDay: string; // User's birthday
  gender: string; // User's gender
  address: string; // User's address
  views: string; // View count for the user
}

// Product Creator interface
export interface Creator extends AppwriteDocument {
  email: string; // Creator's email
  phone: string; // Creator's phone number
  userName: string; // Creator's username
  liked: string | null; // Whether the creator has liked the product
  Details: UserDetails; // Parsed user details
}

// Product Categories interface
export interface ProductCategories {
  category1: string; // Primary category
  category2: string; // Secondary category
  category3?: string; // Optional tertiary category
}

// Product Details interface
export interface ProductDetails {
  salesName: string; // Name of the product
  description: string; // Description of the product
  selectedCity: string; // City related to the product
  categories: ProductCategories; // Product categories
  price: string; // Price of the product
  mainPhoto: string; // Main photo URL
  descriptionPhotos: string[]; // Array of additional image URLs
}

// Product Views interface
export interface ProductViews extends AppwriteDocument {
  product_id: string; // ID of the associated product
  userOwner: string; // Owner of the views record
  view_count: number; // Total view count
  viewers: AppwriteUser[]; // Array of users who viewed the product
}

// Product interface
export interface Product extends AppwriteDocument {
  name: string; // Name of the product
  view_count: string | null; // Total views count (nullable)
  views: ProductViews; // Product views record
  Details: ProductDetails; // Product details
  creator: Creator | null; // Relationship to the product's creator
  likes: { userId: string; likedAt: string }[]; // Array of likes
  productMessages: { message: string; senderId: string; sentAt: string }[]; // Array of product messages
}

// API Response type for Product
export interface ProductResponse {
  documents: Product[]; // Array of products
  total: number; // Total count of products
}

export interface ViewDocument extends AppwriteDocument {
  product_id: string; // ID of the product
  viewers: string[]; // Array of related viewer IDs (relationship field)
  view_count: number; // Total number of views
  userOwner: string; // The owner of the product
}

// Define the structure of a Message
export interface Message extends AppwriteDocument {
  body: string; // Message content
  chatId: string; // Chat ID the message belongs to
  userId: string; // User ID of the sender
  chats: string; // Relationship with chats
  visibility: string[]; // Array of visibility options
  receiverId: string; // User ID of the receiver
  createdAt?: string; // Creation timestamp
}

// Define Chat and Message Interfaces
export interface Chat extends AppwriteDocument {
  $id: string;
  productId: string;
  buyerId: string;
  productOwnerId: string;
  visibility: string[];
  [key: string]: any; // For additional fields
}
