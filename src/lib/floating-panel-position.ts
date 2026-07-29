export interface FloatingPanelPosition {
  left: number
  top: number
}

interface FloatingPanelBounds {
  viewportWidth: number
  viewportHeight: number
  panelWidth: number
  panelHeight: number
  margin: number
  minimumTop?: number
}

export function clampFloatingPanelPosition(
  position: FloatingPanelPosition,
  bounds: FloatingPanelBounds,
): FloatingPanelPosition {
  const minimumLeft = bounds.margin
  const minimumTop = Math.max(bounds.margin, bounds.minimumTop ?? bounds.margin)
  const maximumLeft = Math.max(
    minimumLeft,
    bounds.viewportWidth - bounds.panelWidth - bounds.margin,
  )
  const maximumTop = Math.max(
    minimumTop,
    bounds.viewportHeight - bounds.panelHeight - bounds.margin,
  )

  return {
    left: Math.min(Math.max(minimumLeft, position.left), maximumLeft),
    top: Math.min(Math.max(minimumTop, position.top), maximumTop),
  }
}
