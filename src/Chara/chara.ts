import * as Phaser from 'phaser';

import {Unit, AnimatedUnit} from '../Unit/Model';
import {animate} from './animations/animate';
import {error, NOT_IMPLEMENTED} from '../errors';
import {Container, Pointer} from '../Models';

export function singleChara(unit: Unit, front = true, onClick = () => {}) {
  error(NOT_IMPLEMENTED);
}

export class Chara extends Phaser.Scene {
  container: Container | null = null;
  constructor(
    public key: string,
    public parent: Phaser.Scene,
    public unit: Unit,
    public cx: number,
    public cy: number,
    public scaleSizing: number, // todo: rename
    public front: boolean,
    public onClick?: (unit: Unit) => void,
    public onDrag?: ((unit: Unit, x: number, y: number) => void) | undefined,
    public onDragEnd?:
      | ((unit: Unit, x: number, y: number, chara: Chara) => void)
      | undefined,
  ) {
    super(key);
    return this;
  }
  create() {
    this.container = this.add.container(this.cx, this.cy);

    this.container.depth = this.cy;

    const animatedUnit = animate(this.unit, this.container);

    if (this.front) {
      renderFrontCharacter(this, animatedUnit);
    } else {
      renderBackCharacter(this, animatedUnit);
    }

    this.maybeRenderInsignea();

    const container_width = 100;
    const container_height = 170;

    this.container.setSize(container_width, container_height);

    // DEBUG DRAG CONTAINER
    //var rect = new Phaser.Geom.Rectangle(
    //  (-1 * container_width) / 2,
    //  (-1 * container_height) / 2,
    //  container_width,
    //  container_height,
    //);
    //
    //var graphics = this.add.graphics({fillStyle: {color: 0x0000ff}});
    //graphics.alpha = 0.5;
    //
    //graphics.fillRectShape(rect);
    //this.container.add(graphics);

    this.container.scale = this.scaleSizing;

    animatedUnit.container = this.container;
    this.container.name = animatedUnit.id;

    this.makeInteractive();
  }

  private maybeRenderInsignea() {
    if (this.unit.leader && this.container) {
      const insignea = this.add.image(50, 0, 'insignea');
      this.container.add(insignea);
    }
  }

  makeInteractive() {
    if (!this.container) return;

    if (this.onDrag) {
      this.container.setInteractive();
      this.input.setDraggable(this.container);

      this.input.on(
        'drag',
        (pointer: Pointer, obj: Container, x: number, y: number) => {
          // console.log(`???`, this.container);
          // if (this.container) this.container.depth = Infinity;

          obj.x = x;
          obj.y = y;

          if (this.onDrag) this.onDrag(this.unit, x, y);
        },
      );
    }

    if (this.onDragEnd)
      this.container.on(
        'dragend',
        (pointer: Pointer, dragX: number, dragY: number) => {
          if (this.container) {
            this.container.depth = dragY;
          }
          if (this.onDragEnd)
            this.onDragEnd(
              this.unit,
              this.container?.x || 0,
              this.container?.y || 0,
              this,
            );
        },
      );

    if (this.onClick)
      this.container.on('pointerdown', (pointer: Pointer) => {
        console.log(`clicked`, this.unit);

        if (this.onClick) this.onClick(this.unit);
      });
  }
}

function renderFrontCharacter(scene: Chara, unit: AnimatedUnit) {
  function renderHead(gx: number, gy: number) {
    const head = scene.add.image(gx, gy, 'head' + unit.style.head.toString());

    scene.tweens.add({
      targets: head,
      y: gy - 2,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(head);
  }

  function renderFoot(footX: number, footY: number) {
    const foot = scene.add.image(footX, footY, 'foot');

    scene.container?.add(foot);

    return foot;
  }

  function renderTrunk(trunkX: number, trunkY: number) {
    const trunk = scene.add.image(
      trunkX,
      trunkY,
      'trunk' + unit.style.trunk.toString(),
    );

    scene.tweens.add({
      targets: trunk,
      y: trunkY + 2,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(trunk);
  }

  function renderHand(handX: number, handY: number) {
    const hand = scene.add.image(handX, handY, 'hand');

    scene.tweens.add({
      targets: hand,
      y: handY + 8,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(hand);
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
function renderBackCharacter(scene: Chara, unit: AnimatedUnit) {
  function renderHead(gx: number, gy: number) {
    const head = scene.add.image(
      gx,
      gy,
      'back_head' + unit.style.head.toString(),
    );

    scene.tweens.add({
      targets: head,
      y: gy - 2,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(head);
  }

  function renderFoot(footX: number, footY: number) {
    const foot = scene.add.image(footX, footY, 'foot');

    foot.scaleX = -1;
    foot.rotation = 0.6;
    scene.container?.add(foot);

    return foot;
  }

  function renderTrunk(trunkX: number, trunkY: number) {
    const trunk = scene.add.image(
      trunkX,
      trunkY,
      'back_trunk' + unit.style.trunk.toString(),
    );

    scene.tweens.add({
      targets: trunk,
      y: trunkY + 2,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(trunk);
  }

  function renderHand(handX: number, handY: number) {
    const hand = scene.add.image(handX, handY, 'hand');

    scene.tweens.add({
      targets: hand,
      y: handY + 8,
      duration: 1600,
      yoyo: true,
      repeat: -1,
    });

    scene.container?.add(hand);
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
