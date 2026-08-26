import { createHash, randomUUID } from "crypto";
import type { NextRequest } from "next/server";

export const VOTER_COOKIE_NAME = "aura_vid";
export const VOTE_DEDUP_HOURS = 24;

function hashPart(value: string): string {
  const salt = process.env.VOTE_FINGERPRINT_SALT ?? "aura-maker-vote-salt";
  return createHash("sha256").update(`${salt}:${value}`).digest("hex");
}

export function resolveClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function buildVoterFingerprint(request: NextRequest, voterId: string): string {
  const ip = resolveClientIp(request);
  return hashPart(`${ip}:${voterId}`);
}

export function buildSelfVoteFingerprint(userId: string): string {
  return `self:${userId}`;
}

export function createVoterId(): string {
  return randomUUID();
}
