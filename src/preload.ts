const PUBLIC_URL = 'assets';

export function preload(this: {
  load: {
    image: (key: string, path: string) => void;
  };
  preload: () => void;
  create: (this: { preload: () => void; create: () => void }) => void;
}) {
  const images = ['insignea', 'tile', 'hand', 'foot', 'backgrounds/plain'];

  images.forEach(str => this.load.image(str, PUBLIC_URL + '/' + str + '.svg'));

  const numbers = [1, 2, 3, 4];
  numbers.forEach((n: number) => {
    this.load.image('head' + n.toString(), PUBLIC_URL + '/head.svg');
    this.load.image('back_head' + n.toString(), PUBLIC_URL + '/back_head.svg');
  });
  numbers.forEach((n: number) => {
    this.load.image('trunk' + n.toString(), PUBLIC_URL + '/trunk.svg');
    this.load.image(
      'back_trunk' + n.toString(),
      PUBLIC_URL + '/back_trunk.svg'
    );
  });

  const ui = ['arrow_right'];
  ui.forEach((id: string) => {
    this.load.image(id, `${PUBLIC_URL}/ui/${id}.svg`);
  });

}
