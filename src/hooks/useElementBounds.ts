import { RefObject, useEffect, useRef, useState } from 'react'

export const useElementBounds = (elementRef:RefObject<HTMLCanvasElement | HTMLElement>) => {
  const [coords, setCoords] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const current = elementRef?.current ?? null

  useEffect(() => {
    if (elementRef.current) {
      updateCoords()
    }
  }, [elementRef])

  function updateCoords () {
    const newCoords = {
      left: 0,
      right: current?.offsetWidth ?? 0,
      top: 0,
      bottom: current?.offsetHeight ?? 0
    }
    if (newCoords !== coords) {
      setCoords(newCoords)
    }
  }

  return { left: coords.left, right: coords.right, top: coords.top, bottom: coords.bottom }
}
