import { MongoClient, type Collection } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "hoomly";
const APARTMENTS_COLLECTION = "apartments";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClient(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }
  global._mongoClientPromise = new MongoClient(MONGODB_URI).connect();
  return global._mongoClientPromise;
}

export async function getApartmentsCollection(): Promise<Collection> {
  const client = await getClient();
  return client.db(MONGODB_DB).collection(APARTMENTS_COLLECTION);
}
