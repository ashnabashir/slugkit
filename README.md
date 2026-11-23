# Python project template

A ready-to-use structure for new Python projects: `src/` layout, packaging with
`pyproject.toml`, tests with coverage, linting, type checking, pre-commit hooks,
GitHub Actions CI, and issue/PR templates.

It ships with a small working example package, `mypackage`, which turns text
into URL-safe slugs, so every tool has real code to check from the first commit.

## Layout

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/          # bug report and feature request forms
│   ├── pull_request_template.md
│   └── workflows/ci.yml         # lint + type check + tests on 3 OSes × 4 Pythons
├── scripts/rename_package.py    # rename `mypackage` for a new project
├── src/mypackage/               # the importable package
│   ├── __init__.py
│   ├── __main__.py              # `python -m mypackage`
│   ├── cli.py
│   ├── core.py
│   └── py.typed                 # ships type hints to users
├── tests/
├── .pre-commit-config.yaml
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── pyproject.toml               # metadata, dependencies, tool config
```

## Start a new project from this template

1. Copy the template. On GitHub, mark the repository as a template, then use
   **Use this template**. Or clone it and delete `.git`.
2. Rename the package:

   ```bash
   python scripts/rename_package.py my_project
   ```

3. Edit `description`, `authors` and `keywords` in `pyproject.toml`, replace the
   code in `src/my_project/`, and update this README.

## Run it locally

Requires Python 3.10 or newer.

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e ".[dev]"

mypackage "Hello, World!"        # hello-world
echo "Café au lait" | mypackage -s _   # cafe_au_lait

pytest                           # tests with coverage
ruff check . && ruff format --check .
mypy
```

## License

MIT. See [LICENSE](LICENSE).
