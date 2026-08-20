import type { CSSProperties } from "react";

type AuraPalette = {
  a: string;
  b: string;
  c: string;
};

type AuraBackgroundProps = {
  className?: string;
  palette?: AuraPalette;
  pulse?: boolean;
};

const DEFAULT_PALETTE: AuraPalette = {
  a: "#c084fc",
  b: "#67e8f9",
  c: "#fb7185",
};

export default function AuraBackground({
  className = "",
  palette = DEFAULT_PALETTE,
  pulse = false,
}: AuraBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-zinc-950 ${className}`}
      style={
        {
          "--aura-a": palette.a,
          "--aura-b": palette.b,
          "--aura-c": palette.c,
        } as CSSProperties
      }
    >
      <div className="aura-orb aura-orb-a" />
      <div className="aura-orb aura-orb-b" />
      <div className="aura-orb aura-orb-c" />
      {pulse ? <div className="aura-pulse-overlay" /> : null}
      <div className="absolute inset-0 bg-zinc-950/25" />
    </div>
  );
}
