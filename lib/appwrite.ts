// lib/appwrite.ts
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";
import { CreateUserParams, SignInParams, } from "@/type.d";

// Configuration
export const appwriteconfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  name: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME || 'Food Delivery',
  databaseId: '69b879d8002fba4910e1',
  userCollectionId: 'user',
  platform: "com.faj.food-delivery"
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

// ============================================
// FIXED CREATE USER (Correct Order)
// ============================================
export const createUser = async ({ email, password, name,  }: CreateUserParams) => {
  try {
    // Step 1: Create account in Appwrite
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      name || email.split('@')[0]
    );

    if (!newAccount) throw new Error('Failed to create account');

    // Step 2: Create user document in database (BEFORE sign in)
    const userData = await databases.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        name: name || email.split('@')[0],
        avatar: avatars.getInitials(name || email.split('@')[0]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );

    // Step 3: Sign in after document is created
    await signIn({ email, password });

    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// ============================================
// FIXED SIGN IN (Better error handling)
// ============================================
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Create email/password session
    const session = await account.createEmailPasswordSession(email, password);
    
    if (!session) throw new Error('Failed to create session');

    // Get current user data
    const currentAccount = await account.get();
    
    // Get user document from database
    const userDocument = await databases.listDocuments(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    // Find user by accountId
    const user = userDocument.documents[0];

    return {
      session,
      user: user || {
        $id: currentAccount.$id,
        email: currentAccount.email,
        name: currentAccount.name,
        accountId: currentAccount.$id
      }
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};



// ============================================
// FIXED SIGN OUT
// ============================================
export const signOut = async () => {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// ============================================
// FIXED IS AUTHENTICATED
// ============================================
export const isAuthenticated = async () => {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
};