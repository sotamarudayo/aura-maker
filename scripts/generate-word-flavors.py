# -*- coding: utf-8 -*-
"""Generate word-result-flavor.ts covering every vote word."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
words_src = (ROOT / "lib/constants/words.ts").read_text(encoding="utf-8")
auras_src = (ROOT / "lib/constants/auras.ts").read_text(encoding="utf-8")
labels = re.findall(r'label:\s*"([^"]+)"', words_src)


def extract_string_map(const_name: str) -> dict[str, str]:
    m = re.search(rf"const {const_name}[^=]*=\s*\{{", auras_src)
    if not m:
        return {}
    start = m.end() - 1
    depth = 0
    end = start
    for i in range(start, len(auras_src)):
        if auras_src[i] == "{":
            depth += 1
        elif auras_src[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = auras_src[start:end]
    return dict(re.findall(r'\n\s*"?([^"\n:]+)"?:\s*"([^"]*)"', block))


def extract_array_map_first(const_name: str) -> dict[str, str]:
    m = re.search(rf"const {const_name}[^=]*=\s*\{{", auras_src)
    if not m:
        return {}
    start = m.end() - 1
    depth = 0
    end = start
    for i in range(start, len(auras_src)):
        if auras_src[i] == "{":
            depth += 1
        elif auras_src[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = auras_src[start:end]
    out: dict[str, str] = {}
    for key, arr in re.findall(r'\n\s*"?([^"\n:]+)"?:\s*\[((?:.|\n)*?)\]', block):
        first = re.search(r'"([^"]+)"', arr)
        if first:
            out[key.strip()] = first.group(1)
    return out


def extract_ecology_map() -> dict[str, dict[str, str]]:
    m = re.search(r"const ECOLOGY_BY_WORD[^=]*=\s*\{", auras_src)
    if not m:
        return {}
    start = m.end() - 1
    depth = 0
    end = start
    for i in range(start, len(auras_src)):
        if auras_src[i] == "{":
            depth += 1
        elif auras_src[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = auras_src[start:end]
    out: dict[str, dict[str, str]] = {}
    for key, body in re.findall(
        r'\n\s*"?([^"\n:]+)"?:\s*\{([^}]*)\}',
        block,
    ):
        fields = dict(re.findall(r'(\w+):\s*"([^"]*)"', body))
        if fields:
            out[key.strip()] = fields
    return out


NUANCE = extract_string_map("WORD_NUANCE")
WITNESS = extract_array_map_first("WITNESS_BY_WORD")
PUNCH = extract_array_map_first("PUNCHLINE_BY_WORD")
MOVES = extract_array_map_first("SPECIAL_MOVE_BY_WORD")
ECOLOGY = extract_ecology_map()

HAND: dict[str, dict[str, str]] = {
    "ビジュ爆発": {
        "nuance": "視覚情報の暴力",
        "witness": "周囲からは『見た瞬間に盛れてる人』として認識されています",
        "trigger": "カメラの前 / 良い光",
        "sideEffect": "周囲が自撮りを始めてしまう",
        "weakness": "逆光 / 寝起き",
        "move": "ビジュ無双フラッシュ",
        "punch": "ただし盛れすぎて本人認定が難しくなることがあります",
    },
    "垢抜けてる": {
        "nuance": "アップデート済み感",
        "witness": "周囲からは『なんか急に垢抜けた人』として認識されています",
        "trigger": "初対面 / 久しぶりに会う時",
        "sideEffect": "周囲が自分の見た目を見返す",
        "weakness": "寝不足 / 私服が雑な日",
        "move": "垢抜け完成形",
        "punch": "ただし昔知ってる友達ほどギャップに動揺します",
    },
    "目力がすごい": {
        "nuance": "視線の貫通力",
        "witness": "周囲からは『目が強すぎる人』として認識されています",
        "trigger": "真剣な話 / 目が合う瞬間",
        "sideEffect": "相手が先に目を逸らす",
        "weakness": "寝起き / マスクで半減する場",
        "move": "目力ビーム",
        "punch": "ただし笑顔がないと威圧に見えがちです",
    },
    "ファッション強め": {
        "nuance": "服が主張する力",
        "witness": "周囲からは『服が先に喋る人』として認識されています",
        "trigger": "外出 / 集合写真",
        "sideEffect": "周囲のコーデ話題が増える",
        "weakness": "制服縛り / 雨の日",
        "move": "私服ジャイアントキリング",
        "punch": "ただし私服が強い日ほど本人は自覚が薄いです",
    },
    "美形枠": {
        "nuance": "顔が勝ってる枠",
        "witness": "周囲からは『まず顔が強い人』として認識されています",
        "trigger": "初対面 / 写真",
        "sideEffect": "会話前から評価が始まる",
        "weakness": "顔以外で勝負したい日",
        "move": "美形枠確定",
        "punch": "ただし中身のギャップを期待されやすいです",
    },
    "逆光で消える": {
        "nuance": "光に溶ける儚さ",
        "witness": "周囲からは『写真だと別人になる人』として認識されています",
        "trigger": "屋外撮影 / 逆光",
        "sideEffect": "周囲が『盛れてない？』と困惑する",
        "weakness": "証明写真 / フラッシュ",
        "move": "逆光ロスト",
        "punch": "ただし本人は『いつも通り』だと思っています",
    },
}


def default_flavor(word: str) -> dict[str, str]:
    eco = ECOLOGY.get(word, {})
    return {
        "nuance": NUANCE.get(word, f"{word}っぽさ"),
        "witness": WITNESS.get(word, f"周囲からは『{word}っぽい人』として認識されています"),
        "trigger": eco.get("trigger", f"{word}が出やすい場面 / ノリが乗った時"),
        "sideEffect": eco.get("sideEffect", f"周囲が『{word}』を強く意識し始める"),
        "weakness": eco.get("weakness", "真面目モード / 初対面の緊張"),
        "move": MOVES.get(word, f"{word}全開"),
        "punch": PUNCH.get(word, f"ただし『{word}』が強く出すぎると周囲がついていけないことがあります"),
    }


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


lines = [
    "/** Result copy flavor for every vote word (nuance / ecology / move / punchline). */",
    "export type WordResultFlavor = {",
    "  nuance: string;",
    "  witness: string;",
    "  ecology: { trigger: string; sideEffect: string; weakness: string };",
    "  specialMove: string;",
    "  punchline: string;",
    "};",
    "",
    "export const WORD_RESULT_FLAVOR: Record<string, WordResultFlavor> = {",
]

for word in labels:
    f = {**default_flavor(word), **HAND.get(word, {})}
    lines.append(f'  "{esc(word)}": {{')
    lines.append(f'    nuance: "{esc(f["nuance"])}",')
    lines.append(f'    witness: "{esc(f["witness"])}",')
    lines.append("    ecology: {")
    lines.append(f'      trigger: "{esc(f["trigger"])}",')
    lines.append(f'      sideEffect: "{esc(f["sideEffect"])}",')
    lines.append(f'      weakness: "{esc(f["weakness"])}",')
    lines.append("    },")
    lines.append(f'    specialMove: "{esc(f["move"])}",')
    lines.append(f'    punchline: "{esc(f["punch"])}",')
    lines.append("  },")

lines.extend(
    [
        "};",
        "",
        "export function getWordResultFlavor(word: string): WordResultFlavor | undefined {",
        "  return WORD_RESULT_FLAVOR[word];",
        "}",
        "",
    ]
)

out = ROOT / "lib/constants/word-result-flavor.ts"
out.write_text("\n".join(lines), encoding="utf-8")
print("wrote", out, "words", len(labels), "nuance_reuse", len(NUANCE), "eco_reuse", len(ECOLOGY))
