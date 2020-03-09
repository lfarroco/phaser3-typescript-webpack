import { items } from '../defaultData';
import { getActualStat } from './Model';
import { fromJSON } from './serializer';
test('Obtains actual stat value', () => {
  var unit = fromJSON(1);
  const base = getActualStat('str', items, unit);
  expect(base).toBe(11);

  unit.equips.mainHand = 'baldar_sword';
  expect(getActualStat('str', items, unit)).toBe(13);
});
