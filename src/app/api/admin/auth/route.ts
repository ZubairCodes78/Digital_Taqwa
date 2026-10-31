import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_ADMIN_PASSWORD, createAdminToken, isAuthorizedAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== DEFAULT_ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    const token = createAdminToken();
    const response = NextResponse.json({ success: true, message: "Logged in successfully" });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "dt_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: "Authentication error" }, { status: 500 });
  }
}

export async function GET() {
  const authorized = await isAuthorizedAdmin();
  return NextResponse.json({ authenticated: authorized });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: "dt_admin_session",
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}

