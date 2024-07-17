import { useEffect, useRef } from 'react'
import { canvas } from '../../../constants/canvas'
import { level } from '../../../constants/level'
import { useLevelImages } from '../../../hooks/useLevelImages'
import { levelLayout } from './layout/map01'
import { useGameStore } from '../../../zustand/store'

export const Map01 = ({ camera }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tilesRef = useRef(level.map01.tiles)
  const { imagesRef, imagesLoaded } = useLevelImages({ levelMap: level.map01.tiles })

  const { playerScrollX, playerScrollY } = useGameStore().player

  useEffect(() => {
    console.log(imagesRef)
    if (imagesLoaded) createLayout()
  }, [imagesLoaded])

  // useEffect(() => {
  //   scroll()
  // }, [playerScrollX, playerScrollY])

  function scroll () {
    const ctx = canvasRef.current?.getContext('2d')
    // shiftCanvas(ctx, level.map01.width, level.map01.height, -playerScrollX, -playerScrollY)
  }
  function shiftCanvas (ctx, w, h, dx, dy) {
    ctx.save()
    const imageData = ctx.getImageData(0, 0, w, h)
    ctx.clearRect(0, 0, w, h)
    ctx.putImageData(imageData, dx, dy)
    ctx.restore()
  }

  function createLayout () {
    const { width, height } = level.map01
    const ctx = canvasRef.current?.getContext('2d')

    let pointerX = 0
    let pointerY = height

    const groundLevel = level.map01.groundLevel

    if (ctx) {
      // console.log('width: ' + width)
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
    <canvas
      ref={canvasRef}
      width={level.map01.width}
      height={level.map01.height}
      style={{
        position: 'absolute'
        // width: canvas.width,
        // height: canvas.height,
        // overflow: 'hidden'
      }}
    />
  )
}
