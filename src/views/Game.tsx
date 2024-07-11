import { canvas } from '../constants/canvas'
import { Background } from './layers/Background'
import { PlayerLayer } from './layers/Player'
import './Game.css'
import { Map01 } from './maps/map01/Map01'

const Game = () => {
  return (
    <main
      className='canvasContainer'
      style={{ width: canvas.width, height: canvas.height }}
    >
      <Background />
      <PlayerLayer />
      <Map01 />
    </main>
  )
}

export default Game
