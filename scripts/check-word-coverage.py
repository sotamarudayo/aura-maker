import re
from pathlib import Path

words_src = Path("lib/constants/words.ts").read_text(encoding="utf-8")
auras_src = Path("lib/constants/auras.ts").read_text(encoding="utf-8")
labels = re.findall(r'label:\s*"([^"]+)"', words_src)
print("vote words", len(labels))


def keys_in_block(name: str) -> set[str]:
    m = re.search(rf"const {name}[^=]*=\s*\{{", auras_src)
    if not m:
        print("missing", name)
        return set()
    start = m.end() - 1
    depth = 0
    end = start
    for i in range(start, len(auras_src)):
        c = auras_src[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    block = auras_src[start:end]
    keys = set(re.findall(r"\n\s*([^:\n/{]+):\s*(?:\{|\[|\")", block))
    return {k.strip().strip('"').strip("'") for k in keys if k.strip()}


for name in ["WORD_NUANCE", "WITNESS_BY_WORD", "ECOLOGY_BY_WORD", "SPECIAL_MOVE_BY_WORD"]:
    keys = keys_in_block(name)
    missing = [w for w in labels if w not in keys]
    print(name, "covered", len(keys & set(labels)), "missing", len(missing))
    print("MISSING:" + "|".join(missing))
