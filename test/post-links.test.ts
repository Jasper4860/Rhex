import assert from "node:assert/strict"
import test from "node:test"

import { getPostShortPath } from "../src/lib/post-links"

test("short post links use the existing timestamp suffix", () => {
  assert.equal(
    getPostShortPath({ slug: "points-exchange-rm1-1785330644517" }),
    "/posts/1785330644517",
  )
})

test("short post links preserve sequential numeric slugs", () => {
  assert.equal(getPostShortPath({ slug: "1785330644517" }), "/posts/1785330644517")
})

test("short post links fall back to the complete slug when no suffix exists", () => {
  assert.equal(getPostShortPath({ slug: "welcome" }), "/posts/welcome")
})
