/**
 *
 * Converts board coordinates to a x,y position on a isometric scene
 * considering an origin point
 * @param x
 * @param y
 * @param tileWidth
 * @param tileHeight
 */

export function cartesianToIsometric(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  tileWidth: number,
  tileHeight: number
) {
  return {
    x: (x - y) * tileWidth + centerX,
    y: (x + y) * tileHeight + centerY
  };
}

/**
 * On the battle screen we want a little more depth into the scene, so that
 * we can cram more units in to screen and make facing the other team
 * more dramatic :O
 * @param x
 * @param y
 * @param tileWidth
 * @param tileHeight
 */
export function cartesianToIsometricBattle(
  x: number,
  y: number,
  tileWidth: number,
  tileHeight: number
) {
  var tx = (x - y) * tileWidth;
  var ty = ((x + y) * tileHeight) / 2;

  return {
    x: tx,
    y: ty
  };
}
