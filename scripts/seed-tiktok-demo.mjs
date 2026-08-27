/**
 * TikTok / 広告撮影用デモアカウントを Supabase に作成します。
 *
 * Usage:
 *   npm run seed:tiktok
 *
 * Requires .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const DEMO = {
  main: {
    email: "tiktok-demo-main@auramaker.app",
    password: "AuraDemo2026!",
    displayName: "ゆうき",
    selfWords: ["温厚", "面倒見いい", "癒やし枠"],
    friendSessions: [
      ["リアクション過剰", "飲み会の潤滑油", "突然ボケる"],
      ["リアクション過剰", "草不可避", "距離感バグ"],
      ["腹黒", "飲み会の潤滑油", "バグ技"],
      ["リアクション過剰", "深夜テンション", "天才的バカ"],
      ["飲み会の潤滑油", "リアクション過剰", "だるいのに有能"],
      ["笑いの引力", "陽キャバイブス", "リアクション過剰"],
      ["テンション継続不能", "飲み会の潤滑油", "突然ボケる"],
      ["腹黒", "リアクション過剰", "草不可避"],
      ["深夜テンション", "距離感バグ", "天才的バカ"],
      ["飲み会の潤滑油", "突然ボケる", "だるいのに有能"],
    ],
  },
  partner: {
    email: "tiktok-demo-partner@auramaker.app",
    password: "AuraDemo2026!",
    displayName: "みさき",
    selfWords: ["推ししか勝たん", "推し活の鬼", "深夜テンション"],
    friendSessions: [
      ["限界オタク", "推し活の鬼", "推ししか勝たん"],
      ["限界オタク", "平成レトロ", "カリスマ"],
      ["推ししか勝たん", "深夜テンション", "限界オタク"],
      ["推し活の鬼", "推ししか勝たん", "趣味の解像度バグ"],
      ["限界オタク", "推ししか勝たん", "平成レトロ"],
      ["推し活の鬼", "深夜テンション", "限界オタク"],
      ["推ししか勝たん", "カリスマ", "推し活の鬼"],
      ["限界オタク", "ノリの射程が長い", "推ししか勝たん"],
      ["平成レトロ", "推し活の鬼", "限界オタク"],
      ["推ししか勝たん", "趣味の解像度バグ", "深夜テンション"],
    ],
  },
};

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

function adminClient() {
  return createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function findUserByEmail(admin, email) {
  let page = 1;
  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) break;
    page += 1;
  }
  return null;
}

async function getOrCreateUser(admin, { email, password, displayName }) {
  let user = await findUserByEmail(admin, email);

  if (user) {
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { name: displayName },
    });
    if (error) throw error;
    user = data.user;
    console.log(`  ↳ 既存ユーザー更新: ${email}`);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: displayName },
    });
    if (error) throw error;
    user = data.user;
    console.log(`  ↳ 新規ユーザー作成: ${email}`);
  }

  return user;
}

async function upsertProfile(admin, userId, displayName) {
  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      display_name: displayName,
      self_vote_completed: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

function isMissingTableError(error) {
  return typeof error?.message === "string" && error.message.includes("Could not find the table");
}

async function clearUserData(admin, userId) {
  const fusionDelete = await admin
    .from("aura_fusions")
    .delete()
    .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`);
  if (fusionDelete.error && !isMissingTableError(fusionDelete.error)) {
    throw fusionDelete.error;
  }

  const { error: votesError } = await admin.from("votes").delete().eq("target_user_id", userId);
  if (votesError) throw votesError;

  const sessionsDelete = await admin.from("vote_sessions").delete().eq("target_user_id", userId);
  if (sessionsDelete.error && !isMissingTableError(sessionsDelete.error)) {
    throw sessionsDelete.error;
  }
}

async function seedVotes(admin, userId, selfWords, friendSessions) {
  const rows = [];

  for (const word of selfWords) {
    rows.push({
      target_user_id: userId,
      word,
      is_self_vote: true,
      voter_fingerprint: `self:${userId}`,
    });
  }

  friendSessions.forEach((words, index) => {
    const fingerprint = `demo-voter:${userId}:${index}`;
    for (const word of words) {
      rows.push({
        target_user_id: userId,
        word,
        is_self_vote: false,
        voter_fingerprint: fingerprint,
      });
    }
  });

  const { error } = await admin.from("votes").insert(rows);
  if (error) throw error;
}

async function ensureFusion(admin, inviterId, inviteeId) {
  const { data: existing, error: selectError } = await admin
    .from("aura_fusions")
    .select("id")
    .eq("inviter_id", inviterId)
    .eq("invitee_id", inviteeId)
    .eq("status", "accepted")
    .maybeSingle();

  if (selectError) {
    if (isMissingTableError(selectError)) return null;
    throw selectError;
  }

  if (existing) return existing.id;

  const inviteToken = randomBytes(16).toString("hex");
  const { data, error } = await admin
    .from("aura_fusions")
    .insert({
      inviter_id: inviterId,
      invitee_id: inviteeId,
      invite_token: inviteToken,
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
  return data.id;
}

async function seedAccount(admin, spec) {
  console.log(`\n▶ ${spec.displayName} (${spec.email})`);
  const user = await getOrCreateUser(admin, spec);
  await clearUserData(admin, user.id);
  await upsertProfile(admin, user.id, spec.displayName);
  await seedVotes(admin, user.id, spec.selfWords, spec.friendSessions);
  console.log(
    `  ↳ 投票: 自己 ${spec.selfWords.length} / 友達 ${spec.friendSessions.length}人 (${spec.friendSessions.length * 3}票)`,
  );
  return user.id;
}

async function main() {
  const admin = adminClient();
  console.log("TikTok demo account seed started");

  const mainId = await seedAccount(admin, DEMO.main);
  const partnerId = await seedAccount(admin, DEMO.partner);
  const fusionId = await ensureFusion(admin, mainId, partnerId);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  console.log("\n✅ デモアカウント準備完了\n");
  console.log("━━━ メイン（動画撮影用・自己vs友達ギャップ） ━━━");
  console.log(`表示名: ${DEMO.main.displayName}`);
  console.log(`Email:  ${DEMO.main.email}`);
  console.log(`Pass:   ${DEMO.main.password}`);
  console.log(`投票URL: ${siteUrl}/vote/${mainId}`);
  console.log(`ダッシュボード: ${siteUrl}/dashboard`);
  console.log("");
  console.log("━━━ 融合相手（みさき） ━━━");
  console.log(`表示名: ${DEMO.partner.displayName}`);
  console.log(`Email:  ${DEMO.partner.email}`);
  console.log(`Pass:   ${DEMO.partner.password}`);
  console.log("");
  console.log(`融合ID: ${fusionId ?? "（aura_fusions 未適用 → Supabase SQL Editor で migration 実行後に npm run seed:tiktok を再実行）"}`);
  console.log("\nログイン: /login からメールアドレスで入れます。");
}

main().catch((error) => {
  console.error("\n❌ Seed failed:", error.message ?? error);
  process.exit(1);
});
