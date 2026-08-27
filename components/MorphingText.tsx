"use client";

import { useEffect, useState, type CSSProperties } from "react";

const SCRAMBLE_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョー・☆✦";

type MorphingTextProps = {
  from: string;
  to: string;
  active: boolean;
  className?: string;
  style?: CSSProperties;
  /** 全体の目安尺(ms)。長い文言でもこのくらいで収まるよう速度調整 */
  durationMs?: number;
  scrambleTicks?: number;
};

/**
 * 左から一文字ずつ、スクランブル → 確定で from → to に書き換える。
 */
export default function MorphingText({
  from,
  to,
  active,
  className,
  style,
  durationMs = 2400,
  scrambleTicks = 3,
}: MorphingTextProps) {
  const [text, setText] = useState(active ? from : to);

  useEffect(() => {
    if (!active) {
      setText(to);
      return;
    }

    setText(from);
    const maxLen = Math.max(from.length, to.length, 1);
    const stepMs = Math.max(28, Math.floor(durationMs / (maxLen * scrambleTicks)));
    let cancelled = false;
    const timers: number[] = [];

    function randomChar() {
      return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? "・";
    }

    for (let i = 0; i < maxLen; i += 1) {
      for (let tick = 0; tick < scrambleTicks; tick += 1) {
        const delay = i * stepMs * scrambleTicks + tick * stepMs;
        timers.push(
          window.setTimeout(() => {
            if (cancelled) return;
            setText(() => {
              const chars = Array.from({ length: maxLen }, (_, idx) => {
                if (idx < i) return to[idx] ?? "";
                if (idx === i) return randomChar();
                return from[idx] ?? to[idx] ?? randomChar();
              });
              return chars.join("");
            });
          }, delay),
        );
      }

      const lockDelay = (i + 1) * stepMs * scrambleTicks;
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setText(() => {
            const chars = Array.from({ length: maxLen }, (_, idx) => {
              if (idx <= i) return to[idx] ?? "";
              return from[idx] ?? to[idx] ?? "";
            });
            return chars.join("");
          });
        }, lockDelay),
      );
    }

    timers.push(
      window.setTimeout(() => {
        if (!cancelled) setText(to);
      }, maxLen * stepMs * scrambleTicks + 40),
    );

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, [active, from, to, durationMs, scrambleTicks]);

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}
