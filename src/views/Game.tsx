import { canvas } from '../constants/canvas'
import { Background } from './layers/Background'
import { PlayerLayer } from './layers/Player'
import './Game.css'

const Game = () => {
  return (
    <main
      className='canvasContainer'
      style={{ width: canvas().width, height: canvas().height }}
    >
      <Background />
      <PlayerLayer />
    </main>
  )
}

export default Game
