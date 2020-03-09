export function idfy(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .join('_');
}
