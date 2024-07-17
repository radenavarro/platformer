import { level } from '../constants/level'

export type Map = typeof level.map01
export type MapProgressProps = {
    map: Map;
}
export type MapProgress = {x:number, y:number};
export type MapProgressOutput = { playerInTile: MapProgress, totalTileWidth:number, totalTileHeight:number }

export type Camera = { x: number, y: number }
