import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local" });

import express from "express";
import { MongoClient, type Collection } from "mongodb";
import cors from "cors";

const app = express();
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 3001;

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Defina MONGODB_URI no .env ou .env.local");
  process.exit(1);
}
const MONGODB_DB = process.env.MONGODB_DB || "hoomly";
const APARTMENTS_COLLECTION = "apartments";

app.use(cors());
app.use(express.json());

let apartmentsCollection: Collection | null = null;

async function connectDb(): Promise<Collection> {
  if (apartmentsCollection) return apartmentsCollection;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  apartmentsCollection = db.collection(APARTMENTS_COLLECTION);
  return apartmentsCollection;
}

/** GET /api/apartments - list all apartments from MongoDB */
app.get("/api/apartments", async (_req, res) => {
  try {
    const collection = await connectDb();
    const cursor = collection.find({}).sort({ _id: 1 });
    const list = await cursor.toArray();
    const apartments = list.map((doc) => {
      const { _id, ...rest } = doc as { _id: unknown; [key: string]: unknown };
      return { id: String(_id), ...rest };
    });
    res.json(apartments);
  } catch (err) {
    console.error("GET /api/apartments error:", err);
    res.status(500).json({
      error: "Erro ao buscar imóveis",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

/** Health check for API */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "hoomly-api" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`  GET /api/health`);
  console.log(`  GET /api/apartments`);
});
