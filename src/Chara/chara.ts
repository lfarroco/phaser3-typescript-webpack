import * as Phaser from 'phaser';

import { Unit, AnimatedUnit } from '../Unit/Model';
import { animate } from './animations/animate';
import { error, NOT_IMPLEMENTED } from '../errors';

export function singleChara(unit: Unit, front = true, onUnitClick = () => {}) {
  error(NOT_IMPLEMENTED);
}

export function chara(
  scene: Phaser.Scene,
  unit: Unit,
  cx: number,
  cy: number,
  scale: number,
  front: boolean,
  onUnitClick?: Function,
  onUnitDrag?: ((unit: any, x: number, y: number) => void) | undefined,
  onDragging?: ((x: number, y: number) => void) | undefined
) {
  const container = scene.add.container(cx, cy);

  const animatedUnit = animate(unit, container);

  if (front) {
    renderFrontCharacter(scene, container, animatedUnit);
  } else {
    renderBackCharacter(scene, container, animatedUnit);
  }

  container.depth = 5 * cy;

  if (unit.leader) {
    const insignea = scene.add.image(50, 0, 'insignea');

    container.add(insignea);
  }

  container.setSize(200, 200);

  //todo: auto adjust
  container.setInteractive();

  container.scale = scale;

  if (onUnitDrag) {
    scene.input.setDraggable(container);
  }

  if (onUnitClick)
    container.on('pointerdown', function(pointer: any) {
      console.log(`clicked`, unit);
      onUnitClick(unit);
    });

  animatedUnit.container = container;
  container.name = animatedUnit.id;

  return container;
}

function renderFrontCharacter(
  phaser: Phaser.Scene,
  container: any,
  unit: AnimatedUnit
) {
  function renderHead(gx: number, gy: number) {
    const head = phaser.add.image(gx, gy, 'head' + unit.style.head.toString());

    phaser.tweens.add({
      targets: head,
      y: gy - 2,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(head);
  }

  function renderFoot(footX: number, footY: number) {
    const foot = phaser.add.image(footX, footY, 'foot');

    container.add(foot);

    return foot;
  }

  function renderTrunk(trunkX: number, trunkY: number) {
    const trunk = phaser.add.image(
      trunkX,
      trunkY,
      'trunk' + unit.style.trunk.toString()
    );

    phaser.tweens.add({
      targets: trunk,
      y: trunkY + 2,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(trunk);
  }

  function renderHand(handX: number, handY: number) {
    const hand = phaser.add.image(handX, handY, 'hand');

    phaser.tweens.add({
      targets: hand,
      y: handY + 8,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(hand);
    return hand;
  }

  renderFoot(20, 90);
  renderFoot(-10, 97);

  const rightHand = renderHand(35, 55);
  rightHand.scaleX = rightHand.scaleX * -1;

  renderTrunk(0, 55);
  renderHead(0, 0);
  renderHand(-30, 60);
}
function renderBackCharacter(
  phaser: Phaser.Scene,
  container: any,
  unit: AnimatedUnit
) {
  function renderHead(gx: number, gy: number) {
    const head = phaser.add.image(
      gx,
      gy,
      'back_head' + unit.style.head.toString()
    );

    phaser.tweens.add({
      targets: head,
      y: gy - 2,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(head);
  }

  function renderFoot(footX: number, footY: number) {
    const foot = phaser.add.image(footX, footY, 'foot');

    foot.scaleX = -1;
    foot.rotation = 0.6;
    container.add(foot);

    return foot;
  }

  function renderTrunk(trunkX: number, trunkY: number) {
    const trunk = phaser.add.image(
      trunkX,
      trunkY,
      'back_trunk' + unit.style.trunk.toString()
    );

    phaser.tweens.add({
      targets: trunk,
      y: trunkY + 2,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(trunk);
  }

  function renderHand(handX: number, handY: number) {
    const hand = phaser.add.image(handX, handY, 'hand');

    phaser.tweens.add({
      targets: hand,
      y: handY + 8,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(hand);
    return hand;
  }

  renderFoot(10, 90);
  renderFoot(-10, 97);

  const rightHand = renderHand(35, 55);
  rightHand.scaleX = rightHand.scaleX * -1;

  renderTrunk(0, 55);
  renderHead(0, 0);
  renderHand(-30, 60);
}
