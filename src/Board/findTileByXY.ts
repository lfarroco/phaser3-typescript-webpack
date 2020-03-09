import { isPointerInTile } from './isPointerInTile';
import { Point2D } from '../Models';
export function findTileByXY({
  tiles,
  tileWidth,
  tileHeight,
  x,
  y
}: {
  tiles: Point2D[];
  tileWidth: number;
  tileHeight: number;
  x: number;
  y: number;
}) {
  console.log(tiles, x, y, tileWidth, tileHeight);
  return tiles.find(
    isPointerInTile({ x: x - tileWidth / 7, y: y }, tileWidth, tileHeight)
  );
}
