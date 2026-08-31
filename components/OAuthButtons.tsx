"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { createClient } from "@/utils/supabase/client";
import {
  buildAuthCallbackUrl,
  OAUTH_PROVIDER_LABELS,
  type OAuthProvider,
} from "@/lib/auth/oauth";

type OAuthButtonsProps = {
  mode: "signin" | "link";
  loading?: boolean;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string | null) => void;
};

export default function OAuthButtons({
  mode,
  loading = false,
  disabled = false,
  onLoadingChange,
  onError,
}: OAuthButtonsProps) {
  const { t } = useLocale();
  const supabase = useMemo(() => createClient(), []);
  const [activeProvider, setActiveProvider] = useState<OAuthProvider | null>(null);

  async function handleOAuth(provider: OAuthProvider) {
    onLoadingChange?.(true);
    onError?.(null);
    setActiveProvider(provider);

    const redirectTo = buildAuthCallbackUrl("/dashboard");

    if (mode === "link") {
      const { error } = await supabase.auth.linkIdentity({
        provider,
        options: { redirectTo },
      });

      if (error) {
        onError?.(error.message);
        onLoadingChange?.(false);
        setActiveProvider(null);
      }

      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      onError?.(error.message);
      onLoadingChange?.(false);
      setActiveProvider(null);
    }
  }

  const providers: OAuthProvider[] = ["google", "x"];

  return (
    <div className="space-y-2">
      {providers.map((provider) => {
        const isBusy = loading && activeProvider === provider;
        const providerLabel = OAUTH_PROVIDER_LABELS[provider];
        const label =
          mode === "link"
            ? t.oauth.linkWith.replace("{provider}", providerLabel)
            : t.oauth.continueWith.replace("{provider}", providerLabel);

        return (
          <button
            key={provider}
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              void handleOAuth(provider);
            }}
            className="w-full rounded-lg border border-white/30 bg-white/5 px-4 py-2 text-white disabled:opacity-60"
          >
            {isBusy ? t.common.connecting : label}
          </button>
        );
      })}
    </div>
  );
}
