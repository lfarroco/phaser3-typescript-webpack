import { UnitClass, Unit, UnitMap } from './Unit/Model';
import {
  Item,
  ItemType,
  Modifier,
  itemTypeSlots,
  modifiers,
  ItemModifiers,
  ItemSlot,
  ItemMap,
  ItemTypeSlots
} from './Item/Model';
import itemsJSON from './constants/items.json';
import { idfy } from './utils/idfy';
import { fromJSON } from './Unit/serializer';
import { indexById } from './utils';
import { SquadMap } from './Squad/Model';
import { Player } from './Player/Model';

// cleans up data on boot
const OVERRIDE = false;

export const classes: UnitClass[] = ['fighter', 'apprentice'];

export const randomItem = (items: any[]) =>
  items[Math.floor(Math.random() * items.length)];

export var units: UnitMap = indexById(
  Array.from({ length: 20 }, (x, i) => i).map(unitJSON => fromJSON(unitJSON))
);

function squad(n: number, leader: Unit) {
  leader.squad = n.toString();

  return {
    id: n.toString(),
    name: leader.name,
    emblem: 'Emoji',
    members: {
      [leader.id]: { id: leader.id, leader: true, x: 2, y: 2 }
    }
  };
}

export var squads: SquadMap = {};
for (var j = 0; j < 3; j++) squads[j.toString()] = squad(j, units[j]);

function makeItem(acc: Item[], itemData: any): Item[] {
  const { type, name } = itemData;

  const modifierList = Object.keys(modifiers) as Modifier[];

  const reduceModifiers = (acc: ItemModifiers, [k, v]: [Modifier, string]) => {
    if (modifierList.includes(k)) return { ...acc, [k]: parseInt(v) };
    else return acc;
  };
  const itemModifierList = Object.entries(itemData).filter(
    ([k]) => ['name', 'type', 'description'].indexOf(k) < 0
  );

  const itemModifiers: ItemModifiers = (itemModifierList as [
    Modifier,
    string
  ][]).reduce(reduceModifiers, modifiers);

  const slot: ItemSlot = itemTypeSlots[type as ItemType];

  if (!itemTypeSlots[type as ItemType]) return acc;
  else
    return acc.concat([
      {
        id: idfy(itemData.name),
        name: name,
        type: type,
        slot: slot,
        description: itemData.description,
        modifiers: itemModifiers
      }
    ]);
}

export var items: ItemMap = indexById(itemsJSON.reduce(makeItem, []));

export var player: Player = {
  id: 'player_1',
  name: 'Player Derp',
  gold: 100,
  iventory: {
    iron_sword: 2,
    steel_sword: 1
  }
};

const data: [
  string,
  UnitMap | SquadMap | ItemMap | ItemTypeSlots | Player
][] = [
  ['units', units],
  ['squads', squads],
  ['items', items],
  ['itemTypes', itemTypeSlots],
  ['player', player]
];

export const clearDB = () => {
  data.forEach(([k, v]) => {
    localStorage.setItem(k, JSON.stringify(v));
  });
  alert('db cleared!');
};

export default () => {
  data.forEach(([k, v]) => {
    if (localStorage.getItem(k) === null || OVERRIDE)
      localStorage.setItem(k, JSON.stringify(v));
  });
};
