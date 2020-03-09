import { UnitMap } from './Model';

export const unitsWithoutSquadSelector = (unitMap: UnitMap) =>
  Object.entries(unitMap)
    .filter(([id, unit]) => unit.squad === null)
    .map(([k, v]) => v);
