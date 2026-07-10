import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from nikud_map import NIKUD_MAP

NIKUD = re.compile(r"[\u0591-\u05C7]")
words_path = Path("src/data/words.json")

with words_path.open(encoding="utf-8") as f:
    words = json.load(f)

updated = 0
for word in words:
    he = word["hebrew"]
    if NIKUD.search(he):
        continue
    if he in NIKUD_MAP:
        word["hebrew"] = NIKUD_MAP[he]
        updated += 1

with words_path.open("w", encoding="utf-8") as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

remaining = sum(1 for w in words if not NIKUD.search(w["hebrew"]))
print(f"Updated: {updated}")
print(f"Without nikud: {remaining}")
