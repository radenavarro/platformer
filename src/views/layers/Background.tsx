import { useCallback, useRef } from 'react'
import { canvas } from '../../constants/canvas'
import { useGameLoop } from '../../hooks/useGameLoop'

const BG = '#88bef5'

export const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, canvas)
    // drawPlayer(ctx, canvas)
  }, [drawBackground])

  useGameLoop(() => {}, render, true, true)

  return (
    <canvas ref={canvasRef} width={canvas.width} height={canvas.height} style={{ position: 'absolute' }} />
  )
}
