import assert from "node:assert/strict"
import test from "node:test"

import { clampFloatingPanelPosition } from "../src/lib/floating-panel-position"

const bounds = {
  viewportWidth: 1440,
  viewportHeight: 900,
  panelWidth: 202,
  panelHeight: 554,
  margin: 12,
  minimumTop: 68,
}

test("floating panels stay below fixed header chrome", () => {
  assert.deepEqual(
    clampFloatingPanelPosition({ left: 600, top: 12 }, bounds),
    { left: 600, top: 68 },
  )
})

test("floating panels remain inside the right and bottom viewport edges", () => {
  assert.deepEqual(
    clampFloatingPanelPosition({ left: 2000, top: 2000 }, bounds),
    { left: 1226, top: 334 },
  )
})

test("the header boundary wins when the panel is taller than the available viewport", () => {
  assert.deepEqual(
    clampFloatingPanelPosition(
      { left: -100, top: -100 },
      { ...bounds, viewportHeight: 500 },
    ),
    { left: 12, top: 68 },
  )
})
