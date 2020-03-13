import Phaser from 'phaser';
import { BoardSceneParameters } from '../Board/BoardScene';
import { getSquads } from '../DB';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

const boardSceneConfig: BoardSceneParameters = {
  centerX: SCREEN_WIDTH / 2,
  centerY: SCREEN_HEIGHT / 2,
  tileWidth: 128,
  tileHeight: 64,
  squad: getSquads()['0'],
};

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }
  create() {

    // dynamic creation of scenes
    // const item = new List("aaa",this,"derpino")
    // this.scene.add("aaa", item, true);

    const btn = this.add.text(100, 100, 'Edit Squad', { color: '#fff' });
    btn.setInteractive();
    btn.on('pointerdown', () => {
      this.scene.start('BoardScene', boardSceneConfig);
    });


  }
  
}
