import { useEffect, useRef } from 'react'
import { canvas } from '../../../constants/canvas'
import { level } from '../../../constants/level'
import { useLevelImages } from '../../../hooks/useLevelImages'
import { levelLayout } from './layout/map01'
import { useGameStore } from '../../../zustand/store'
import { between, playerInAnyBoundary } from '../../../helpers/helpers'
import { useTileInfo } from '../../../hooks/useTileInfo'

export const Map01 = ({ camera }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tilesRef = useRef(level.map01.tiles)
  const { imagesRef, imagesLoaded } = useLevelImages({ levelMap: level.map01.tiles })
  const { tileInfo, setTileInfo } = useGameStore().map01

  useEffect(() => {
    if (imagesLoaded) {
      // console.log(camera.x)
      createLayout()
    }
  }, [imagesLoaded, camera])
  useEffect(() => {
    if (imagesLoaded) {
      spawnEnemies()
    }
  }, [])

  // const tiles = useTileInfo(levelLayout)
  // console.log(tiles)
  // useEffect(() => {
  //   if (imagesLoaded && !playerInAnyBoundary(tileData)) {
  //     createLayout()
  //   }
  // }, [camera])

  function createLayout () {
    const ctx = canvasRef.current?.getContext('2d')

    if (ctx) {
      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startCol = Math.floor(camera.x / 32)
      const endCol = startCol + Math.ceil(canvas.width / 32) + 1

      for (let y = 0; y < levelLayout.length; y++) {
        for (let x = startCol; x < endCol; x++) {
          if (x >= 0 && x < levelLayout[0].length) {
            const tile = levelLayout[y][x]
            const tileFullname = Object.entries(level.map01.tiles).find(([key, value]) => value.abbr === tile)?.[0]
            if (tileFullname !== 'empty') {
              const drawX = Math.round(x * 32 - camera.x)
              const drawY = (levelLayout.length - 1 - y) * 32
              ctx.drawImage(imagesRef.current?.[tileFullname], drawX, drawY)
            }
          }
        }
      }

      ctx.restore()
    }
  }

  function spawnEnemies () {

  }

  return (
    <canvas
      ref={canvasRef}
      width={canvas.width}
      height={canvas.height}
      style={{
        position: 'absolute'
      }}
    />
  )
}
