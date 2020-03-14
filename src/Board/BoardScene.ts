import * as Phaser from 'phaser';
import { Chara } from '../Chara/chara';
import { CenterX, CenterY, TileHeight, TileWidth } from '../Models';
import { preload } from '../preload';
import { SquadMember, SquadMemberMap, Squad } from '../Squad/Model';
import { cartesianToIsometric } from '../utils/isometric';
import { getUnit, saveSquad, saveSquadUnit } from '../DB';

import UnitList from '../Unit/UnitListScene';
import { Unit } from '../Unit/Model';

type BoardTile = {
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
  boardX: number;
  boardY: number;
};

export type BoardSceneParameters = {
  centerX: number;
  centerY: number;
  tileWidth: number;
  tileHeight: number;
  squad: Squad;
};

export class BoardScene extends Phaser.Scene {
  constructor() {
    super('BoardScene');
  }

  unitList: Chara[] = [];
  tiles: BoardTile[] = [];

  preload = preload;

  create(data: BoardSceneParameters) {
    const { centerX, centerY, squad, tileWidth, tileHeight } = data;

    this.renderReturnBtn();

    this.renderUnitList(tileWidth, tileHeight);

    let dragStart: { x: number; y: number } | null = null;
    let isDragging = false;

    this.tiles = placeTiles({
      manaScene: this,
      tileWidth,
      tileHeight,
      centerX,
      centerY,
      mapWidth: 3,
      mapHeight: 3
    });
    this.unitList = this.placeUnits({
      scene: this,
      tileWidth,
      tileHeight,
      centerX,
      centerY,
      squad
    });

    // this.input.on('dragstart', function(
    //   pointer: Phaser.Input.Pointer,
    //   gameObjects: Phaser.GameObjects.Container
    // ) {
    //   dragStart = { x: pointer.x * 1, y: pointer.y * 1 };
    //   //todo: fix typing? here it is returning GameObject[]
    //   (gameObjects.list as Phaser.GameObjects.Sprite[]).map(sprite =>
    //     sprite.setTint(0xeaeaea)
    //   );

    //   gameObjects.depth = Infinity;
    // });

    // this.scene.scene.input.on(
    //   'dragend',
    //   (
    //     pointer: Phaser.Input.Pointer,
    //     gameObject: Phaser.GameObjects.Container
    //   ) => {
    //     if (
    //       !isDragging &&
    //       dragStart &&
    //       Math.abs(dragStart.x - pointer.x) < tileWidth / 4
    //     ) {
    //       console.log(
    //         `Drag stopped before end of treshold`,
    //         Math.abs(dragStart.x - pointer.x),
    //         tileWidth / 2
    //       );

    //       dragStart = null;
    //       isDragging = false;
    //       return;
    //     }

    //     dragStart = null;

    //
    //   }
    // );
  }
  private renderUnitList(tileWidth: number, tileHeight: number) {
    const onDrag = (unit: Unit, x: number, y: number) => {
      this.tiles.forEach(tile => tile.sprite.clearTint());
      const boardSprite = findTileByXY({
        tiles: this.tiles,
        tileWidth,
        tileHeight,
        x: x,
        y: y
      });

      if (boardSprite) boardSprite.sprite.setTint(0x33ff88);
    };
    const onDragEnd = (id: string, x: number, y: number) => {
      console.log(`drag end`, id, x, y);
    };

    const unitList = new UnitList('unitList', this, onDrag, onDragEnd);
    this.scene.add('unitList', unitList, true);
  }

  renderReturnBtn() {
    const btn = this.add.text(1100, 100, 'Return to title');
    btn.setInteractive();
    btn.on('pointerdown', () => {
      this.scene.start('TitleScene');
    });
  }
  changeUnitPosition({
    unit,
    squad,
    squadMember,
    tileWidth,
    tileHeight,
    centerX,
    centerY,
    boardSprite
  }: {
    unit: Unit;
    squad: Squad;
    squadMember: SquadMember;
    tileWidth: number;
    tileHeight: number;
    centerX: number;
    centerY: number;
    boardSprite: BoardTile;
  }) {
    const { x, y } = getUnitPositionInScreen(
      squadMember,
      tileWidth,
      tileHeight,
      centerX,
      centerY
    );

    this.tweens.add({
      targets: this.getChara(unit)?.container,
      x: x,
      y: y,
      ease: 'Cubic',
      duration: 400,
      repeat: 0,
      paused: false,
      yoyo: false
    });

    saveSquadUnit({
      squadId: squad.id,
      unitId: squadMember.id,
      x: squadMember.x,
      y: squadMember.y
    });
  }
  onUnitDragEnd({
    tiles,
    squad,
    tileWidth,
    tileHeight,
    centerX,
    centerY
  }: {
    tiles: BoardTile[];
    squad: Squad;
    tileWidth: number;
    tileHeight: number;
    centerX: number;
    centerY: number;
  }) {
    return (unit: Unit, x: number, y: number) => {
      console.log(tiles, x, y);
      const boardSprite = findTileByXY({
        tiles: tiles,
        tileWidth,
        tileHeight,
        x,
        y
      });

      const squadMember = squad.members[unit.id];

      if (!squadMember)
        throw new Error('Invalid state. Unit should be in board object.');

      const isMoved = () =>
        (boardSprite && squadMember.x !== boardSprite.boardX) ||
        (boardSprite && squadMember.y !== boardSprite.boardY);

      console.log(`>>>`, boardSprite, isMoved());
      if (boardSprite && isMoved()) {
        const updatedSquadMember = {
          ...squadMember,
          x: boardSprite.boardX,
          y: boardSprite.boardY
        };

        this.changeUnitPosition({
          unit,
          squad,
          squadMember: updatedSquadMember,
          tileWidth,
          tileHeight,
          centerX,
          centerY,
          boardSprite
        });
      } else {
        const { x, y } = getUnitPositionInScreen(
          squadMember,
          tileWidth,
          tileHeight,
          centerX,
          centerY
        );

        this.tweens.add({
          targets: this.getChara(unit)?.container,
          x: x,
          y: y,
          ease: 'Cubic',
          duration: 400,
          repeat: 0,
          paused: false,
          yoyo: false
        });
      }

      this.tiles.map(boardSprite => boardSprite.sprite.clearTint());
      (this.getChara(unit)?.container
        ?.list as Phaser.GameObjects.Image[]).map(sprite => sprite.clearTint());
    };
  }
  private getChara(unit: Unit) {
    return this.unitList.find(chara => chara.key === this.makeUnitKey(unit));
  }

  placeUnits({
    scene,
    tileWidth,
    tileHeight,
    centerX,
    centerY,
    squad
  }: {
    scene: BoardScene;
    tileWidth: number;
    tileHeight: number;
    centerX: number;
    centerY: number;
    squad: Squad;
  }): Chara[] {
    const initial: Chara[] = [];
    const reducer = (acc: Chara[], squadMember: SquadMember) => {
      const { x, y } = getUnitPositionInScreen(
        squadMember,
        tileWidth,
        tileHeight,
        centerX,
        centerY
      );

      const unit = getUnit(squadMember.id);
      if (!unit) return acc;

      const key = this.makeUnitKey(unit);
      const chara = new Chara(
        key,
        scene,
        unit,
        x,
        y,
        1,
        true,
        () => {},
        onUnitDrag({ tiles: scene.tiles, tileWidth, tileHeight }),
        this.onUnitDragEnd({
          tiles: scene.tiles,
          squad,
          tileWidth,
          tileHeight,
          centerX,
          centerY
        })
      );

      scene.scene.add(key, chara, true);
      return acc.concat([chara]);
    };
    return Object.values(squad.members).reduce(reducer, initial);
  }

  private makeUnitKey(unit: Unit) {
    return `board-${unit.id}`;
  }
}

function getUnitPositionInScreen(
  unit: SquadMember,
  tileWidth: TileWidth,
  tileHeight: TileHeight,
  centerX: CenterX,
  centerY: CenterY
) {
  const { x, y } = cartesianToIsometric(
    unit.x,
    unit.y,
    centerX,
    centerY,
    tileWidth,
    tileHeight
  );

  //fixme: unit should be rendered at origin 0.5
  return { x, y: y - 230 };
}

function onDragEnd(
  squadMember: SquadMember,
  tiles: BoardTile[],
  tileWidth: number,
  tileHeight: number,
  onDragEndCallback: Function
) {
  return function(unit: Unit, x: number, y: number) {
    const tile = tiles.find(
      isPointerInTile({ x: x, y: y }, tileWidth, tileHeight)
    );

    if (tile) {
      onDragEndCallback(unit, tile.x, tile.y);
    }

    tiles.map(tile => tile.sprite.clearTint());
  };
}

function findTileByXY({
  tiles,
  tileWidth,
  tileHeight,
  x,
  y
}: {
  tiles: BoardTile[];
  tileWidth: number;
  tileHeight: number;
  x: number;
  y: number;
}) {
  return tiles.find(isPointerInTile({ x, y: y + 100 }, tileWidth, tileHeight));
}

function onUnitDrag({
  tiles,
  tileWidth,
  tileHeight
}: {
  tiles: BoardTile[];
  tileWidth: number;
  tileHeight: number;
}) {
  return function(unit: Unit, x: number, y: number) {
    const boardSprite = findTileByXY({ tiles, tileWidth, tileHeight, x, y });

    tiles.map(tile => tile.sprite.clearTint());

    if (boardSprite) {
      boardSprite.sprite.setTint(0x00cc00);
    }
  };
}

function placeTiles({
  manaScene,
  tileWidth,
  tileHeight,
  centerX,
  centerY,
  mapWidth,
  mapHeight
}: {
  manaScene: BoardScene;
  tileWidth: number;
  tileHeight: number;
  centerX: number;
  centerY: number;
  mapWidth: number;
  mapHeight: number;
}) {
  var grid: null[][] = [[]];
  let tiles: BoardTile[] = [];

  for (var x = 0; x < mapWidth; x++) {
    grid[x] = [];
    for (var y = 0; y < mapHeight; y++) grid[x][y] = null;
  }

  grid.forEach((row, yIndex) => {
    row.forEach((_, xIndex) => {
      var { x, y } = cartesianToIsometric(
        xIndex,
        yIndex,
        centerX,
        centerY,
        tileWidth,
        tileHeight
      );

      const tileSprite = manaScene.add.image(x, y, 'tile');
      tileSprite.depth = y;

      tileSprite.setInteractive();

      tiles.push({
        sprite: tileSprite,
        x,
        y,
        boardX: xIndex + 1,
        boardY: yIndex + 1
      });
    });
  });

  manaScene.input.on('pointerdown', function(pointer: Phaser.Input.Pointer) {
    manaScene.tiles
      .filter(isPointerInTile(pointer, tileWidth, tileHeight))
      .forEach(tile => {
        console.log(`clicked>>`, tile.x, tile.y);
      });
  });

  return tiles;
}

function isPointerInTile(
  pointer: { x: number; y: number },
  tileWidth: number,
  tileHeight: number
) {
  return function(tile: BoardTile) {
    const dx = Math.abs(tile.sprite.x - pointer.x);
    const dy = Math.abs(tile.sprite.y - pointer.y);
    const deltaX = dx / tileWidth;
    const deltaY = dy / tileHeight;

    return deltaX + deltaY < 1;
  };
}
