"""Tests for myapp.main."""

from unittest.mock import patch
from myapp.main import main


def test_main(capsys):
    with patch("uvicorn.run"):
        main()
    captured = capsys.readouterr()
    assert "Starting myapp API server" in captured.out
