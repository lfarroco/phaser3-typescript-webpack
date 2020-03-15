import Phaser from 'phaser';
import { Unit, UnitMap, getUnitsWithoutSquad } from './Model';
import { getUnits } from '../DB';
import { Chara } from '../Chara/Chara';

export default class UnitList extends Phaser.Scene {
  constructor(
    id: string,
    public parent: Phaser.Scene,
    public onDrag: (unit: Unit, x: number, y: number) => void,
    public onDragEnd: (unit: Unit, x: number, y: number) => void
  ) {
    super(id);
  }

  create() {
    const units = getUnitsWithoutSquad(getUnits());

    const onClick = (unit: Unit) => console.log(`onclick`, unit);

    const onDrag = (unit: Unit) => console.log(`dragging...`, unit.id);

    // const onDragEnd = (unit: Unit, x: number, y: number) =>
    //   console.log(`dragend!`, unit, x, y);

    Object.values(units)
      .slice(0, 5)
      .forEach((unit, index) => {
        const lineHeight = 200;
        const key = 'unit-list-' + unit.id;
        const chara = new Chara(
          key,
          this,
          unit,
          50,
          100 + lineHeight * index,
          1,
          true,
          onClick,
          onDrag,
          this.onDragEnd
        );

        this.scene.add(key, chara, true);

        this.add.text(100, 100 + lineHeight * index, unit.name);
      });
  }

  update() {}

  refresh() {}
}
