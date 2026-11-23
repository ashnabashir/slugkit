"""Rename the package to your project's name.

Usage: python scripts/rename_package.py my_project
"""

import re
import sys
from pathlib import Path

OLD = "slugkit"
ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {
    ".git",
    ".venv",
    "venv",
    "__pycache__",
    ".mypy_cache",
    ".ruff_cache",
    ".pytest_cache",
    "node_modules",
    "dist",
    "build",
}
TEXT_SUFFIXES = {".py", ".toml", ".md", ".yml", ".yaml", ".cfg", ".txt", ".ts", ".tsx", ".html", ""}


def _should_skip(path: Path) -> bool:
    return any(part in SKIP_DIRS or part.endswith(".egg-info") for part in path.parts)


def main(argv: list[str]) -> int:
    if len(argv) != 1 or not re.fullmatch(r"[a-z][a-z0-9_]*", argv[0]):
        print("usage: rename_package.py <new_name>  (lowercase letters, digits, underscores)")
        return 2
    new = argv[0]
    dist_name = new.replace("_", "-")
    package_dir = ROOT / "src" / OLD

    if new == OLD:
        print(f"the package is already named {OLD}")
        return 1
    if not package_dir.is_dir():
        print(f"src/{OLD} not found; nothing to rename")
        return 1
    if (ROOT / "src" / new).exists():
        print(f"src/{new} already exists")
        return 1

    this_file = Path(__file__).resolve()
    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT)
        if _should_skip(relative) or not path.is_file() or path.suffix not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if path.resolve() == this_file:
            updated = text.replace(f'OLD = "{OLD}"', f'OLD = "{new}"')
        else:
            updated = re.sub(rf"(github\.com/[\w.-]+/){OLD}\b", rf"\g<1>{dist_name}", text)
            updated = updated.replace(OLD, new)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            print(f"updated {relative}")

    package_dir.rename(ROOT / "src" / new)
    print(f"renamed src/{OLD} -> src/{new}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
