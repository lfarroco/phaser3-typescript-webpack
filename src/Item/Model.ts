/**
 * This needs to be kept in sync with the `modifiers` const for parsing
 */
export type Modifier =
  // stats
  | 'str'
  | 'agi'
  | 'dex'
  | 'vit'
  | 'int'
  | 'wis'

  // combat
  | 'atk'
  | 'def'
  | 'm_atk'
  | 'm_def'

  // res
  | 'res_fire'
  | 'res_water'
  | 'res_earth'
  | 'res_wind'
  | 'res_light'
  | 'res_shadow';

/**this is a map to ensure that all types are present */
export const modifiers: { [x in Modifier]: number } = {
  str: 0,
  agi: 0,
  dex: 0,
  vit: 0,
  int: 0,
  wis: 0,
  atk: 0,
  def: 0,
  m_atk: 0,
  m_def: 0,
  res_fire: 0,
  res_water: 0,
  res_earth: 0,
  res_wind: 0,
  res_light: 0,
  res_shadow: 0
};

/**
 * Each class can use only a subset of item types.
 * Examples:
 * Knights can use a sword, metal_armor, large_shield and a accessory.
 * Mages can use a staff, robe, spell_book and a acessory.
 */
export type ItemType =
  | 'accessory'
  | 'sword'
  | 'axe'
  | 'robe'
  | 'light_armor'
  | 'shield';

export type ItemSlot = 'mainHand' | 'offHand' | 'chest' | 'ornament';

export type ItemTypeSlots = { [x in ItemType]: ItemSlot };
export const itemTypeSlots: ItemTypeSlots = {
  accessory: 'ornament',
  sword: 'mainHand',
  axe: 'mainHand',
  robe: 'chest',
  light_armor: 'chest',
  shield: 'offHand'
};

type BaseItem = {
  name: string;
  description: string;
  type: ItemType;
};

/**
 * A detailed item object. Has denormalized data for fast retrieval.
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  slot: ItemSlot;
  modifiers: ItemModifiers;
}

export type ItemMap = {
  [id: string]: Item;
};

export type ItemModifiers = {
  [x in Modifier]: number;
};

export type DBItem = BaseItem & ItemModifiers;
