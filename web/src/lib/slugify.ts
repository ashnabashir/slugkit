// Mirrors src/slugkit/core.py so the playground and the Python package agree.

export interface SlugifyOptions {
  separator?: string
  maxLength?: number | null
}

const NON_WORD = /[^a-z0-9]+/

export function slugify(text: string, { separator = "-", maxLength = null }: SlugifyOptions = {}) {
  if (!separator) throw new Error("Separator must not be empty.")
  if (maxLength !== null && (!Number.isInteger(maxLength) || maxLength < 1)) {
    throw new Error("Max length must be a positive whole number.")
  }

  const ascii = text.normalize("NFKD").replace(/[\u0080-\uffff]/g, "")
  const words = ascii.toLowerCase().split(NON_WORD).filter(Boolean)

  if (maxLength === null) return words.join(separator)

  let slug = ""
  for (const word of words) {
    const room = maxLength - slug.length - (slug ? separator.length : 0)
    if (room <= 0) break
    slug = slug ? `${slug}${separator}${word.slice(0, room)}` : word.slice(0, room)
  }
  return slug
}
