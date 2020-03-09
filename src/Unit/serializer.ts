import { Unit } from './Model';
import { maleNames } from '../constants/names';
import { randomItem, classes } from '../defaultData';
/**
 * @todo replace with reading data from the database (JSON) and generating a valid unit
 * @param n
 */
export function fromJSON(n: number): Unit {
  return {
    id: n.toString(),
    name: randomItem(maleNames),
    class: randomItem(classes),
    movement: 'mountain',
    elem: 'neutral',
    equips: {
      ornament: 'amulet',
      chest: 'iron_armor',
      mainHand: 'iron_sword',
      offHand: 'iron_shield'
    },
    squad: null,
    lvl: 11,
    hp: 100,
    exp: 99,
    str: 11,
    agi: 12,
    dex: 13,
    vit: 14,
    int: 15,
    wis: 16,
    style: {
      head: randomItem([1, 2, 3]),
      trunk: randomItem([1, 2, 3, 4])
    }
  };
}

export function toJSON(unit: Unit) {
  throw new Error('Not implemented.');
}
