import type { CSSProperties, ReactNode } from "react";
import type { AuraLineage, AuraPalette } from "@/lib/constants/auras";
import AuraOrbStage from "@/components/AuraOrbStage";

type AuraSphereProps = {
  palette: AuraPalette;
  lineage?: AuraLineage;
  hasVotes?: boolean;
  awakened?: boolean;
  secret?: boolean;
  pulse?: boolean;
  evolutionMorphing?: boolean;
  morphFromPalette?: AuraPalette;
  className?: string;
  children?: ReactNode;
};

function paletteVars(palette: AuraPalette): CSSProperties {
  return {
    "--card-a": palette.a,
    "--card-b": palette.b,
    "--card-c": palette.c,
  } as CSSProperties;
}

function AuraSphereBody({
  palette,
  dormant = false,
  secret = false,
  awakened = false,
  className = "",
}: {
  palette: AuraPalette;
  dormant?: boolean;
  secret?: boolean;
  awakened?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`aura-sphere-body ${dormant ? "aura-sphere-dormant" : ""} ${secret ? "aura-sphere-secret-body" : ""} ${awakened ? "aura-sphere-awakened" : ""} ${className}`.trim()}
      style={paletteVars(palette)}
    >
      {!dormant && !secret ? (
        <>
          <div className="aura-sphere-swirl" aria-hidden />
          <div className="aura-sphere-swirl aura-sphere-swirl-alt" aria-hidden />
        </>
      ) : null}
      <div className="aura-sphere-glass" />
      <div className="aura-sphere-nucleus" aria-hidden />
      <div className="aura-sphere-rim" aria-hidden />
      {secret ? (
        <>
          <div className="aura-sphere-glitch" aria-hidden />
          <span className="aura-sphere-secret-mark" aria-hidden>
            ?
          </span>
        </>
      ) : null}
    </div>
  );
}

export default function AuraSphere({
  palette,
  lineage,
  hasVotes = true,
  awakened = false,
  secret = false,
  pulse = false,
  evolutionMorphing = false,
  morphFromPalette,
  className = "",
  children,
}: AuraSphereProps) {
  const dormant = !hasVotes && !secret;

  return (
    <AuraOrbStage
      lineage={lineage}
      className={`aura-sphere-stage ${className}`.trim()}
      style={paletteVars(palette)}
    >
      <div className={`aura-sphere-halo ${pulse ? "aura-sphere-halo-pulse" : ""}`} aria-hidden />
      <div className="aura-sphere-ring aura-sphere-ring-a" aria-hidden />
      <div className="aura-sphere-ring aura-sphere-ring-b" aria-hidden />

      {evolutionMorphing && morphFromPalette ? (
        <>
          <AuraSphereBody palette={morphFromPalette} className="aura-evolve-orb-from" />
          <AuraSphereBody palette={palette} awakened={awakened} className="aura-evolve-orb-to" />
        </>
      ) : (
        <AuraSphereBody
          palette={palette}
          dormant={dormant}
          secret={secret}
          awakened={awakened}
        />
      )}

      {children}
    </AuraOrbStage>
  );
}

export function AuraSphereCompact({
  palette,
  lineage,
  secret = false,
  className = "",
}: {
  palette: AuraPalette;
  lineage?: AuraLineage;
  secret?: boolean;
  className?: string;
}) {
  return (
    <AuraSphere
      palette={palette}
      lineage={lineage}
      hasVotes={!secret}
      secret={secret}
      className={`aura-sphere-compact ${className}`.trim()}
    />
  );
}
