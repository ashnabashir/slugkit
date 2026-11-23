import { describe, expect, it } from "vitest"

import { slugify } from "./slugify"

describe("slugify", () => {
  it.each([
    ["Hello, World!", "hello-world"],
    ["  leading and trailing  ", "leading-and-trailing"],
    ["Café au lait", "cafe-au-lait"],
    ["multiple---dashes", "multiple-dashes"],
    ["", ""],
    ["!!!", ""],
  ])("slugify(%j) === %j", (text, expected) => {
    expect(slugify(text)).toBe(expected)
  })

  it("supports a custom separator", () => {
    expect(slugify("Hello World", { separator: "_" })).toBe("hello_world")
  })

  it.each([
    ["x-ray vision", "-x", "x-xray-xvision"],
    ["data base", "ab", "dataabbase"],
    ["a b", "\\", "a\\b"],
    ["a b", "\\1", "a\\1b"],
    ["a b", "$&", "a$&b"],
  ])("inserts separator literally: %j with %j", (text, separator, expected) => {
    expect(slugify(text, { separator })).toBe(expected)
  })

  it.each([
    ["hello wonderful world", "-", 6, "hello"],
    ["hello wonderful world", "-", 8, "hello-wo"],
    ["hello world", "--", 6, "hello"],
    ["hello world", "--", 7, "hello"],
    ["hello world", "--", 8, "hello--w"],
    ["supercalifragilistic", "-", 5, "super"],
    ["short", "-", 50, "short"],
  ] as const)("truncates %j with %j to %i", (text, separator, maxLength, expected) => {
    expect(slugify(text, { separator, maxLength })).toBe(expected)
  })

  it.each([{ separator: "" }, { maxLength: 0 }, { maxLength: 2.5 }])("rejects %j", (options) => {
    expect(() => slugify("text", options)).toThrow()
  })
})
