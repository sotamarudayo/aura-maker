"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/client";

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "anonymous" }
  | { status: "linked" };

export default function Header() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function syncUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setAuth({ status: "guest" });
        return;
      }
      setAuth({ status: user.is_anonymous ? "anonymous" : "linked" });
    }

    void syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        setAuth({ status: "guest" });
        return;
      }
      setAuth({ status: user.is_anonymous ? "anonymous" : "linked" });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isLoggedIn = auth.status === "anonymous" || auth.status === "linked";
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      return;
    }
    trackEvent("logout");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link
          href={logoHref}
          className="font-display flex shrink-0 items-center gap-2 text-xl text-white sm:gap-2.5 sm:text-2xl"
        >
          <BrandLogo size={28} priority />
          <span className="hidden min-[380px]:inline">AuraMaker</span>
        </Link>

        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/auras"
            className="whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 sm:px-3 sm:text-sm"
          >
            <span className="sm:hidden">📖 図鑑</span>
            <span className="hidden sm:inline">📖 オーラ図鑑</span>
          </Link>

          {auth.status === "loading" ? (
            <span className="h-7 w-16 shrink-0 rounded-full bg-white/10" aria-hidden />
          ) : auth.status === "anonymous" ? (
            <>
              <Link
                href="/dashboard"
                className="shrink-0 whitespace-nowrap rounded-full border border-amber-300/50 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-100 transition hover:bg-amber-500/30 sm:text-xs"
              >
                ゲスト
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-60 sm:text-xs"
              >
                {loggingOut ? "..." : "ログアウト"}
              </button>
            </>
          ) : auth.status === "linked" ? (
            <>
              <Link
                href="/dashboard"
                className="shrink-0 whitespace-nowrap rounded-full border border-emerald-300/60 bg-emerald-400/90 px-2.5 py-1 text-[10px] font-bold text-black transition hover:bg-emerald-300 sm:text-xs"
              >
                マイページ
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-60 sm:text-xs"
              >
                {loggingOut ? "..." : "ログアウト"}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80 transition hover:bg-white/15 sm:text-xs"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
