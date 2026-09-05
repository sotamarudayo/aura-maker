"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import LanguageToggle from "@/components/LanguageToggle";
import { useLocale } from "@/components/LocaleProvider";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/utils/supabase/client";

type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "anonymous" }
  | { status: "linked" };

export default function Header() {
  const router = useRouter();
  const { t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [auth, setAuth] = useState<AuthState>({ status: "loading" });
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const isLoggedIn = auth.status === "anonymous" || auth.status === "linked";
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  async function handleLogout() {
    setLoggingOut(true);
    setMenuOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      return;
    }
    trackEvent("logout");
    router.push("/");
    router.refresh();
  }

  const navLinks = (
    <>
      <Link
        href="/auras"
        onClick={() => setMenuOpen(false)}
        className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
      >
        📖 {t.header.encyclopediaFull}
      </Link>
      <Link
        href="/blog"
        onClick={() => setMenuOpen(false)}
        className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
      >
        {t.header.blogFull}
      </Link>
      <Link
        href="/faq"
        onClick={() => setMenuOpen(false)}
        className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
      >
        {t.header.faqFull}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-3 sm:px-4">
        <Link
          href={logoHref}
          className="font-display flex min-w-0 shrink-0 items-center gap-2 text-xl text-white sm:gap-2.5 sm:text-2xl"
        >
          <BrandLogo size={28} priority />
          <span className="hidden min-[380px]:inline">AuraMaker</span>
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
          <LanguageToggle />

          {/* Desktop mid-nav: hide on narrow so auth never gets clipped */}
          <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

          {auth.status === "loading" ? (
            <span className="h-7 w-16 shrink-0 rounded-full bg-white/10" aria-hidden />
          ) : auth.status === "anonymous" ? (
            <>
              <Link
                href="/dashboard"
                className="shrink-0 whitespace-nowrap rounded-full border border-amber-300/50 bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-100 transition hover:bg-amber-500/30 sm:text-xs"
              >
                {t.header.guest}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/85 transition hover:bg-white/10 disabled:opacity-60 sm:text-xs"
              >
                {loggingOut ? "..." : t.header.logout}
              </button>
            </>
          ) : auth.status === "linked" ? (
            <>
              <Link
                href="/dashboard"
                className="shrink-0 whitespace-nowrap rounded-full border border-emerald-300/60 bg-emerald-400/90 px-2.5 py-1 text-[10px] font-bold text-black transition hover:bg-emerald-300 sm:text-xs"
              >
                {t.header.myPage}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/85 transition hover:bg-white/10 disabled:opacity-60 sm:text-xs"
              >
                {loggingOut ? "..." : t.header.logout}
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80 transition hover:bg-white/15 sm:text-xs"
            >
              {t.header.login}
            </Link>
          )}

          <div className="relative shrink-0 md:hidden" ref={menuRef}>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="header-mobile-menu"
              aria-label={t.header.menu}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/90 transition hover:bg-white/15"
            >
              <span aria-hidden className="flex flex-col gap-1">
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
                <span className="block h-0.5 w-3.5 rounded-full bg-current" />
              </span>
            </button>
            {menuOpen ? (
              <div
                id="header-mobile-menu"
                className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-white/15 bg-zinc-950/95 p-2 shadow-xl backdrop-blur"
              >
                <nav className="flex flex-col">{navLinks}</nav>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
