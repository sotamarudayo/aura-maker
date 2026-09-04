import type { CSSProperties, ReactNode } from "react";
import type { AuraLineage, AuraPalette } from "@/lib/constants/auras";
import AuraOrbStage from "@/components/AuraOrbStage";
import AuraSpiralFilaments from "@/components/AuraSpiralFilaments";

export type EvolutionStyle = "crossfade" | "collapse" | "ring-burst" | "core-pulse";

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
  evolutionStyle?: EvolutionStyle;
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

/** auraId ごとに輪の位相をずらす（負の delay = 周期の途中から開始） */
function ringDriftPhaseVars(auraId?: string): CSSProperties {
  if (!auraId) return {};

  let hash = 2166136261;
  for (let i = 0; i < auraId.length; i += 1) {
    hash ^= auraId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const u = hash >>> 0;

  // 各輪の周期（20 / 26 / 32s）内でバラバラにずらす
  const delayA = -((u % 2000) / 100);
  const delayB = -(((u >>> 7) % 2600) / 100);
  const delayC = -(((u >>> 14) % 3200) / 100);

  return {
    "--ring-drift-delay-a": `${delayA}s`,
    "--ring-drift-delay-b": `${delayB}s`,
    "--ring-drift-delay-c": `${delayC}s`,
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

/** 光のにじみだけ（輪っかは含めない＝進化中に位置が飛ばない） */
function AuraSphereGlow({
  palette,
  pulse = false,
  layerClass = "",
}: {
  palette: AuraPalette;
  pulse?: boolean;
  layerClass?: string;
}) {
  return (
    <div className={`aura-evolve-layer ${layerClass}`.trim()} style={paletteVars(palette)} aria-hidden>
      <div className="aura-sphere-bloom" />
      <div className={`aura-sphere-halo ${pulse ? "aura-sphere-halo-pulse" : ""}`} />
    </div>
  );
}

function AuraSphereRings() {
  return (
    <>
      <div className="aura-sphere-ring aura-sphere-ring-a" aria-hidden />
      <div className="aura-sphere-ring aura-sphere-ring-b" aria-hidden />
      <div className="aura-sphere-ring aura-sphere-ring-c" aria-hidden />
    </>
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
  evolutionStyle = "core-pulse",
  className = "",
  children,
}: AuraSphereProps) {
  const dormant = !hasVotes && !secret;
  const morphing = Boolean(evolutionMorphing && morphFromPalette);

  return (
    <div
      className={`aura-sphere-root relative shrink-0 ${className}`.trim()}
      style={{ ...paletteVars(palette), ...ringDriftPhaseVars(auraId) }}
      data-evolve-style={morphing ? evolutionStyle : undefined}
    >
      <AuraOrbStage
        lineage={lineage}
        auraId={auraId}
        className="aura-sphere-stage size-full"
      >
        {/* メイン光は key 固定で付け替えず、進化時だけ旧光を重ねる */}
        {morphing && morphFromPalette ? (
          <AuraSphereGlow
            key="glow-from"
            palette={morphFromPalette}
            layerClass="aura-evolve-glow-from"
          />
        ) : null}
        <AuraSphereGlow
          key="glow-to"
          palette={palette}
          pulse={pulse}
          layerClass={morphing ? "aura-evolve-glow-to" : ""}
        />

        <AuraSphereRings />

        {morphing && evolutionStyle === "ring-burst" ? (
          <div className="aura-evolve-burst" aria-hidden>
            <div className="aura-evolve-burst-ring" />
            <div className="aura-evolve-burst-ring aura-evolve-burst-ring-delayed" />
          </div>
        ) : null}

        {/* 本体も key 固定。進化終了で作り直さない＝中身のパッ切りを防ぐ */}
        {morphing && morphFromPalette ? (
          <AuraSphereBody
            key="orb-from"
            palette={morphFromPalette}
            auraId="evolve-from"
            className="aura-evolve-orb-from"
          />
        ) : null}
        <AuraSphereBody
          key="orb-to"
          palette={palette}
          auraId={auraId ?? "evolve-to"}
          dormant={!morphing && dormant}
          secret={!morphing && secret}
          awakened={awakened}
          className={morphing ? "aura-evolve-orb-to" : ""}
        />

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
