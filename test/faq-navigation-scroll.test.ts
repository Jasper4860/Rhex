import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("FAQ navigation remains in normal document flow", async () => {
  const source = await readFile("src/components/faq-page-frame.tsx", "utf8")

  assert.doesNotMatch(source, /className=\"sticky top-20 z-10 pb-1\"/)
  assert.match(source, /className=\"pb-1\"/)
})
