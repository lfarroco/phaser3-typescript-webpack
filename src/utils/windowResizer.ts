import { BASE_WINDOW_SIZE } from '../constants/window';

/**
 * Returns window size and margin to keep it centralized
 */
export function getDimensions(innerWidth: number, innerHeight: number) {
  const { BASE_WINDOW_WIDTH, BASE_WINDOW_HEIGHT } = BASE_WINDOW_SIZE;

  return derivedSizes({
    width: BASE_WINDOW_WIDTH,
    height: BASE_WINDOW_HEIGHT,
    scale: 1
  });
}

export type Dimensions = {
  width: number;
  height: number;
  tileWidth: number;
  tileHeight: number;
  centerX: number;
  centerY: number;
  scale: number;
};

function derivedSizes({
  width,
  height,
  scale
}: {
  width: number;
  height: number;
  scale: number;
}): Dimensions {
  const tileWidth = width / 8;

  return {
    width,
    height,
    tileWidth: tileWidth,
    tileHeight: tileWidth / 2,
    centerX: width / 2,
    centerY: height / 2,
    scale
  };
}
