import re
import unicodedata

_NON_WORD = re.compile(r"[^a-z0-9]+")


def slugify(text: str, separator: str = "-", max_length: int | None = None) -> str:
    """Return a lowercase ASCII slug for ``text``.

    >>> slugify("Hello, World!")
    'hello-world'
    >>> slugify("Café au lait", separator="_")
    'cafe_au_lait'
    """
    if not separator:
        raise ValueError("separator must not be empty")
    if max_length is not None and max_length < 1:
        raise ValueError("max_length must be a positive integer")

    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    slug = _NON_WORD.sub(separator, ascii_text.lower()).strip(separator)

    if max_length is not None and len(slug) > max_length:
        slug = slug[:max_length].rstrip(separator)
    return slug
