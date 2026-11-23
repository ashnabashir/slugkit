import io

import pytest

from slugkit.cli import main


def test_arguments(capsys: pytest.CaptureFixture[str]) -> None:
    assert main(["Hello", "World"]) == 0
    assert capsys.readouterr().out == "hello-world\n"


def test_stdin(monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    monkeypatch.setattr("sys.stdin", io.StringIO("First Line\nSecond Line\n"))
    assert main(["--separator", "_"]) == 0
    assert capsys.readouterr().out == "first_line\nsecond_line\n"


def test_invalid_max_length_exits_with_error(capsys: pytest.CaptureFixture[str]) -> None:
    with pytest.raises(SystemExit) as exc_info:
        main(["text", "--max-length", "0"])
    assert exc_info.value.code == 2
    assert "max_length" in capsys.readouterr().err
