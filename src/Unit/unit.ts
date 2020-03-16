import * as Phaser from 'phaser';

export default (parent: string, x: number, y: number, scale: number) => {
  var phaserConfig = {
    type: Phaser.AUTO,
    width: 120,
    height: 160,
    transparent: true,
    parent: parent,
    scene: {
      preload: preload,
      create: create(x, y, scale)
    }
  };

  new Phaser.Game(phaserConfig);
};

function preload(this: Phaser.Scene) {
  const headImg = 'https://i.postimg.cc/7ZDbQ6nr/head.png';
  const trunkImg = 'https://i.postimg.cc/C5LmNYrG/trunk.png';
  const handImg = 'https://i.postimg.cc/rF9qs9x7/hand.svg';
  const footImg = 'https://i.postimg.cc/kXGTRJb9/foot.svg';

  this.load.image('head', headImg);
  this.load.image('trunk', trunkImg);
  this.load.image('hand', handImg);
  this.load.image('foot', footImg);
}

function create(x: number, y: number, scale: number) {
  return function(this: Phaser.Scene) {
    chara(this, x, y, scale);
  };
}

export function chara(
  parent: Phaser.Scene,
  x: number,
  y: number,
  scale: number
) {
  var cx = x;
  var cy = y;

  var container = parent.add.container(cx, cy);

  function renderHead(gx: number, gy: number) {
    const head = parent.add.image(gx, gy, 'head');

    parent.tweens.add({
      targets: head,
      y: gy - 2,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(head);
  }

  function renderFoot(footX: number, footY: number) {
    const head = parent.add.image(footX, footY, 'foot');

    container.add(head);
  }

  function renderTrunk(trunkX: number, trunkY: number) {
    const trunk = parent.add.image(trunkX, trunkY, 'trunk');

    parent.tweens.add({
      targets: trunk,
      y: trunkY + 4,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(trunk);
  }

  function renderHand(handX: number, handY: number) {
    const head = parent.add.image(handX, handY, 'hand');

    parent.tweens.add({
      targets: head,
      y: handY + 12,
      duration: 1600,
      yoyo: true,
      repeat: -1
    });

    container.add(head);
  }

  renderFoot(30, 170);
  renderFoot(-10, 175);
  renderHand(70, 110);
  renderTrunk(0, 100);
  renderHead(0, 0);
  renderHand(-10, 120);

  container.scale = scale;
  container.depth = cy;
}
