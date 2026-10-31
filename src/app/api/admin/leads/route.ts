import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { getLeads } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") || undefined;
  const country = searchParams.get("country") || undefined;
  const verified = searchParams.get("verified") || undefined;
  const feature = searchParams.get("feature") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "15", 10);

  try {
    const result = await getLeads({
      search,
      country,
      verified,
      feature,
      page,
      limit,
    });
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Failed to fetch leads:", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

