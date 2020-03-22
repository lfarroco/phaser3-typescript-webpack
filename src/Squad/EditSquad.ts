import * as Phaser from 'phaser';
import {Chara} from '../Chara/Chara';
import {Image} from '../Models';
import {preload} from '../preload';
import {SquadMember, Squad} from '../Squad/Model';
import {saveSquadUnit, addUnitToSquad} from '../DB';
import UnitListScene from '../Unit/UnitListScene';
import {Unit} from '../Unit/Model';
import BoardScene, {BOARD_SCENE_KEY} from '../Board/BoardScene';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../constants';

const centerX = SCREEN_WIDTH / 2;
const centerY = SCREEN_HEIGHT / 2 - 100;
const tileWidth = 128;
const tileHeight = 64;

export class EditSquad extends Phaser.Scene {
  unitListScene: UnitListScene | null = null;
  boardScene: BoardScene | null = null;
  squad: Squad | null = null;
  constructor() {
    super('EditSquadScene');
    console.log(`constructor`);
  }

  preload = preload;

  create() {

    if (!this.squad) return;
    this.renderBoard(this.squad);

    const {boardScene} = this;

    if (!boardScene) return;
    this.renderUnitList(boardScene);
  }

  renderBoard(squad:Squad) {

    this.scene.start(BOARD_SCENE_KEY, {
      centerX,
      centerY,
      squad,
      tileWidth,
      tileHeight,
    });
    this.boardScene = this.scene.get(BOARD_SCENE_KEY) as BoardScene;
  }

  renderUnitList(boardScene:BoardScene) {

    const onDrag = (_: Unit, x: number, y: number) => {
      boardScene.tiles.forEach((tile) => tile.sprite.clearTint());
      const boardSprite = boardScene.findTileByXY({
        x: x,
        y: y,
      });

      if (boardSprite) boardSprite.sprite.setTint(0x33ff88);
    };
    const onDragEnd = (unit: Unit, x: number, y: number, chara: Chara) => {
      const boardSprite = boardScene.findTileByXY({
        x: x,
        y: y,
      });

      console.log(`dropped on `, boardSprite);

      if (boardSprite) {
        const updatedSquad = addUnitToSquad(
          unit,
          boardScene.squad,
          boardSprite.boardX,
          boardSprite.boardY,
        );

        boardScene.squad = updatedSquad;

        this.unitListScene?.removeUnit(unit);
        boardScene.addUnitToBoard(updatedSquad.members[unit.id]);
      } else {
        console.log(`lets return`, unit, this.unitListScene?.rows);

        this.unitListScene?.returnToOriginalPosition(unit);
        this.unitListScene?.scaleDown(chara);
      }
    };

    this.scene.start('UnitListScene', {onDrag, onDragEnd});

    this.unitListScene = this.scene.get('UnitListScene') as UnitListScene;
    //if (this.unitListScene)
    //  this.scene.add('unitList', this.unitListScene, true);
  }

  renderReturnBtn() {
    const {boardScene, unitListScene} = this;
    if (!boardScene || !unitListScene) return;
    const {unitList} = boardScene;
    if (!unitList) return;

    const btn = this.add.text(1100, 50, 'Return to title');
    btn.setInteractive();
    btn.on('pointerdown', () => {
      this.children.removeAll();
      this.scene.remove('unitList');
      unitListScene.rows.forEach((row) => this.scene.remove(row.chara.key));
      unitList.forEach((unit) => this.scene.remove(unit.key));
      this.scene.start('TitleScene');
    });
  }


  init(squad: Squad) {
    this.squad = squad;
  }

  
}
