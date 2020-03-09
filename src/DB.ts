import { Squad, SquadMember, SquadMemberMap, SquadMap } from './Squad/Model';
import { unitsWithoutSquadSelector } from './Unit/selectors';
import { Item, itemTypeSlots, ItemTypeSlots, ItemMap } from './Item/Model';
import { Unit, UnitMap } from './Unit/Model';
import { removeIdFromMap } from './utils';

const get = (str: string) => JSON.parse(localStorage.getItem(str) || '{}');
const set = (str: string, data: any) =>
  localStorage.setItem(str, JSON.stringify(data));

export const getSquads = (): SquadMap => get('squads');

export const getUnits = (): UnitMap => get('units');

export const getItems = (): ItemMap => get('items');

export const getItemTypes = (): ItemTypeSlots => itemTypeSlots;

export const getUnit = (id: string): Unit | undefined => getUnits()[id];

export const saveSquads = (squads: SquadMap) => set('squads', squads);

export const saveUnits = (units: UnitMap) => set('units', units);

export const saveItems = (items: ItemMap) => set('items', items);

export const saveSquad = (squad: Squad) => {
  const squads = getSquads();
  saveSquads({ ...squads, [squad.id]: squad });
};

// Unit queries

export const saveUnit = (unit: Unit) => {
  const units = getUnits();
  saveUnits({ ...units, [unit.id]: unit });
};

/** Persists unit representation in squad map */
export const saveSquadUnit = ({
  squadId,
  unitId,
  x,
  y
}: {
  squadId: string;
  unitId: string;
  x: number;
  y: number;
}) => {
  const squads = getSquads();
  const squad = squads[squadId];
  saveSquads({
    ...squads,
    [squadId]: {
      ...squad,
      members: {
        ...squad.members,
        [unitId]: {
          ...squad.members[unitId],
          x,
          y
        }
      }
    }
  });
};

export const unitsWithoutSquad = () => unitsWithoutSquadSelector(getUnits());

export const addUnitToSquad = (
  unit: Unit,
  squad: any,
  x: number,
  y: number
) => {
  const updatedUnit = { ...unit, squad: squad };

  const { members } = squad;

  const newEntry = {
    leader: false,
    x,
    y,
    id: unit.id
  };

  const updatedMembers = { ...members, [unit.id]: newEntry };

  const updatedSquad = { ...squad, members: updatedMembers };

  saveUnit(updatedUnit);
  saveSquad(updatedSquad);
};
export const changeUnitPosition = (
  unit: SquadMember,
  squad: Squad,
  x: number,
  y: number
) => {
  console.log('change position', unit, squad, x, y);
  const { members } = squad;

  const updatedMembers = placeUnitInBoard(x, y, unit, members);

  const updatedSquad = { ...squad, members: updatedMembers };

  saveSquad(updatedSquad);
};

/**
 * @param x
 * @param y
 * @param unit
 * @param members
 */
function placeUnitInBoard(
  x: number,
  y: number,
  unit: SquadMember,
  members: SquadMemberMap
) {
  const newEntry: SquadMember = {
    leader: unit.leader,
    x,
    y,
    id: unit.id
  };

  const unitInTargetPosition = Object.values(members).find(
    member => member.x === x && member.y === y
  );

  if (unitInTargetPosition) {
    const unitToReplace: SquadMember = {
      ...unitInTargetPosition,
      x: unit.x,
      y: unit.y
    };

    return {
      ...members,
      [unit.id]: newEntry,
      [unitInTargetPosition.id]: unitToReplace
    };
  } else {
    return { ...members, [unit.id]: newEntry };
  }
}

export const removeUnitFromSquad = (unitId: string, squad: Squad) => {
  const unit = getUnit(unitId);
  if (!unit) {
    throw new Error('ERROR: tried to save unit with invalid ID');
  }
  const updatedUnit = { ...unit, squad: null };

  const { members } = squad;

  const updatedMembers: SquadMemberMap = removeIdFromMap(unitId, members);

  const updatedSquad = { ...squad, members: updatedMembers };

  saveUnit(updatedUnit);
  saveSquad(updatedSquad);
};

export const createSquad = (leader: Unit) => {
  const squads = getSquads();
  const newId = squads.length.toString();

  const newSquad = {
    id: newId,
    name: leader.name,
    emblem: 'Emoji',
    members: {
      [leader.id]: { id: leader.id, leader: true, x: 2, y: 2 }
    }
  };
  const updatedSquads = {
    ...squads,
    [newId]: newSquad
  };

  const updatedUnit = { ...leader, squad: newId };
  const fn = (
    resolve: ({ units, squads }: { units: UnitMap; squads: SquadMap }) => void
  ) => {
    saveSquads(updatedSquads);
    saveUnit(updatedUnit);
    const units = getUnits();
    console.log(units, updatedSquads);
    resolve({ units, squads: updatedSquads });
  };

  return new Promise(fn);
};

export const equipItem = (item: Item, unitId: string) => {
  const unit = getUnit(unitId);

  if (!unit) throw new Error('An invalid unit id was supplied to equipItem');

  const slot = getItemTypes()[item.type];

  const updatedUnit = { ...unit, equips: { ...unit.equips, [slot]: item.id } };

  saveUnit(updatedUnit);
};
