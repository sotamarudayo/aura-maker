"use client";

import { useEffect, useRef, useState } from "react";
import AuraEncyclopediaCard from "@/components/AuraEncyclopediaCard";
import type { AuraType } from "@/lib/constants/auras";

type LazyAuraEncyclopediaCardProps = {
  aura: AuraType;
  lineageCode?: string;
  lineageAccent?: string;
  lineageAccentSoft?: string;
};

function EncyclopediaCardPlaceholder({ accent }: { accent: string }) {
  return (
    <article
      className="aura-encyclopedia-card aura-encyclopedia-placeholder w-full min-w-0 overflow-hidden rounded-2xl border p-0"
      style={{ borderColor: `${accent}44` }}
      aria-hidden
    >
      <div className="h-9 bg-white/5" />
      <div className="h-1 bg-white/10" />
      <div className="flex flex-col items-center p-5">
        <div
          className="size-24 rounded-full opacity-40 sm:size-28"
          style={{
            background: `radial-gradient(circle, ${accent}88 0%, transparent 70%)`,
          }}
        />
        <div className="mt-4 h-5 w-2/3 rounded bg-white/10" />
        <div className="mt-2 h-3 w-1/2 rounded bg-white/5" />
        <div className="mt-4 h-12 w-full rounded bg-white/5" />
      </div>
    </article>
  );
}

export default function LazyAuraEncyclopediaCard(props: LazyAuraEncyclopediaCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const accent = props.lineageAccent ?? props.aura.palette.a;

  return (
    <div ref={rootRef}>
      {visible ? (
        <AuraEncyclopediaCard {...props} />
      ) : (
        <EncyclopediaCardPlaceholder accent={accent} />
      )}
    </div>
  );
}
