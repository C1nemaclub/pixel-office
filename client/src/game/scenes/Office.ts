import Phaser, { GameObjects } from 'phaser';
import { GridEngine, GridEngineConfig, Direction } from 'grid-engine';
import { Player } from '../../models/Player.model';
import { phaserEvent } from '../../events/EventHandler';

export class Office extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private readonly TILE_SCALE = 2;
  private otherPlayersGroup!: Phaser.GameObjects.Group;

  constructor() {
    super('office');
  }

  create() {
    phaserEvent.on('lmao', (lmao: any) => {
      console.log(lmao, 'handelre vent');
    });

    this.game.events.on('new-player', (player: Player) => {
      this.addOtherPlayer(player);
    });

    this.game.events.on('player-moved', (movementData: any) => {
      console.log(movementData, 'Phaser');
      this.gridEngine.moveTo(movementData.id, {
        x: movementData.x,
        y: movementData.y,
      });
    });

    this.game.events.on('hello', (data: any) => {
      console.log(data);
    });

    this.game.events.on(
      'current-players',
      (data: { players: Player[]; clientId: string }) => {
        data.players.forEach((player: Player) => {
          if (player.id === data.clientId) {
            console.log('NMe');
            this.addPlayer({ id: 'player', x: player.x, y: player.y });
          } else {
            this.addOtherPlayer(player);
          }
        });
      }
    );

    this.game.events.on('player-left', (id: string) => {
      this.removePlayer(id);
    });

    this.otherPlayersGroup = this.add.group();

    const tileMap = this.make.tilemap({ key: 'map' });
    tileMap.addTilesetImage('FloorAndGround', 'tiles1');
    tileMap.addTilesetImage('collision', 'collision_tiles');
    tileMap.addTilesetImage('Modern_Office_Black_Shadow', 'tiles2');

    tileMap.createLayer(0, 'FloorAndGround', 0, 0)?.setScale(this.TILE_SCALE);
    tileMap.createLayer(1, 'FloorAndGround', 0, 0)?.setScale(this.TILE_SCALE);
    tileMap
      .createLayer(2, 'Modern_Office_Black_Shadow', 0, 0)
      ?.setScale(this.TILE_SCALE);
    tileMap
      .createLayer(3, 'Modern_Office_Black_Shadow', 0, 0)
      ?.setScale(this.TILE_SCALE);
    tileMap.createLayer(4, 'collision', 0, 0)?.setScale(this.TILE_SCALE);

    const playerSprite = this.physics.add.sprite(0, 0, 'player').setScale(1.5);
    const playerName = this.add.text(0, -10, 'Player 1', {
      color: 'white',
      fontSize: '18px',
      fontStyle: 'bold',
    });

    const container = this.add.container(0, 0, [playerSprite, playerName]);
    this.cameras.main.startFollow(container, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        // {
        //   id: 'player',
        //   sprite: playerSprite,
        //   container: container,
        //   walkingAnimationMapping: 6,
        //   startPosition: { x: 14, y: 10 },
        // },
      ],
    };

    this.gridEngine.create(tileMap, gridEngineConfig);
    // this.gridEngine.setSpeed('player', 10);

    this.gridEngine.positionChangeStarted().subscribe((data) => {
      this.game.events.emit('move', {
        x: data.enterTile.x,
        y: data.enterTile.y,
      });
    });

    const logo = this.physics.add.image(200, 200, 'logo').setScale(2);
    //Player collision to logo
    this.physics.add.collider(playerSprite, logo, () => {
      console.log('Collided with logo');
      logo.destroy();
    });
  }

  update() {
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors && this.gridEngine.hasCharacter('player')) {
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

  addPlayer(playerInfo: Player) {
    const { x, y, id } = playerInfo;
    const playerSprite = this.add
      .sprite(x, y, 'player')
      .setName(id)
      .setScale(1.5);
    const playerName = this.add.text(0, -10, 'Player 1', {
      color: 'white',
      fontSize: '18px',
      fontStyle: 'bold',
    });
    const container = this.add.container(0, 0, [playerSprite, playerName]);
    this.cameras.main.startFollow(container, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    this.gridEngine.addCharacter({
      id,
      sprite: playerSprite,
      container,
      walkingAnimationMapping: 6,
      startPosition: { x, y },
    });
    this.gridEngine.setSpeed(id, 10);
  }

  addOtherPlayer(playerInfo: Player) {
    const { x, y, id } = playerInfo;
    const otherPlayerSprite = this.add
      .sprite(x, y, 'player')
      .setName(id)
      .setScale(1.5);
    const otherPlayerName = this.add.text(0, -10, id, {
      color: 'white',
      fontSize: '18px',
      fontStyle: 'bold',
    });
    const container = this.add
      .container(0, 0, [otherPlayerSprite, otherPlayerName])
      .setName(id);
    this.gridEngine.addCharacter({
      id,
      sprite: otherPlayerSprite,
      startPosition: { x, y },
      walkingAnimationMapping: 4,
      container,
    });
    this.gridEngine.setSpeed(id, 10);
    this.otherPlayersGroup.add(container);
  }

  removePlayer(playerId: string) {
    this.gridEngine.removeCharacter(playerId);
    this.otherPlayersGroup
      .getChildren()
      .forEach((player: GameObjects.GameObject) => {
        if (player.name === playerId) player.destroy();
      });
  }
}
