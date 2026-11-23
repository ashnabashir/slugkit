import pytest

from slugkit import slugify


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("Hello, World!", "hello-world"),
        ("  leading and trailing  ", "leading-and-trailing"),
        ("Café au lait", "cafe-au-lait"),
        ("multiple---dashes", "multiple-dashes"),
        ("", ""),
        ("!!!", ""),
    ],
)
def test_slugify(text: str, expected: str) -> None:
    assert slugify(text) == expected


def test_custom_separator() -> None:
    assert slugify("Hello World", separator="_") == "hello_world"


@pytest.mark.parametrize(
    ("text", "separator", "expected"),
    [
        ("x-ray vision", "-x", "x-xray-xvision"),
        ("data base", "ab", "dataabbase"),
        ("a b", "\\", "a\\b"),
        ("a b", "\\1", "a\\1b"),
        ("a b", "$&", "a$&b"),
    ],
)
def test_separator_is_inserted_literally(text: str, separator: str, expected: str) -> None:
    assert slugify(text, separator=separator) == expected


@pytest.mark.parametrize(
    ("text", "separator", "max_length", "expected"),
    [
        ("hello wonderful world", "-", 6, "hello"),
        ("hello wonderful world", "-", 8, "hello-wo"),
        ("hello world", "--", 6, "hello"),
        ("hello world", "--", 7, "hello"),
        ("hello world", "--", 8, "hello--w"),
        ("supercalifragilistic", "-", 5, "super"),
        ("short", "-", 50, "short"),
    ],
)
def test_max_length(text: str, separator: str, max_length: int, expected: str) -> None:
    assert slugify(text, separator=separator, max_length=max_length) == expected


@pytest.mark.parametrize("kwargs", [{"separator": ""}, {"max_length": 0}])
def test_invalid_arguments(kwargs: dict[str, object]) -> None:
    with pytest.raises(ValueError):
        slugify("text", **kwargs)  # type: ignore[arg-type]
