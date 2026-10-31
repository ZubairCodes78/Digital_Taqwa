import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getAdminStats } from "@/lib/db";

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (err: any) {
    console.error("Failed to load admin stats:", err);
    return NextResponse.json({ error: "Failed to retrieve statistics" }, { status: 500 });
  }
}

