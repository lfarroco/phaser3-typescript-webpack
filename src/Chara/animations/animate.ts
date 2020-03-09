import * as Phaser from 'phaser';

import { Unit, AnimatedUnit } from '../../Unit/Model';

export function animate(
  unit: Unit,
  container: Phaser.GameObjects.Container
): AnimatedUnit {
  return {
    ...unit,
    container: container,
    tweens: []
  };
}
