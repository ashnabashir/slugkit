// Mirrors src/mypackage/core.py so the playground and the Python package agree.

export interface SlugifyOptions {
  separator?: string
  maxLength?: number | null
}

const NON_WORD = /[^a-z0-9]+/g

function stripChars(value: string, chars: string, side: "both" | "end"): string {
  let start = 0
  let end = value.length
  if (side === "both") {
    while (start < end && chars.includes(value[start])) start++
  }
  while (end > start && chars.includes(value[end - 1])) end--
  return value.slice(start, end)
}

export function slugify(text: string, { separator = "-", maxLength = null }: SlugifyOptions = {}) {
  if (!separator) throw new Error("Separator must not be empty.")
  if (maxLength !== null && (!Number.isInteger(maxLength) || maxLength < 1)) {
    throw new Error("Max length must be a positive whole number.")
  }

  // Python's str.strip(sep) removes any of sep's characters, so this does too.
  const ascii = text.normalize("NFKD").replace(/[\u0080-\uffff]/g, "")
  let slug = stripChars(ascii.toLowerCase().replace(NON_WORD, () => separator), separator, "both")

  if (maxLength !== null && slug.length > maxLength) {
    slug = stripChars(slug.slice(0, maxLength), separator, "end")
  }
  return slug
}
