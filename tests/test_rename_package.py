import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _make_project(tmp_path: Path) -> Path:
    project = tmp_path / "project"
    (project / "scripts").mkdir(parents=True)
    shutil.copy(ROOT / "scripts" / "rename_package.py", project / "scripts")
    (project / "src" / "slugkit").mkdir(parents=True)
    (project / "src" / "slugkit" / "__init__.py").write_text("from slugkit.core import x\n")
    (project / "pyproject.toml").write_text(
        'name = "slugkit"\nHomepage = "https://github.com/someone/slugkit"\n'
    )
    (project / "src" / "slugkit.egg-info").mkdir()
    (project / "src" / "slugkit.egg-info" / "PKG-INFO").write_text("Name: slugkit\n")
    (project / "logo.bin").write_bytes(b"\x89PNG slugkit")
    return project


def _run(project: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(project / "scripts" / "rename_package.py"), *args],
        capture_output=True,
        text=True,
        check=False,
    )


def test_renames_package_and_can_run_again(tmp_path: Path) -> None:
    project = _make_project(tmp_path)

    assert _run(project, "my_tool").returncode == 0
    assert (project / "src" / "my_tool" / "__init__.py").read_text() == (
        "from my_tool.core import x\n"
    )
    assert (project / "pyproject.toml").read_text() == (
        'name = "my_tool"\nHomepage = "https://github.com/someone/my-tool"\n'
    )
    assert (project / "src" / "slugkit.egg-info" / "PKG-INFO").read_text() == "Name: slugkit\n"
    assert (project / "logo.bin").read_bytes() == b"\x89PNG slugkit"

    assert _run(project, "other_tool").returncode == 0
    assert (project / "src" / "other_tool").is_dir()


def test_rejects_invalid_or_unchanged_names(tmp_path: Path) -> None:
    project = _make_project(tmp_path)

    assert _run(project, "Bad-Name").returncode == 2
    assert _run(project, "slugkit").returncode == 1
    assert (project / "src" / "slugkit").is_dir()
