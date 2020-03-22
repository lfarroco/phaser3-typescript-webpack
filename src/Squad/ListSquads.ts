import * as Phaser from 'phaser';
import {Chara} from '../Chara/Chara';
import {CenterX, CenterY, TileHeight, TileWidth, Image} from '../Models';
import {preload} from '../preload';
import {SquadMember, Squad} from '../Squad/Model';
import {cartesianToIsometric} from '../utils/isometric';
import {getUnit, saveSquadUnit, addUnitToSquad} from '../DB';
import UnitListScene from '../Unit/UnitListScene';
import {Unit} from '../Unit/Model';


export default (a:any) =>a

