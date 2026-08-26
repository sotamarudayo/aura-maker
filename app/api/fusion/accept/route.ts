import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON.", code: "invalid_json" }, { status: 400 });
  }

  const token =
    typeof (body as { token?: unknown }).token === "string"
      ? (body as { token: string }).token.trim()
      : "";

  if (!token) {
    return NextResponse.json({ error: "token is required.", code: "missing_token" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。", code: "auth_required" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("self_vote_completed, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.self_vote_completed) {
    return NextResponse.json(
      { error: "先に自己診断（3語）を完了してください。", code: "self_vote_required" },
      { status: 403 },
    );
  }

  const { data: fusion } = await admin
    .from("aura_fusions")
    .select("id, inviter_id, invitee_id, status")
    .eq("invite_token", token)
    .maybeSingle();

  if (!fusion) {
    return NextResponse.json({ error: "融合リンクが見つかりません。", code: "not_found" }, { status: 404 });
  }

  if (fusion.inviter_id === user.id) {
    return NextResponse.json(
      { error: "自分の融合リンクには参加できません。", code: "self_accept" },
      { status: 400 },
    );
  }

  if (fusion.status === "accepted") {
    if (fusion.invitee_id === user.id) {
      return NextResponse.json({ ok: true, alreadyAccepted: true, fusionId: fusion.id });
    }
    return NextResponse.json(
      { error: "この融合リンクはすでに使われています。", code: "already_used" },
      { status: 409 },
    );
  }

  const { error } = await admin
    .from("aura_fusions")
    .update({
      invitee_id: user.id,
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", fusion.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message, code: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, fusionId: fusion.id });
}
