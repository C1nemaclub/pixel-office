import { Room } from 'colyseus.js';
import { GridEngine, GridEngineConfig, Direction } from 'grid-engine';
import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;
  private room!: Room;
  private gridEngine!: GridEngine;

  constructor() {
    super('boot');
  }
  preload() {
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
  }
  async create() {
    // this.game.events.on('room', (room: Room) => {
    //   console.log(room, 'Phaser');
    //   this.room = room;
    // });

    // this.room?.onMessage('welcome', (message) => {
    //   console.log(message, 'message here actually worked');
    // });

    // this.game.events.on('new-player', (id: string) => {
    //   console.log(id, 'new player from phaser');
    // });

    // this.loadingText = this.add.text(20, 20, 'Loading game...', {
    //   color: 'limegreen',
    //   fontSize: '48px',
    //   fontFamily: 'monospace',
    // });

    const tileMap = this.make.tilemap({ key: 'map' });
    tileMap.addTilesetImage('FloorAndGround', 'tiles1');
    tileMap.addTilesetImage('collision', 'collision_tiles');
    tileMap.addTilesetImage('Modern_Office_Black_Shadow', 'tiles2');
    const floorLayer = tileMap
      .createLayer(0, 'FloorAndGround', 0, 0)
      ?.setScale(1.5);

    
    const wallLayer = tileMap
      .createLayer(1, 'FloorAndGround', 0, 0)
      ?.setScale(1.5);

    const propsLayer = tileMap.createLayer(2, 'Modern_Office_Black_Shadow', 0, 0)?.setScale(1.5)
    const decorLayer = tileMap.createLayer(3, 'Modern_Office_Black_Shadow', 0, 0)?.setScale(1.5)


    const collisionLayer = tileMap.createLayer(4, 'collision', 0, 0)?.setScale(1.5);


    // const cloudCityTilemap = this.make.tilemap({ key: 'cloudMap' });
    // cloudCityTilemap.addTilesetImage("Cloud City", "cloud_tileset");
    // for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
    //   const layer = cloudCityTilemap.createLayer(i, "Cloud City", 0, 0)?.setScale(3)
      
    // }

    const playerSprite = this.physics.add.sprite(0, 0, 'player').setScale(1.5);
    const playerName= this.add.text(0, -10, 'Player 1', {color: 'white', fontSize: '18px', fontStyle: 'bold'})

    const container = this.add.container(0, 0, [playerSprite, playerName])
    this.cameras.main.startFollow(container, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height,
    );

    // Player Collision

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: 'player',
          sprite: playerSprite,
          container: container,
          walkingAnimationMapping: 6,
          startPosition: { x: 14, y: 10 },
        },
      ],
    };

    this.gridEngine.create(tileMap, gridEngineConfig);
    this.gridEngine.setSpeed('player', 10);
    
    // this.gridEngine.create(cloudCityTilemap, gridEngineConfig);

    this.gridEngine.positionChangeStarted().subscribe((data)=>{
      console.log(data.enterTile)
    })
  }
  update() {
    // this.room?.send('pos', 1);
    // this.game.events.emit('move', 2);
    // console.log(this.gridEngine.getPosition('player'))
    
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors) {
      if (cursors.left.isDown) {
        this.gridEngine.move('player', Direction.LEFT);
      } else if (cursors.right.isDown) {
        this.gridEngine.move('player', Direction.RIGHT);
      } else if (cursors.up.isDown) {
        this.gridEngine.move('player', Direction.UP);
      } else if (cursors.down.isDown) {
        this.gridEngine.move('player', Direction.DOWN);
      }
    }
  }
}
