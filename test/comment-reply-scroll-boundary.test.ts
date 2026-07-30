import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("floating reply box does not contain page overscroll", async () => {
  const source = await readFile("src/components/comment/comment-thread-shared.tsx", "utf8")

  assert.doesNotMatch(source, /isFloatingPinnedLayout[^\n]*overscroll-contain/)
})
