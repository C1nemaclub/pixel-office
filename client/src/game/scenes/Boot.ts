import { Room } from 'colyseus.js';
import { GridEngine, GridEngineConfig, Direction } from 'grid-engine';
import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private readonly TILE_SCALE = 2;

  constructor() {
    super('boot');
  }
  preload() {
    this.load.image('logo', "./vite.svg")
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

    // on Complete
    this.load.on('complete', () => {
      console.log('Loading Complete');
      this.scene.start('office');
    });

    this.load.on('progress', (value: number) => {
      console.log('Progress: ', value);
      this.game.events.emit('progress', value)
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
