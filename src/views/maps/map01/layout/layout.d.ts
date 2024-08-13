import { level } from '../../../../constants/level'

export type LayoutLine<N extends number, R extends string[] = []> =
    R['length'] extends N
        ? R
        : LayoutLine<N, [string, ...R]>;

export type LevelLayout = string[][]

const tile = level.map01.tiles.empty // Se elige empty porque tiene los parámetros básicos sobre los que construír, no por nada en particular

export type Tile = typeof tile & {src?: string; killsPlayer?: boolean}

export type Collision = Tile & {x?: number, y?: number, tileX?: number, tileY?: number}
