# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed

- Separators are inserted literally: backslashes no longer crash, and
  separators containing letters or digits no longer remove text.
- `max_length` never leaves a partial multi-character separator at the end.
- The CLI reports invalid `--separator` and `--max-length` values even when
  there is no input, and exits with a message instead of waiting when run
  with no text on a terminal.
- Source distributions contain only the package, tests and docs.

## [0.1.0] - 2026-11-23

### Added

- `slugify()` with custom separators and length limits.
- `slugkit` command-line tool that reads arguments or stdin.
