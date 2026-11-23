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

  it("does not end with a separator after truncating", () => {
    expect(slugify("hello wonderful world", { maxLength: 6 })).toBe("hello")
  })

  it("inserts separators literally", () => {
    expect(slugify("a b", { separator: "$&" })).toBe("a$&b")
  })

  it.each([{ separator: "" }, { maxLength: 0 }, { maxLength: 2.5 }])("rejects %j", (options) => {
    expect(() => slugify("text", options)).toThrow()
  })
})
