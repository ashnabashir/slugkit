# slugkit

[![CI](https://github.com/ashnabashir/slugkit/actions/workflows/ci.yml/badge.svg)](https://github.com/ashnabashir/slugkit/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12%20%7C%203.13-blue)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Turn any text into clean, URL-safe slugs. Typed, dependency-free, and usable
as a Python library, a command-line tool, or in the browser.

```python
>>> from slugkit import slugify
>>> slugify("Café au lait: 10 recipes you'll love!")
'cafe-au-lait-10-recipes-you-ll-love'
>>> slugify("Hello World", separator="_")
'hello_world'
>>> slugify("hello wonderful world", max_length=6)
'hello'
```

## Features

- Flattens accents (`é` becomes `e`) and drops characters with no ASCII form.
- Collapses punctuation and whitespace into a single separator, never leaving
  one at either end.
- Optional maximum length that never cuts off with a dangling separator.
- Ships type hints (`py.typed`) and has no runtime dependencies.
- Command-line tool that reads arguments or one title per line from stdin.
- [Slug Playground](web/): a browser app with the same rules, checked against
  the Python implementation.

## Install

Requires Python 3.10 or newer.

```bash
pip install git+https://github.com/ashnabashir/slugkit.git
```

## Command line

```bash
slugkit "Hello, World!"              # hello-world
echo "Café au lait" | slugkit -s _   # cafe_au_lait
slugkit "A very long title" -m 10    # a-very-lon
slugkit --help
```

## Development

```bash
git clone https://github.com/ashnabashir/slugkit.git
cd slugkit
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
pre-commit install

pytest                               # tests with coverage
ruff check . && ruff format --check .
mypy
```

The playground lives in [`web/`](web/); see [web/README.md](web/README.md).
See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Project layout

```text
.
├── .github/                 # CI workflow, issue forms, PR template
├── scripts/rename_package.py
├── src/slugkit/             # the library and CLI
├── tests/
├── web/                     # Slug Playground (Vite + React)
├── CHANGELOG.md
├── CONTRIBUTING.md
└── pyproject.toml
```

### Use it as a starting point

The repository is a GitHub template. Choose **Use this template**, then rename
the package for your own project:

```bash
python scripts/rename_package.py my_project
```

## License

MIT. See [LICENSE](LICENSE).
