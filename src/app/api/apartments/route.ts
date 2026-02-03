import { NextResponse } from "next/server";
import { getApartmentsCollection } from "@/lib/mongodb";

/**
 * GET /api/apartments
 * Returns all documents from the MongoDB "apartments" collection (database: hoomly).
 * Requires MONGODB_URI in .env or .env.local.
 */
export async function GET() {
  try {
    const collection = await getApartmentsCollection();
    const cursor = collection.find({}).sort({ _id: 1 });
    const list = await cursor.toArray();
    const apartments = list.map((doc) => {
      const { _id, ...rest } = doc as { _id: unknown; [key: string]: unknown };
      return { id: String(_id), ...rest };
    });
    return NextResponse.json(apartments);
  } catch (err) {
    console.error("GET /api/apartments error:", err);
    return NextResponse.json(
      {
        error: "Erro ao buscar imóveis",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
