import type { CSSProperties, ReactNode } from "react";
import type { AuraLineage, AuraPalette } from "@/lib/constants/auras";
import AuraOrbStage from "@/components/AuraOrbStage";
import AuraSpiralFilaments from "@/components/AuraSpiralFilaments";

type AuraSphereProps = {
  palette: AuraPalette;
  auraId?: string;
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
  auraId,
  dormant = false,
  secret = false,
  awakened = false,
  className = "",
}: {
  palette: AuraPalette;
  auraId?: string;
  dormant?: boolean;
  secret?: boolean;
  awakened?: boolean;
  className?: string;
}) {
  const filamentId = auraId ?? "orb";

  return (
    <div
      className={`aura-sphere-body ${dormant ? "aura-sphere-dormant" : ""} ${secret ? "aura-sphere-secret-body" : ""} ${awakened ? "aura-sphere-awakened" : ""} ${className}`.trim()}
      style={paletteVars(palette)}
    >
      {!dormant && !secret ? (
        <>
          <div className="aura-sphere-vortex" aria-hidden />
          <div className="aura-sphere-lobes" aria-hidden />
          <div className="aura-sphere-lobes aura-sphere-lobes-deep" aria-hidden />
          <AuraSpiralFilaments palette={palette} idPrefix={filamentId} />
          <AuraSpiralFilaments
            palette={palette}
            idPrefix={`${filamentId}-alt`}
            className="aura-sphere-filaments-alt"
          />
          <div className="aura-sphere-swirl" aria-hidden />
          <div className="aura-sphere-swirl aura-sphere-swirl-alt" aria-hidden />
        </>
      ) : null}
      <div className="aura-sphere-glass" />
      <div className="aura-sphere-nucleus" aria-hidden />
      <div className="aura-sphere-specular" aria-hidden />
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
  auraId,
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
    <div
      className={`aura-sphere-root relative shrink-0 ${className}`.trim()}
      style={paletteVars(palette)}
    >
      <AuraOrbStage
        lineage={lineage}
        auraId={auraId}
        className="aura-sphere-stage size-full"
      >
        <div className="aura-sphere-clip">
          <div className="aura-sphere-bloom" aria-hidden />
          <div className={`aura-sphere-halo ${pulse ? "aura-sphere-halo-pulse" : ""}`} aria-hidden />
          {evolutionMorphing && morphFromPalette ? (
            <>
              <AuraSphereBody
                palette={morphFromPalette}
                auraId={auraId}
                className="aura-evolve-orb-from"
              />
              <AuraSphereBody
                palette={palette}
                auraId={auraId}
                awakened={awakened}
                className="aura-evolve-orb-to"
              />
            </>
          ) : (
            <AuraSphereBody
              palette={palette}
              auraId={auraId}
              dormant={dormant}
              secret={secret}
              awakened={awakened}
            />
          )}
        </div>
        <div className="aura-sphere-ring aura-sphere-ring-a" aria-hidden />
        <div className="aura-sphere-ring aura-sphere-ring-b" aria-hidden />
        <div className="aura-sphere-ring aura-sphere-ring-c" aria-hidden />

        {children}
      </AuraOrbStage>
    </div>
  );
}

export function AuraSphereCompact({
  palette,
  auraId,
  lineage,
  secret = false,
  className = "",
}: {
  palette: AuraPalette;
  auraId?: string;
  lineage?: AuraLineage;
  secret?: boolean;
  className?: string;
}) {
  return (
    <AuraSphere
      palette={palette}
      auraId={auraId}
      lineage={lineage}
      hasVotes={!secret}
      secret={secret}
      className={`aura-sphere-compact ${className}`.trim()}
    />
  );
}
