import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const oauthError = url.searchParams.get("error");
  const oauthErrorDescription = url.searchParams.get("error_description");

  if (oauthError) {
    const message = oauthErrorDescription ?? oauthError;
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, url.origin));
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_auth_code", url.origin),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin));
  }

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
