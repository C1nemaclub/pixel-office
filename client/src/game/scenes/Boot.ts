import Phaser from 'phaser';
import { phaserEvent } from '../../events/EventHandler';

export class Boot extends Phaser.Scene {

  constructor() {
    super('boot');
  }
  preload() {
    this.load.image('logo', './vite.svg');
    this.load.image('tiles1', './assets/FloorAndGround.png');
    this.load.image('tiles2', './assets/Modern_Office_Black_Shadow.png');
    this.load.tilemapTiledJSON('map', './assets/virtual-office.json');
    this.load.tilemapTiledJSON('cloudMap', './assets/cloud/cloud_city.json');
    this.load.image('cloud_tileset', './assets/cloud/cloud_tileset.png');
    this.load.image('collision_tiles', './assets/collision-frame.png');
    this.load.spritesheet('player', './assets/characters.png', {
      frameWidth: 52,
      frameHeight: 72,
    });

    this.load.image('background', './assets/background.png');

    // on Complete
    this.load.on('complete', () => {
      console.log('Loading Complete');
      this.scene.launch('background')
      // this.scene.start('office');
      this.game.events.emit('complete');
    });

    this.load.on('fileprogress', (file: any) => {
      // console.log(file)
    })

    this.load.on('progress', (value: number) => {
      console.log('Progress: ', value);
      this.game.events.emit('progress', value);
      phaserEvent.emit('progress', value);
    });
  }
  async create() {
    this.add.text(20, 20, 'Loading game...', {
      color: 'limegreen',
      fontSize: '48px',
      fontFamily: 'monospace',
    });
  }

  update() {}
}
