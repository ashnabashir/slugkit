import argparse
import sys
from collections.abc import Sequence

from slugkit import __version__
from slugkit.core import slugify


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="slugkit",
        description="Turn text into a clean, URL-safe slug.",
        epilog="Use -- before text that starts with a dash: slugkit -- '-draft title'",
    )
    parser.add_argument("text", nargs="*", help="text to slugify (reads stdin when omitted)")
    parser.add_argument("-s", "--separator", default="-", help="word separator (default: -)")
    parser.add_argument("-m", "--max-length", type=int, help="truncate the slug to this length")
    parser.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if not args.separator:
        parser.error("argument -s/--separator: must not be empty")
    if args.max_length is not None and args.max_length < 1:
        parser.error("argument -m/--max-length: must be a positive integer")

    if args.text:
        lines = [" ".join(args.text)]
    elif sys.stdin is None or sys.stdin.isatty():
        parser.error("no text given: pass it as arguments or pipe it on stdin")
    else:
        lines = sys.stdin.read().splitlines()

    for line in lines:
        print(slugify(line, separator=args.separator, max_length=args.max_length))
    return 0
