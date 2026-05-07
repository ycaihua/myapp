# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install in editable mode (required before first run)
pip install -e .

# Run the application
myapp
# or
python -m myapp.main

# Run all tests
pytest

# Run a single test
pytest tests/test_main.py::test_main -v
```

## Architecture

The project is a minimal Python package using `pyproject.toml` + `setuptools.build_meta` as the build backend.

- `myapp/main.py` — application logic; `main()` is the CLI entry point registered via `[project.scripts]`
- `tests/` — pytest test suite; test files mirror the module they cover (`test_main.py` → `main.py`)

The CLI entry point is declared in `pyproject.toml` under `[project.scripts]`, so `myapp` on the command line maps directly to `myapp.main:main`.
