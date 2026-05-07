# myapp

A Python command-line application.

## Requirements

- Python >= 3.9

## Installation

```bash
pip install -e .
```

## Usage

```bash
myapp
```

## Development

```bash
# Install in editable mode
pip install -e .

# Run tests
pytest

# Run a single test
pytest tests/test_main.py::test_main -v
```

## Project Structure

```
myapp/
├── myapp/
│   ├── __init__.py
│   └── main.py       # CLI entry point
├── tests/
│   └── test_main.py
├── pyproject.toml
└── CLAUDE.md
```
