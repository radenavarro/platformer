import { useEffect, useMemo, useState } from 'react'
import { Entity, LevelProps } from '../core/types'
import { Collision, LevelLayout } from '../views/maps/map01/layout/layout'
import { useTileInfo } from './useTileInfo'
import { between } from '../helpers/helpers'

export const useCollision = (entity:Entity, levelLayout:LevelLayout, levelProps:LevelProps) => {
  const [collidingBlocks, setCollidingBlocks] = useState<Collision[]>([])

  const entityCoords = useMemo(() => entity.getAbsolutePosition(levelProps.height), [JSON.stringify(entity.getAbsolutePosition(levelProps.height))])
  const { tileInfo } = useTileInfo(levelLayout)

  useEffect(() => {
    checkCollision()
  }, [entityCoords])

  function checkCollision () {
    const collidingBlocks:Collision[] = tileInfo.filter((tile) => {
      // 32 es el tamaño de cada tile tanto en ancho como en alto
      return (
        between(tile.x, tile.x + 32, entityCoords.x, true) ||
        between(tile.x, tile.x + 32, entityCoords.x + 32, true)
      ) && (
        between(tile.y, tile.y + 32, entityCoords.y + 64, true) ||
        between(tile.y, tile.y + 32, entityCoords.y + 96, true)
      )
    })

    setCollidingBlocks(collidingBlocks)
  }

  return { collidingBlocks }
}
