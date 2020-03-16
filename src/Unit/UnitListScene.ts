import Phaser from 'phaser';
import { Unit, UnitMap, getUnitsWithoutSquad } from './Model';
import { getUnits } from '../DB';
import { Chara } from '../Chara/Chara';

export default class UnitList extends Phaser.Scene {
  rows: { chara: Chara; text: Phaser.GameObjects.Text }[];
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
    this.rows = [];
    this.page = 0;
    this.totalPages = 0;
    this.itemsPerPage = 6;
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

    const unitsToRender = Object.values(units).slice(
      this.page * this.itemsPerPage,
      this.page * this.itemsPerPage + this.itemsPerPage
    );

    unitsToRender.forEach((unit, index) => {
      const { charaX, charaY, textX, textY } = getPosition(index);
      const key = this.makeUnitKey(unit);
      const chara = new Chara(
        key,
        this,
        unit,
        charaX,
        charaY,
        0.5,
        true,
        onClick,
        () => {
          chara.container?.setScale(1);
          this.scene.bringToTop(key);
          return onDrag;
        },
        this.onDragEnd
      );

      this.scene.add(key, chara, true);

      const text = this.add.text(textX, textY, unit.name);

      this.rows.push({ chara, text });
    });
  }

  private makeUnitKey(unit: Unit) {
    return 'unit-list-' + unit.id;
  }

  reposition(
    { chara, text }: { chara: Chara; text: Phaser.GameObjects.Text },
    index: number
  ) {
    const { charaX, charaY, textX, textY } = getPosition(index);

    this.tweens.add({
      targets: chara.container,
      x: charaX,
      y: charaY,
      duration: 600,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false
    });
    this.tweens.add({
      targets: text,
      x: textX,
      y: textY,
      duration: 600,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false
    });
  }

  removeUnit(unit: Unit) {
    const findUnit = (row: {
      chara: Chara;
      text: Phaser.GameObjects.Text;
    }): boolean => row.chara.key === this.makeUnitKey(unit);
    this.rows.filter(findUnit).forEach(row => {
      this.scene.remove(this.makeUnitKey(unit));
      this.children.remove(row.text);
    });

    this.rows = this.rows.filter(row => !findUnit(row));
    this.rows.forEach((row, index) => this.reposition(row, index));
  }
}
function getPosition(n: number) {
  const lineHeight = 100;
  return {
    charaX: 50,
    charaY: 50 + lineHeight * n,
    textX: 100,
    textY: 50 + lineHeight * n
  };
}
