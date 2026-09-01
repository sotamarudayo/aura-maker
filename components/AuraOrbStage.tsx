import type { CSSProperties, ReactNode } from "react";
import type { AuraLineage } from "@/lib/constants/auras";

type AuraOrbStageProps = {
  lineage?: AuraLineage;
  auraId?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const STAGE_CLASS: Record<AuraLineage["id"], string> = {
  solar: "aura-stage-solar",
  chaos: "aura-stage-chaos",
  mystic: "aura-stage-mystic",
  legend: "aura-stage-legend",
  secret: "aura-stage-secret",
};

export default function AuraOrbStage({
  lineage,
  auraId,
  children,
  className = "",
  style,
}: AuraOrbStageProps) {
  const stageClass = lineage ? STAGE_CLASS[lineage.id] : "";

  return (
    <div
      className={`aura-orb-stage relative h-full w-full ${stageClass} ${className}`.trim()}
      style={style}
      data-lineage={lineage?.id}
      data-aura-id={auraId}
    >
      <div className="aura-stage-atmosphere pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden />
      <div className="aura-stage-rays pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden />
      {children}
    </div>
  );
}
