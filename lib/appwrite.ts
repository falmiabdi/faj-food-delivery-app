import { AuthResponse, CreateUserParams, SignInParams, User } from "@/type.d";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query
} from "react-native-appwrite";

// Configuration
export const appwriteconfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  name: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME || "Food Delivery",
  databaseId: "69b879d8002fba4910e1",
  userCollectionId: "user",
  platform: "com.faj.food-delivery",
};

// Initialize Client
export const client = new Client();

client
  .setEndpoint(appwriteconfig.endpoint)
  .setProject(appwriteconfig.projectId)
  .setPlatform(appwriteconfig.platform);

// Initialize Services
export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);

// CLEAR EXISTING SESSIONS
export const clearExistingSessions = async () => {
  try {
    const currentSession = await account.getSession("current");
    if (currentSession) {
      await account.deleteSession("current");
    }
    return true;
  } catch (error) {
    return true;
  }
};

// CREATE USER
export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams): Promise<User> => {
  try {
    // Step 1: Create account in Appwrite Auth
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Failed to create account");

    // Step 2: Create user document with avatar
    const userData = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      },
    );

    return userData as unknown as User;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// SIGN IN
export const signIn = async ({
  email,
  password,
}: SignInParams): Promise<AuthResponse> => {
  try {
    // Clear any existing session first
    await clearExistingSessions();

    // Create new session
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) throw new Error("Failed to create session");

    // Get current user
    const currentAccount = await account.get();

    // Get user document from database
    const userDocument = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("email", email)],
    );

    let user: User;

    if (userDocument.documents.length > 0) {
      user = userDocument.documents[0] as unknown as User;
    } else {
      // Create user document if it doesn't exist (fallback)
      user = (await databases.createDocument(
        appwriteconfig.databaseId,
        appwriteconfig.userCollectionId,
        ID.unique(),
        {
          name: currentAccount.name,
          email: currentAccount.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAccount.name || "User")}&background=random`,
        },
      )) as unknown as User;
    }

    return {
      session,
      user,
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// GET CURRENT USER
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get the current account from Appwrite Auth
    const currentAccount = await account.get();

    if (!currentAccount) throw new Error("No user logged in");

    // Get the user document from your database
    const userDocument = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("email", currentAccount.email)],
    );

    // If user document exists, return it
    if (userDocument.documents.length > 0) {
      return userDocument.documents[0] as unknown as User;
    }

    // Create user document if it doesn't exist (fallback)
    const newUser = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        name: currentAccount.name || "User",
        email: currentAccount.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAccount.name || "User")}&background=random`,
      },
    );

    return newUser as unknown as User;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// SIGN OUT
export const signOut = async () => {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// CHECK AUTHENTICATION
export const isAuthenticated = async () => {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
};
