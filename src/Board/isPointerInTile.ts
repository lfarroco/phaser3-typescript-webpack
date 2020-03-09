export function isPointerInTile(
  pointer: {
    x: number;
    y: number;
  },
  tileWidth: number,
  tileHeight: number
) {
  return function(tile: { x: number; y: number }) {
    const dx = Math.abs(tile.x - pointer.x);
    const dy = Math.abs(tile.y - pointer.y);
    const deltaX = dx / tileWidth;
    const deltaY = dy / tileHeight;
    console.log(deltaX + deltaY);
    return deltaX + deltaY < 1;
  };
}
