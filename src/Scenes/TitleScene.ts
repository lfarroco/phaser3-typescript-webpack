import Phaser from 'phaser';
import { getSquads } from '../DB';
import defaultData from '../defaultData';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }
  create() {
    // dynamic creation of scenes
    // const item = new List("aaa",this,"derpino")
    // this.scene.add("aaa", item, true);

    const editSquad = this.add.text(10, 100, 'Edit Squad', { color: '#fff' });
    editSquad.setInteractive();
    editSquad.on('pointerdown', () => {
      this.scene.start('EditSquadScene', getSquads()[0]);
    });

    const listSquads = this.add.text(10, 200, 'List Squads', { color: '#fff' });
    listSquads .setInteractive();
    listSquads .on('pointerdown', () => {
      //this.scene.start('BoardScene', boardSceneConfig);
    });

    const erase = this.add.text(10, 600, 'Erase Data');
    erase.setInteractive();
    erase.on('pointerdown', () => {
      defaultData();
      alert("Data erased!")
    });
  }
}
