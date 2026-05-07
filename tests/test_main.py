"""Tests for myapp.main."""

from myapp.main import main


def test_main(capsys):
    main()
    captured = capsys.readouterr()
    assert "Hello from myapp!" in captured.out
