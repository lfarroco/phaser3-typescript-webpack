export function random(min: number, max: number) {
  return Math.floor(Math.random() * max + min);
}

export function removeIdFromMap(
  id: string,
  map: { [id: string]: { id: string } }
) {
  return Object.values(map).reduce(
    (acc, curr) => (curr.id === id ? acc : { ...acc, [curr.id]: curr }),
    {}
  );
}

export const indexById = (list: { id: string }[]) =>
  list.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
