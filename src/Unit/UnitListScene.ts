import Phaser from 'phaser';
import { Unit, UnitMap } from './Model';
import { getUnits } from '../DB';
import { chara } from '../Chara/chara';
export default class UnitList extends Phaser.Scene {
  parent: Phaser.Scene;
  onDrag: (unit: Unit, x: number, y: number) => void;
  onDragEnd: (id: string, x: number, y: number) => void;

  constructor(
    id: string,
    parent: Phaser.Scene,
    onDrag: (unit: Unit, x: number, y: number) => void,

    onDragEnd: (unit: string, x: number, y: number) => void
  ) {
    super(id);

    console.log('constructor');

    this.parent = parent;
    this.onDrag = onDrag;
    this.onDragEnd = onDragEnd;
    return this;
  }

  create() {
    console.log(`CREATE`, this);

    const units = getUnits();

    Object.values(units)
      .slice(0, 5)
      .forEach((unit, index) => {
        const container = chara(this, unit, 50, 100 + 100 * index, 0.5, true);

        container.setInteractive();
        this.input.setDraggable(container);
        this.input.on(
          'drag',
          (
            pointer: Phaser.Input.Pointer,
            obj: Phaser.GameObjects.Container,
            x: number,
            y: number
          ) => {
            obj.x = x;
            obj.y = y;

            this.onDrag(unit, x, y);
          }
        );

        this.input.on(
          'dragend',
          (
            pointer: Phaser.Input.Pointer,
            obj: Phaser.GameObjects.Container,
            x: number,
            y: number
          ) => {
            this.onDragEnd(obj.name, x, y);
          }
        );

        this.add.text(100, 100 + 100 * index, unit.name);
      });
  }

  update() {}

  refresh() {}
}
