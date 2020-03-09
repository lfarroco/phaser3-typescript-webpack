export function sum(a: number, b: number) {
  return a + b;
}

export const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
