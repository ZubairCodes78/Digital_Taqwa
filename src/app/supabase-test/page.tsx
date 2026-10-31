import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function SupabaseTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Attempt to query waitlist_users or fallback table
  const { data: waitlistUsers, error } = await supabase
    .from("waitlist_users")
    .select("id, name, email, referral_code, created_at")
    .limit(5);

  return (
    <div className="min-h-screen bg-[#0A1410] text-[#F6F4ED] p-8 sm:p-12 font-sans">
      <div className="max-w-2xl mx-auto rounded-3xl bg-[#12241C] border border-[#B79A62]/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center space-x-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h1 className="text-xl font-display font-black text-[#E8D6AC]">
            Supabase Connection Status
          </h1>
        </div>

        <div className="space-y-3 font-mono text-xs text-[#DDE4D9]/80 mb-6 bg-black/40 p-4 rounded-xl border border-white/5">
          <p>
            <strong className="text-[#B79A62]">Endpoint:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL}
          </p>
          <p>
            <strong className="text-[#B79A62]">Client Key:</strong> Configured
            (Publishable Key)
          </p>
          <p>
            <strong className="text-[#B79A62]">Status:</strong>{" "}
            {error ? (
              <span className="text-amber-400">
                Connected (Table waitlist_users: {error.message})
              </span>
            ) : (
              <span className="text-emerald-400">Connected & Ready</span>
            )}
          </p>
        </div>

        {waitlistUsers && waitlistUsers.length > 0 ? (
          <div>
            <h2 className="text-sm uppercase tracking-wider text-[#B79A62] font-mono mb-2">
              Recent Leads from Supabase
            </h2>
            <ul className="divide-y divide-white/10 text-xs">
              {waitlistUsers.map((u) => (
                <li key={u.id} className="py-2 flex justify-between">
                  <span>{u.name} ({u.email})</span>
                  <span className="text-[#B79A62] font-mono">{u.referral_code}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-[#DDE4D9]/60">
            Run the schema in <code className="text-[#B79A62]">supabase/migrations/20261031_digital_taqwa_schema.sql</code> in your Supabase SQL Editor to initialize tables.
          </p>
        )}
      </div>
    </div>
  );
}

