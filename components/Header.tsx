import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

type HeaderProps = {
  isLoggedIn: boolean;
  isAnonymous: boolean;
};

export default function Header({ isLoggedIn, isAnonymous }: HeaderProps) {
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href={logoHref} className="flex shrink-0 items-center gap-2.5 text-lg font-black tracking-tight text-white">
          <BrandLogo size={28} />
          AuraMaker
        </Link>

        <nav className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/auras"
            className="rounded-full px-2.5 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 sm:px-3 sm:text-sm"
          >
            📖 オーラ図鑑
          </Link>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-full px-2.5 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10 sm:px-3 sm:text-sm"
          >
            📊 マイオーラ
          </Link>

          {isLoggedIn ? (
            isAnonymous ? (
              <span className="shrink-0 rounded-full border border-amber-300/50 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-100 sm:px-2.5 sm:text-xs">
                ゲスト
              </span>
            ) : (
              <span className="shrink-0 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-100 sm:px-2.5 sm:text-xs">
                連携済み
              </span>
            )
          ) : (
            <Link
              href="/login"
              className="shrink-0 rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80 sm:px-2.5 sm:text-xs"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
