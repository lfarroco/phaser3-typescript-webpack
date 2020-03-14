import Phaser from 'phaser';
import { Unit, UnitMap } from './Model';
import { getUnits } from '../DB';
import { Chara } from '../Chara/chara';
export default class UnitList extends Phaser.Scene {
  constructor(
    id: string,
    public parent: Phaser.Scene,
    public onDrag: (unit: Unit, x: number, y: number) => void,
    public onDragEnd: (unit: string, x: number, y: number) => void
  ) {
    super(id);
  }

  create() {
    const units = getUnits();

    const onClick = (unit: Unit) => console.log(`onclick`, unit);

    const onDrag = (unit: Unit) => console.log(`dragging...`, unit.id);

    const onDragEnd = (unit: Unit, x: number, y: number) =>
      console.log(`dragend!`, unit, x, y);

    Object.values(units)
      .slice(0, 5)
      .forEach((unit, index) => {
        const key = 'unit-list-' + unit.id;
        const chara = new Chara(
          key,
          this,
          unit,
          50,
          100 + 100 * index,
          0.5,
          true,
          onClick,
          onDrag,
          onDragEnd
        );

        this.scene.add(key, chara, true);

        // this.input.setDraggable(container);
        // this.input.on(
        //   'drag',
        //   (
        //     pointer: Phaser.Input.Pointer,
        //     obj: Phaser.GameObjects.Container,
        //     x: number,
        //     y: number
        //   ) => {
        //     obj.x = x;
        //     obj.y = y;

        //     this.onDrag(unit, x, y);
        //   }
        // );

        // this.input.on(
        //   'dragend',
        //   (
        //     pointer: Phaser.Input.Pointer,
        //     obj: Phaser.GameObjects.Container,
        //     x: number,
        //     y: number
        //   ) => {
        //     this.onDragEnd(obj.name, x, y);
        //   }
        // );

        this.add.text(100, 100 + 100 * index, unit.name);
      });
  }

  update() {}

  refresh() {}
}
