import Phaser from 'phaser';
import { Unit, UnitMap, getUnitsWithoutSquad } from './Model';
import { getUnits } from '../DB';
import { Chara } from '../Chara/Chara';

export default class UnitList extends Phaser.Scene {
  units: Unit[];
  page: number;
  totalPages: number;
  itemsPerPage: number;

  constructor(
    id: string,
    public parent: Phaser.Scene,
    public onDrag: (unit: Unit, x: number, y: number) => void,
    public onDragEnd: (unit: Unit, x: number, y: number, chara: Chara) => void
  ) {
    super(id);
    this.units = [];
    this.page = 0;
    this.totalPages = 0;
    this.itemsPerPage = 5;
  }

  create() {
    this.render();
  }

  render() {
    const units = getUnitsWithoutSquad(getUnits());

    const onClick = (unit: Unit) => console.log(`onclick`, unit);

    const onDrag = (unit: Unit) => console.log(`dragging...`, unit.id);

    // const onDragEnd = (unit: Unit, x: number, y: number) =>
    //   console.log(`dragend!`, unit, x, y);

    this.units = Object.values(units).slice(
      this.page * this.itemsPerPage,
      this.page * this.itemsPerPage + this.itemsPerPage
    );

    this.units.forEach((unit, index) => {
      const lineHeight = 200;
      const key = this.makeUnitKey(unit);
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

  private makeUnitKey(unit: Unit) {
    return 'unit-list-' + unit.id;
  }

  update() {}

  refreshScene() {
    this.children.removeAll();

    this.units.forEach(unit => this.scene.remove(this.makeUnitKey(unit)));

    this.render();
  }

  removeUnit(unit: Unit) {
    this.units.forEach(u =>
      u.id === unit.id ? this.scene.remove(this.makeUnitKey(unit)) : u
    );
  }
}
