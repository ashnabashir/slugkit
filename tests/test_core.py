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


def test_max_length_does_not_end_with_separator() -> None:
    assert slugify("hello wonderful world", max_length=6) == "hello"


@pytest.mark.parametrize("kwargs", [{"separator": ""}, {"max_length": 0}])
def test_invalid_arguments(kwargs: dict[str, object]) -> None:
    with pytest.raises(ValueError):
        slugify("text", **kwargs)  # type: ignore[arg-type]
