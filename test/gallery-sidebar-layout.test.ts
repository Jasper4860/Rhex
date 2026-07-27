import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import test from "node:test"

const root = process.cwd()

async function readSource(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8")
}

test("gallery list pages keep the right sidebar mounted", async () => {
  const pages = [
    ["src/app/home-feed-page.tsx", "feed.sidebar"],
    ["src/app/boards/[slug]/page.tsx", "board.sidebar"],
    ["src/app/zones/[slug]/page.tsx", "zone.sidebar"],
  ] as const

  for (const [file, sidebarSurface] of pages) {
    const source = await readSource(file)

    assert.match(source, /rightSidebar=\{\(/, `${file} should always provide rightSidebar content`)
    assert.match(source, new RegExp(`surface=\"${sidebarSurface}\"`), `${file} should keep the sidebar addon surface mounted`)
    assert.doesNotMatch(source, /rightSidebar=\{shouldShowRightSidebar \?/, `${file} should not hide the sidebar in gallery mode`)
    assert.doesNotMatch(source, /postListDisplayMode\s*!==\s*POST_LIST_DISPLAY_MODE_GALLERY/, `${file} should not use gallery mode to disable the sidebar`)
  }
})

test("desktop shell keeps a three-column layout when a right sidebar exists", async () => {
  const css = await readSource("src/app/globals.css")

  assert.match(css, /grid-template-columns:\s*200px minmax\(0, 1fr\) 250px;/)
  assert.match(css, /grid-template-columns:\s*60px minmax\(0, 1fr\) 250px;/)
  assert.match(css, /data-has-right-sidebar='false'[\s\S]*?grid-template-columns:\s*200px minmax\(0, 1fr\);/)
})
