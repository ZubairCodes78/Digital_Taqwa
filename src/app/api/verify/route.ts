import { NextRequest, NextResponse } from "next/server";
import { verifyUserEmail } from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, error: "Missing verification token" }, { status: 400 });
  }

  const result = await verifyUserEmail(token);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    email: result.email,
  });
}

