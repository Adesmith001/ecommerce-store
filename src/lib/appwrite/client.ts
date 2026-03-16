import { Account, Client, Databases, Storage } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

export function createAppwriteClient() {
  const client = new Client();

  if (appwriteConfig.endpoint && appwriteConfig.projectId) {
    client
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId);
  }

  return client;
}

export const appwriteClient = createAppwriteClient();
export const appwriteAccount = new Account(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
export const appwriteStorage = new Storage(appwriteClient);
