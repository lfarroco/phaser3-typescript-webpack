import { Modifier, ItemSlot, ItemMap } from '../Item/Model';
import { sum } from '../utils/math';

export type UnitMap = { [x: string]: Unit };

export type Stat = 'str' | 'agi' | 'dex' | 'vit' | 'int' | 'wis';

export type Elem =
  | 'fire'
  | 'water'
  | 'earth'
  | 'wind'
  | 'light'
  | 'shadow'
  | 'neutral';

export type UnitClass = 'fighter' | 'apprentice' | 'archer';
export type Movement = 'plain' | 'mountain' | 'sky' | 'forest';

/**
 * Database representation of a unit. Contains basic data.
 */
export interface Unit {
  id: string;
  name: string;
  class: UnitClass;
  movement: Movement;
  squad: string | null;
  lvl: number;
  hp: number;
  exp: number;
  str: number;
  agi: number;
  dex: number;
  vit: number;
  int: number;
  wis: number;
  style: {
    head: number;
    trunk: number;
  };
  equips: {
    [x in ItemSlot]: string;
  };
  elem: Elem;
  leader?: boolean;
  container?: Phaser.GameObjects.Container;
  tweens?: Phaser.Tweens.Tween[];
}

interface Animated {
  tweens: Phaser.Tweens.Tween[];
  container: Phaser.GameObjects.Container;
}

/**
 * Object actually rendered on screen. Contains Phaser artifacts and
 * data derived from the Unit type
 */
export type AnimatedUnit = Unit & Animated;

export const makeAnimatedUnit: (
  scene: Phaser.Scene,
  unit: Unit
) => AnimatedUnit = (scene: Phaser.Scene, unit: Unit) => {
  return {
    ...unit,
    container: scene.add.container(0, 0),
    tweens: []
  };
};

function getItemModifier({
  unit,
  stat,
  items,
  slot
}: {
  unit: Unit;
  stat: Modifier;
  items: ItemMap;
  slot: ItemSlot;
}) {
  const itemId = unit.equips[slot];

  const item = items[itemId];

  if (!item) {
    throw new Error('Invalid State: Item should be in index');
  }

  const modifier = item.modifiers[stat];

  if (modifier) return modifier;
  else return 0;
}

const equipKeys: ItemSlot[] = ['mainHand', 'offHand', 'chest', 'ornament'];

export function getActualStat(stat: Stat, items: ItemMap, unit: Unit) {
  const value = unit[stat];

  const values = equipKeys.map(equip =>
    getItemModifier({ unit, stat, items, slot: equip })
  );

  return value + values.reduce(sum, 0);
}

export function getUnitsWithoutSquad(map: UnitMap) {
  return Object.values(map).reduce(
    (acc, curr) => (curr.squad ? acc : { ...acc, [curr.id]: curr }),
    {} as UnitMap
  );
}
