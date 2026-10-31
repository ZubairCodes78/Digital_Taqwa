import { cookies } from "next/headers";

const ADMIN_SESSION_KEY = "dt_admin_session";
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Taqwa2026!Admin";

export async function isAuthorizedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_KEY)?.value;

  if (!session) return false;

  // Simple token matching
  return session === "authenticated_" + Buffer.from(DEFAULT_ADMIN_PASSWORD).toString("base64").slice(0, 16);
}

export function createAdminToken(): string {
  return "authenticated_" + Buffer.from(DEFAULT_ADMIN_PASSWORD).toString("base64").slice(0, 16);
}

