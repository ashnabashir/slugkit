import re
import unicodedata

_NON_WORD = re.compile(r"[^a-z0-9]+")


def slugify(text: str, separator: str = "-", max_length: int | None = None) -> str:
    """Return a lowercase ASCII slug for ``text``.

    ``separator`` is inserted literally between words. When ``max_length`` is
    set, the slug is cut to at most that many characters and never ends with a
    separator or a partial one.

    >>> slugify("Hello, World!")
    'hello-world'
    >>> slugify("Café au lait", separator="_")
    'cafe_au_lait'
    >>> slugify("hello wonderful world", max_length=12)
    'hello-wonder'
    """
    if not separator:
        raise ValueError("separator must not be empty")
    if max_length is not None and max_length < 1:
        raise ValueError("max_length must be a positive integer")

    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    words = [word for word in _NON_WORD.split(ascii_text.lower()) if word]

    if max_length is None:
        return separator.join(words)

    slug = ""
    for word in words:
        room = max_length - len(slug) - (len(separator) if slug else 0)
        if room <= 0:
            break
        slug = f"{slug}{separator}{word[:room]}" if slug else word[:room]
    return slug
