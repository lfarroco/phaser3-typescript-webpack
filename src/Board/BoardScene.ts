import * as Phaser from 'phaser';
import {Chara} from '../Chara/Chara';
import {CenterX, CenterY, TileHeight, TileWidth, Image} from '../Models';
import {preload} from '../preload';
import {SquadMember, Squad} from '../Squad/Model';
import {cartesianToIsometric} from '../utils/isometric';
import {getUnit, saveSquadUnit} from '../DB';
import {Unit} from '../Unit/Model';

type BoardTile = {
  sprite: Image;
  x: number;
  y: number;
  boardX: number;
  boardY: number;
};

export const BOARD_SCENE_KEY = 'BoardScene';

export default class BoardScene extends Phaser.Scene {
  tiles: BoardTile[] = [];
  unitList: Chara[] = [];

  constructor(
    public centerX: number,
    public centerY: number,
    public squad: Squad,
    public tileWidth: number,
    public tileHeight: number,
  ) {
    super(BOARD_SCENE_KEY);
    console.log(`boardScene constructor`);
  }

  preload = preload;

  init(data: any) {
    console.log(`board scene init, data`);
    this.centerX = data.centerX;
    this.centerY = data.centerY;
    this.squad = data.squad;
    this.tileWidth = data.tileWidth;
    this.tileHeight = data.tileHeight;
  }

  create() {
    this.render();
  }
  render() {
    this.tiles = this.placeTiles({
      mapWidth: 3,
      mapHeight: 3,
    });
    this.unitList = this.placeUnits();
  }
  findTileByXY({x, y}: {x: number; y: number}) {
    return this.tiles.find(
      isPointerInTile({x, y: y + 100}, this.tileWidth, this.tileHeight),
    );
  }

  changeUnitPosition({
    unit,
    squadMember,
    chara,
  }: {
    unit: Unit;
    squadMember: SquadMember;
    chara?: Chara;
  }) {
    const {tileWidth, tileHeight, centerX, centerY, squad} = this;
    const {x, y} = getUnitPositionInScreen(
      squadMember,
      tileWidth,
      tileHeight,
      centerX,
      centerY,
    );

    console.log(`unit position in screen will be`, x, y);

    const target = chara ? chara : this.getChara(unit);

    if (chara) this.unitList.push(chara);

    console.log(`target`, unit.name, target);
    this.tweens.add({
      targets: target?.container,
      x,
      y,
      ease: 'Cubic',
      duration: 400,
      repeat: 0,
      paused: false,
      yoyo: false,
    });

    saveSquadUnit({
      squadId: squad.id,
      unitId: squadMember.id,
      x: squadMember.x,
      y: squadMember.y,
    });
  }
  onUnitDragEnd() {
    const {squad, tileWidth, tileHeight} = this;

    return (unit: Unit, x: number, y: number) => {
      console.log(this.tiles, x, y);
      const boardSprite = this.findTileByXY({
        x,
        y,
      });

      const squadMember = squad.members[unit.id];

      if (!squadMember)
        throw new Error('Invalid state. Unit should be in board object.');

      const isMoved = () =>
        (boardSprite && squadMember.x !== boardSprite.boardX) ||
        (boardSprite && squadMember.y !== boardSprite.boardY);

      if (boardSprite && isMoved()) {
        const updatedSquadMember = {
          ...squadMember,
          x: boardSprite.boardX,
          y: boardSprite.boardY,
        };

        this.changeUnitPosition({
          unit,
          squadMember: updatedSquadMember,
        });
      } else {
        const {x, y} = getUnitPositionInScreen(
          squadMember,
          tileWidth,
          tileHeight,
          this.centerX,
          this.centerY,
        );

        this.tweens.add({
          targets: this.getChara(unit)?.container,
          x: x,
          y: y,
          ease: 'Cubic',
          duration: 400,
          repeat: 0,
          paused: false,
          yoyo: false,
        });
      }

      this.tiles.map((boardSprite) => boardSprite.sprite.clearTint());
      (this.getChara(unit)?.container?.list as Image[]).map((sprite) =>
        sprite.clearTint(),
      );
    };
  }
  private getChara(unit: Unit) {
    return this.unitList.find((chara) => chara.key === this.makeUnitKey(unit));
  }
  placeTiles({mapWidth, mapHeight}: {mapWidth: number; mapHeight: number}) {
    var grid: null[][] = [[]];
    let tiles: BoardTile[] = [];

    for (var x = 0; x < mapWidth; x++) {
      grid[x] = [];
      for (var y = 0; y < mapHeight; y++) grid[x][y] = null;
    }

    grid.forEach((row, yIndex) => {
      row.forEach((_, xIndex) => {
        var {x, y} = cartesianToIsometric(
          xIndex,
          yIndex,
          this.centerX,
          this.centerY,
          this.tileWidth,
          this.tileHeight,
        );

        const tileSprite = this.add.image(x, y, 'tile');
        tileSprite.depth = y;

        tileSprite.setInteractive();

        tiles.push({
          sprite: tileSprite,
          x,
          y,
          boardX: xIndex + 1,
          boardY: yIndex + 1,
        });
      });
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.tiles
        .filter(isPointerInTile(pointer, this.tileWidth, this.tileHeight))
        .forEach((tile) => {
          console.log(`clicked>>`, tile.x, tile.y);
        });
    });

    return tiles;
  }

  addUnitToBoard(squadMember: SquadMember) {
    const {x, y} = getUnitPositionInScreen(
      squadMember,
      this.tileWidth,
      this.tileHeight,
      this.centerX,
      this.centerY,
    );

    const unit = getUnit(squadMember.id);

    if (!unit) throw new Error('Invalid member supplied');

    const key = this.makeUnitKey(unit);
    const chara = new Chara(
      key,
      this,
      unit,
      x,
      y,
      1,
      true,
      () => {},
      this.onUnitDrag(),
      this.onUnitDragEnd(),
    );

    this.scene.add(key, chara, true);

    return chara;
  }
  onUnitDrag() {
    return (unit: Unit, x: number, y: number) => {
      const boardSprite = this.findTileByXY({
        x,
        y,
      });

      this.tiles.map((tile) => tile.sprite.clearTint());

      if (boardSprite) {
        boardSprite.sprite.setTint(0x00cc00);
      }

      this.scene.bringToTop(this.makeUnitKey(unit));
    };
  }

  placeUnits(): Chara[] {
    const {squad} = this;
    const initial: Chara[] = [];
    const reducer = (acc: Chara[], squadMember: SquadMember) => {
      const chara = this.addUnitToBoard(squadMember);
      return acc.concat([chara]);
    };
    return Object.values(squad.members).reduce(reducer, initial);
  }

  private makeUnitKey(unit: Unit) {
    return `board-${unit.id}`;
  }
}

function getUnitPositionInScreen(
  squadMember: SquadMember,
  tileWidth: TileWidth,
  tileHeight: TileHeight,
  centerX: CenterX,
  centerY: CenterY,
) {
  const {x, y} = cartesianToIsometric(
    squadMember.x,
    squadMember.y,
    centerX,
    centerY,
    tileWidth,
    tileHeight,
  );

  //fixme: unit should be rendered at origin 0.5
  return {x, y: y - 230};
}

function onDragEnd(
  squadMember: SquadMember,
  tiles: BoardTile[],
  tileWidth: number,
  tileHeight: number,
  onDragEndCallback: Function,
) {
  return function(unit: Unit, x: number, y: number) {
    const tile = tiles.find(
      isPointerInTile({x: x, y: y}, tileWidth, tileHeight),
    );

    if (tile) {
      onDragEndCallback(unit, tile.x, tile.y);
    }

    tiles.map((tile) => tile.sprite.clearTint());
  };
}

function isPointerInTile(
  pointer: {x: number; y: number},
  tileWidth: number,
  tileHeight: number,
) {
  return function(tile: BoardTile) {
    const dx = Math.abs(tile.sprite.x - pointer.x);
    const dy = Math.abs(tile.sprite.y - pointer.y);
    const deltaX = dx / tileWidth;
    const deltaY = dy / tileHeight;

    return deltaX + deltaY < 1;
  };
}
