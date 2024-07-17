import { canvas } from '../constants/canvas'
import { Background } from './layers/Background'
import { PlayerLayer } from './layers/Player'
import './Game.css'
import { Map01 } from './maps/map01/Map01'
import { useCamera } from '../hooks/useCamera'
import { useMapProgress } from '../hooks/useMapProgress'
import { level } from '../constants/level'

const Game = () => {
  const { camera } = useCamera()

  const { playerInTile, totalTileWidth, totalTileHeight } = useMapProgress({ map: level.map01 })
  // console.log(camera)
  return (
    <main
      className='canvasContainer'
      style={{ width: canvas.width, height: canvas.height }}
      data-testid='gameWrapper'
    >
      <Background />
      <PlayerLayer camera={camera} tileData={{ playerInTile, totalTileWidth, totalTileHeight }} />
      <Map01 camera={camera} />
    </main>
  )
}

export default Game
