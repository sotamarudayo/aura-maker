import type { AuraPalette } from "@/lib/constants/auras";

type AuraSpiralFilamentsProps = {
  palette: AuraPalette;
  idPrefix?: string;
  className?: string;
};

/** 3本スパイラル — 各腕を palette.a / b / c の純色で分離 */
export default function AuraSpiralFilaments({
  palette,
  idPrefix = "orb",
  className = "",
}: AuraSpiralFilamentsProps) {
  const gid = (name: string) => `${idPrefix}-${name}`;

  return (
    <svg
      className={`aura-sphere-filaments ${className}`.trim()}
      viewBox="0 0 100 100"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid("g1")} x1="50" y1="50" x2="88" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="22%" stopColor={palette.a} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.a} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={gid("g2")} x1="50" y1="50" x2="16" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="25%" stopColor={palette.b} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.b} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={gid("g3")} x1="50" y1="50" x2="82" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.88" />
          <stop offset="28%" stopColor={palette.c} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.c} stopOpacity="0.32" />
        </linearGradient>
        <filter id={gid("glow")} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={gid("clip")}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${gid("clip")})`} filter={`url(#${gid("glow")})`}>
        <path
          d="M50 50 C49 36 62 18 78 26 C90 32 88 48 50 50"
          stroke={`url(#${gid("g1")})`}
          strokeWidth="4.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 50 C38 51 20 64 28 78 C34 90 48 88 50 50"
          stroke={`url(#${gid("g2")})`}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 50 C64 49 82 62 74 76 C68 88 52 86 50 50"
          stroke={`url(#${gid("g3")})`}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
