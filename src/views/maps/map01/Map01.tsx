import { useEffect, useRef } from 'react'
import { canvas } from '../../../constants/canvas'
import { level } from '../../../constants/level'
import { useLevelImages } from '../../../hooks/useLevelImages'
import { levelLayout } from './layout/map01'

export const Map01 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tilesRef = useRef(level.map01.tiles)
  const { imagesRef, imagesLoaded } = useLevelImages({ levelMap: level.map01.tiles })

  useEffect(() => {
    console.log(imagesRef)
    if (imagesLoaded) createLayout()
  }, [imagesLoaded])

  function createLayout () {
    const { height, width } = level.map01
    const ctx = canvasRef.current?.getContext('2d')

    let pointerX = 0
    let pointerY = height

    const groundLevel = level.map01.groundLevel

    if (ctx) {
      console.log('width: ' + width)
      for (const line of levelLayout) {
        for (const tile of line) {
          console.log('x: ' + pointerX)
          const tileFullname = Object.entries(level.map01.tiles).find(([key, value]) => value.abbr === tile)?.[0]
          if (tileFullname !== 'empty') {
            ctx.drawImage(imagesRef.current?.[tileFullname], pointerX, pointerY)
          }
          pointerX += 32
        }
        pointerX = 0
        pointerY -= 32
        console.log('/n')
        console.log('y: ' + pointerY)
        // if (pointerX > width) {
        // console.log('y: ' + pointerY + ', ground: ' + groundLevel)
        // pointerY -= 32
        // if (Math.abs(pointerY) < height) {
        //   pointerX = 0
        // }
        // }
      }
      // while (pointerX <= width && pointerY <= height) {
      //   if (pointerY > (groundLevel + 64)) {
      //     ctx.drawImage(imagesRef.current?.floor, pointerX, pointerY)
      //   }
      //   pointerX += 32
      //   if (pointerX > width) {
      //     console.log('y: ' + pointerY + ', ground: ' + groundLevel)
      //     pointerY -= 32
      //     if (Math.abs(pointerY) < height) {
      //       pointerX = 0
      //     }
      //   }
      // }
    }
  }

  return (
    <canvas ref={canvasRef} width={canvas.width} height={canvas.height} style={{ position: 'absolute' }} />
  )
}
