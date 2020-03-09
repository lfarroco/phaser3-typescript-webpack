import { Elem, Unit } from './Model';

export type Attack = {
  name: string;
  damage: number;
  elem: Elem;
  times: number;
  row: Row;
};

type Row = 'front' | 'middle' | 'back';

const slash = (times: number) => (unit: Unit, row: Row): Attack => {
  return {
    name: 'Slash',
    damage: unit.str * 2,
    elem: 'neutral',
    times: times,
    row: row
  };
};

const fireball = (times: number) => (unit: Unit, row: Row): Attack => {
  return {
    name: 'Fireball',
    damage: unit.int * 2,
    elem: 'fire',
    times: times,
    row: row
  };
};
const iceBolt = (times: number) => (unit: Unit, row: Row): Attack => {
  return {
    name: 'Ice Bold',
    damage: unit.int * 2,
    elem: 'water',
    times: times,
    row: row
  };
};

const spell = (times: number) => (unit: Unit, row: Row) => {
  if (unit.elem === 'fire') return fireball(times);
  else if (unit.elem === 'water') return iceBolt(times);
  else return fireball;
};

export const skills = {
  fighter: {
    front: slash(2),
    middle: slash(1),
    back: slash(1)
  },
  apprentice: {
    front: spell(1),
    middle: spell(1),
    back: spell(2)
  }
};

export function getUnitAttacks(unit: Unit): Attack[] {
  switch (unit.class) {
    case 'fighter':
      return getClassSkills(skills.fighter, unit);

    default:
      return [];
  }
}

function getClassSkills(
  skills: { front: Function; middle: Function; back: Function },
  unit: Unit
) {
  return [
    skills.front(unit, 'front'),
    skills.middle(unit, 'middle'),
    skills.back(unit, 'back')
  ];
}
