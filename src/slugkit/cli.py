import argparse
import sys
from collections.abc import Sequence

from slugkit import __version__
from slugkit.core import slugify


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="slugkit",
        description="Turn text into a clean, URL-safe slug.",
    )
    parser.add_argument("text", nargs="*", help="text to slugify (reads stdin when omitted)")
    parser.add_argument("-s", "--separator", default="-", help="word separator (default: -)")
    parser.add_argument("-m", "--max-length", type=int, help="truncate the slug to this length")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    lines = [" ".join(args.text)] if args.text else sys.stdin.read().splitlines()
    try:
        for line in lines:
            print(slugify(line, separator=args.separator, max_length=args.max_length))
    except ValueError as exc:
        parser.error(str(exc))
    return 0
