import { level } from '../constants/level'

export type Action = 'idle' | 'move' | 'jump' | 'fall'
export type Direction = 'left' | 'right'
export type ActionDirection = 'idleLeft' | 'moveLeft' | 'jumpLeft' | 'fallLeft' | 'idleRight' | 'moveRight' | 'jumpRight' | 'fallRight'
export type GameState = {
    x: number;
    y: number;
    spriteX?: number;
    spriteY?: number;
    direction?: Direction;
    action?: Action;
    currentFrame?: number;
    frameCount?: number;
    frameRate?: number;
    isJumping?: boolean;
    velocityY?: number;
    renders?: number;
}

export type SectorInfo = {
    x: number;
    y: number;
    width: number;
    height: number;
    blocksPlayer?: boolean;
    blocksEnemies?: boolean;
}

export interface Entity {
    getSpeed: () => number;
    update: (...args) => void;
    getPosition: () => { x: number, y: number };
    getAbsolutePosition: (levelHeight: number) => { x: number, y: number };
    getAction: () => Action;
}

export type LevelProps = typeof level.map01
