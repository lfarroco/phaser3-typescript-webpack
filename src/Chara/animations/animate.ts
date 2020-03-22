import * as Phaser from 'phaser';

import { Unit, AnimatedUnit } from '../../Unit/Model';
import { Container } from '../../Models';

export function animate(
  unit: Unit,
  container: Container
): AnimatedUnit {
  return {
    ...unit,
    container: container,
    tweens: []
  };
}
