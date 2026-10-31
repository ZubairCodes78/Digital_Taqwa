import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/adminAuth";
import { exportLeadsCSV } from "@/lib/db";

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const csvContent = await exportLeadsCSV();
    const filename = `digital-taqwa-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    console.error("CSV export error:", err);
    return NextResponse.json({ error: "Failed to generate CSV" }, { status: 500 });
  }
}

