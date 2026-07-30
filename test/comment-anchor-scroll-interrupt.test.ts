import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test("comment anchor scrolling stops when the user starts scrolling", async () => {
  const source = await readFile("src/components/comment/comment-thread.tsx", "utf8")

  assert.match(source, /addEventListener\("wheel", cancelAnchorScrollOnUserIntent, \{ passive: true \}\)/)
  assert.match(source, /addEventListener\("touchstart", cancelAnchorScrollOnUserIntent, \{ passive: true \}\)/)
  assert.match(source, /clearTimeout\(retryTimeoutId\)/)
  assert.match(source, /setHighlightedCommentId\(\(current\) => current === highlightedCommentId \? null : current\)/)
})
