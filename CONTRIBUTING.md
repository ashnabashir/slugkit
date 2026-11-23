# Contributing

Thanks for helping improve this project.

## Development setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
pre-commit install
```

## Before opening a pull request

```bash
ruff check . && ruff format --check .
mypy
pytest
```

- Open an issue first for larger changes so we can agree on the approach.
- Keep each pull request focused on one change and include tests.
- Add a line under `[Unreleased]` in `CHANGELOG.md` for user-facing changes.
