/** Actual coordinate in screen of pixel or pointer position */
export type Point2D = {
  x: number;
  y: number;
};

export type CenterX = number;
export type CenterY = number;
export type TileWidth = number;
export type TileHeight = number;

export type BoardPiece = {
  x: 1 | 2 | 3;
  Y: 1 | 2 | 3;
};

export type Pointer = Phaser.Input.Pointer
export type Image = Phaser.GameObjects.Image
export type Container = Phaser.GameObjects.Container
export type Text = Phaser.GameObjects.Text
export type Tween = Phaser.Tweens.Tween;
