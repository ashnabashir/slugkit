import io

import pytest

from slugkit.cli import main


class _TerminalInput(io.StringIO):
    def isatty(self) -> bool:
        return True


def test_arguments(capsys: pytest.CaptureFixture[str]) -> None:
    assert main(["Hello", "World"]) == 0
    assert capsys.readouterr().out == "hello-world\n"


def test_text_starting_with_dash(capsys: pytest.CaptureFixture[str]) -> None:
    assert main(["--", "-draft"]) == 0
    assert capsys.readouterr().out == "draft\n"


def test_separator_starting_with_dash(capsys: pytest.CaptureFixture[str]) -> None:
    assert main(["--separator=-x", "a b"]) == 0
    assert capsys.readouterr().out == "a-xb\n"


def test_stdin(monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    monkeypatch.setattr("sys.stdin", io.StringIO("First Line\nSecond Line\n"))
    assert main(["--separator", "_"]) == 0
    assert capsys.readouterr().out == "first_line\nsecond_line\n"


def test_no_text_on_terminal_exits_instead_of_waiting(
    monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    monkeypatch.setattr("sys.stdin", _TerminalInput())
    with pytest.raises(SystemExit) as exc_info:
        main([])
    assert exc_info.value.code == 2
    assert "no text given" in capsys.readouterr().err


@pytest.mark.parametrize(
    ("argv", "message"),
    [
        (["--max-length", "0"], "--max-length"),
        (["--separator", ""], "--separator"),
    ],
)
def test_invalid_options_fail_before_reading_input(
    monkeypatch: pytest.MonkeyPatch,
    capsys: pytest.CaptureFixture[str],
    argv: list[str],
    message: str,
) -> None:
    monkeypatch.setattr("sys.stdin", io.StringIO(""))
    with pytest.raises(SystemExit) as exc_info:
        main(argv)
    assert exc_info.value.code == 2
    assert message in capsys.readouterr().err
