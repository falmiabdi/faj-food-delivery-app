import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
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

// CREATE USER
export const createUser = async ({ email, password, name }: any) => {
  try {
    // Step 1: Create account in Appwrite Auth
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error("Failed to create account");

    // Step 2: Create user document in database
    const userData = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        name: name,
        avatar: avatars.getInitials(name),
      },
    );

    return userData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// SIGN IN
export const signIn = async ({ email, password }: any) => {
  try {
    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) throw new Error("Failed to create session");

    // Get current user
    const currentAccount = await account.get();

    // Get user document from database
    const userDocument = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    const user = userDocument.documents[0];

    return {
      session,
      user: user || {
        $id: currentAccount.$id,
        email: currentAccount.email,
        name: currentAccount.name,
        accountId: currentAccount.$id,
      },
    };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
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
