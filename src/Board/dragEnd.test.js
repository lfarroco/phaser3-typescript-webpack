import { isPointerInTile } from './isPointerInTile';

const tiles = [
  coordinated(0, 0),
  coordinated(1, 1),
  coordinated(2, 0),
  coordinated(0, 1),
  coordinated(1, 1),
  coordinated(2, 1),
  coordinated(0, 2),
  coordinated(1, 2),
  coordinated(2, 2)
];

test('Obtains actual stat value', () => {
  expect(isPointerInTile({ x: 12, y: 12 }, 64, 64)(tiles[0])).toBe(true);
});

function coordinated(x, y) {
  return { x, y };
}
