import Phaser from 'phaser';
import {Unit, UnitMap, getUnitsWithoutSquad} from './Model';
import {getUnits} from '../DB';
import {Chara} from '../Chara/Chara';
import {error, INVALID_STATE} from '../errors';
import {BASE_WINDOW_SIZE} from '../constants/window';
import {Pointer, Text} from '../Models';

export default class UnitListScene extends Phaser.Scene {
  rows: {chara: Chara; text: Text}[];
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onDrag: (unit:Unit, x:number,y:number)=>void = ()=>{}
  onDragEnd: ()=>void = ()=>{}

  constructor() {
    super('UnitListScene');
    this.rows = [];
    this.page = 0;
    this.totalPages = 0;
    this.itemsPerPage = 6;
  }

  create({onDrag, onDragEnd}: any) {

    this.onDrag = onDrag
    this.onDragEnd = onDragEnd

    this.render();
    this.renderControls();
  }

  renderControls() {
    const next = this.add.image(
      200,
      BASE_WINDOW_SIZE.BASE_WINDOW_HEIGHT + 60,
      'arrow_right',
    );
    next.setInteractive();
    next.on('pointerdown', (_: Pointer) => {
      this.nextPage();
    });

    const prev = this.add.image(
      100,
      BASE_WINDOW_SIZE.BASE_WINDOW_HEIGHT + 60,
      'arrow_right',
    );
    prev.setScale(-1,1)
    prev.setInteractive();
    prev.on('pointerdown', (_: Pointer) => {
      this.prevPage();
    });

  }

  nextPage() {

    this.page = this.page + 1;
    this.clearUnitList();
    this.render();
  }

  prevPage(){

    this.page = this.page -1;
    this.clearUnitList();
    this.render();

  }

  clearUnitList() {

    this.rows.forEach((row) => {
      this.scene.remove(row.chara.key);
      this.children.remove(row.text);
    });

    this.rows = []
  }

  render() {
    const units = getUnitsWithoutSquad(getUnits());

    const onClick = (unit: Unit) => console.log(`onclick`, unit);

    const unitsToRender = Object.values(units).slice(
      this.page * this.itemsPerPage,
      this.page * this.itemsPerPage + this.itemsPerPage,
    );

    unitsToRender.forEach((unit, index) => {
      const {charaX, charaY, textX, textY} = this.getUnitPosition(index);
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
        (unit:Unit, x:number,y:number) => {
          this.scaleUp(chara);
          this.scene.bringToTop(key);
          return this.onDrag(unit,x,y);
        },
        this.onDragEnd,
      );

      this.scene.add(key, chara, true);

      const text = this.add.text(textX, textY, unit.name);

      this.rows.push({chara, text});
    });
  }

  private getUnitPosition(index: number) {
    const lineHeight = 100;
    return {
      charaX: 50,
      charaY: 50 + lineHeight * index,
      textX: 100,
      textY: 50 + lineHeight * index,
    };
  }

  private getUnitIndex(unit: Unit) {
    return this.rows.findIndex(
      (row) => row.chara.key === this.makeUnitKey(unit),
    );
  }

  returnToOriginalPosition(unit: Unit) {
    const index = this.getUnitIndex(unit);

    const row = this.rows.find(
      (row) => row.chara.key === this.makeUnitKey(unit),
    );

    if (!row) {
      return error(INVALID_STATE);
    }

    this.reposition(row, index);
  }

  scaleUp(chara: Chara) {
    this.tweens.add({
      targets: chara.container,
      scale: 1,
      duration: 400,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false,
    });
  }
  scaleDown(chara: Chara) {
    this.tweens.add({
      targets: chara.container,
      scale: 0.5,
      duration: 400,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false,
    });
  }

  makeUnitKey(unit: Unit) {
    return 'unit-list-' + unit.id;
  }

  reposition({chara, text}: {chara: Chara; text: Text}, index: number) {
    const {charaX, charaY, textX, textY} = this.getUnitPosition(index);

    this.tweens.add({
      targets: chara.container,
      x: charaX,
      y: charaY,
      duration: 600,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false,
    });
    this.tweens.add({
      targets: text,
      x: textX,
      y: textY,
      duration: 600,
      ease: 'Cubic',
      repeat: 0,
      paused: false,
      yoyo: false,
    });
  }

  removeUnit(unit: Unit) {
    const findUnit = (row: {chara: Chara; text: Text}): boolean =>
      row.chara.key === this.makeUnitKey(unit);
    this.rows.filter(findUnit).forEach((row) => {
      this.scene.remove(this.makeUnitKey(unit));
      this.children.remove(row.text);
    });

    this.rows = this.rows.filter((row) => !findUnit(row));
    this.rows.forEach((row, index) => this.reposition(row, index));
  }
}
