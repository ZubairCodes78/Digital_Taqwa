import { NextRequest, NextResponse } from "next/server";
import { completeWaitlistSchema } from "@/lib/validation";
import { createWaitlistUser } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

// Simple IP in-memory rate limiting
const ipRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimit.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimit.set(ip, { count: 1, resetAt: now + 60000 }); // 1 min window
    return true;
  }
  if (record.count >= 10) {
    return false; // Max 10 submissions per minute per IP
  }
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot check for bots
    if (body.website_url || body.honeypot) {
      return NextResponse.json(
        { error: "Spam detected." },
        { status: 400 }
      );
    }

    const validatedData = completeWaitlistSchema.safeParse(body);
    if (!validatedData.success) {
      const errorMsg = validatedData.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Save lead to database
    const { user, verificationToken } = await createWaitlistUser(validatedData.data);

    // Send verification email
    const emailResult = await sendVerificationEmail({
      toEmail: user.email,
      name: user.name,
      verificationToken,
    });

    const origin = req.nextUrl.origin || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const referralLink = `${origin}/?ref=${user.referral_code}`;

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list! Please check your email to verify your spot.",
        user: {
          id: user.id,
          email: user.email,
          referral_code: user.referral_code,
          referral_link: referralLink,
        },
        devUrl: emailResult.devUrl, // Available in dev mode for 1-click verification testing
      },
      { status: 201 }
    );
  } catch (err: any) {
    if (err.code === "DUPLICATE_EMAIL") {
      return NextResponse.json(
        { error: "This email address is already registered on our early access waitlist." },
        { status: 409 }
      );
    }

    console.error("Waitlist registration error:", err);
    return NextResponse.json(
      { error: "Unable to process your registration at this time. Please try again." },
      { status: 500 }
    );
  }
}

