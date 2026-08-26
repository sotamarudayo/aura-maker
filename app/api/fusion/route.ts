import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function POST() {
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
    .select("self_vote_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.self_vote_completed) {
    return NextResponse.json(
      { error: "先に自己診断を完了してください。", code: "self_vote_required" },
      { status: 403 },
    );
  }

  const inviteToken = randomBytes(16).toString("hex");
  const { data, error } = await admin
    .from("aura_fusions")
    .insert({
      inviter_id: user.id,
      invite_token: inviteToken,
      status: "pending",
    })
    .select("id, invite_token")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "融合リンクの作成に失敗しました。", code: "insert_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    fusionId: data.id,
    inviteToken: data.invite_token,
  });
}
