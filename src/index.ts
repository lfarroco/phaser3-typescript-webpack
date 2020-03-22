import 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import TitleScene from './Scenes/TitleScene';
import {EditSquad} from './Squad/EditSquad';
import UnitListScene from './Unit/UnitListScene';
import BoardScene from './Board/BoardScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [TitleScene, EditSquad, UnitListScene, BoardScene]
};

const game = new Phaser.Game(config);


game.scale.lockOrientation(Phaser.Scale.PORTRAIT);
