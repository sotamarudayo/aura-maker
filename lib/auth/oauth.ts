export type OAuthProvider = "google" | "x";

export function buildAuthCallbackUrl(next = "/dashboard") {
  if (typeof window === "undefined") {
    return `/auth/callback?next=${encodeURIComponent(next)}`;
  }

  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

export const OAUTH_PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: "Google",
  x: "X（Twitter）",
};
