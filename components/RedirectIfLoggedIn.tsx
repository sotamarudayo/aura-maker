"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type RedirectIfLoggedInProps = {
  to?: string;
};

/** サーバー側でセッションが見えないときの保険（OAuth直後など） */
export default function RedirectIfLoggedIn({ to = "/dashboard" }: RedirectIfLoggedInProps) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace(to);
        router.refresh();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace(to);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, to]);

  return null;
}
