"""Rename the template package to your project's name.

Usage: python scripts/rename_package.py my_project
"""

import re
import sys
from pathlib import Path

OLD = "mypackage"
ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".venv", "venv", "__pycache__", ".mypy_cache", ".ruff_cache", ".pytest_cache"}
TEXT_SUFFIXES = {".py", ".toml", ".md", ".yml", ".yaml", ".cfg", ".txt", ""}


def main() -> int:
    if len(sys.argv) != 2 or not re.fullmatch(r"[a-z][a-z0-9_]*", sys.argv[1]):
        print("usage: rename_package.py <new_name>  (lowercase letters, digits, underscores)")
        return 2
    new = sys.argv[1]
    dist_name = new.replace("_", "-")

    for path in ROOT.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts) or not path.is_file():
            continue
        if path.suffix not in TEXT_SUFFIXES or path.resolve() == Path(__file__).resolve():
            continue
        text = path.read_text(encoding="utf-8")
        updated = re.sub(rf"(github\.com/[\w.-]+/){OLD}\b", rf"\g<1>{dist_name}", text)
        updated = updated.replace(OLD, new)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            print(f"updated {path.relative_to(ROOT)}")

    (ROOT / "src" / OLD).rename(ROOT / "src" / new)
    print(f"renamed src/{OLD} -> src/{new}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
