import Phaser, { GameObjects } from 'phaser';
import { GridEngine, GridEngineConfig, Direction } from 'grid-engine';
import { Player } from '../../models/Player.model';
import { Room } from 'colyseus.js';

export class Office extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private readonly TILE_SCALE = 2;
  private otherPlayersGroup!: Phaser.GameObjects.Group;
  private realRoom!: Room;

  constructor() {
    super('office');
  }

  init({ room }: { room: Room }) {
    this.realRoom = room;
  }

  create() {
    this.realRoom.onMessage('new-player', (player: Player) => {
      this.addOtherPlayer(player);
    });

    this.realRoom.onMessage('player-moved', (movementData: any) => {
      // console.log(movementData, 'Phaser');
      this.gridEngine.moveTo(movementData.id, {
        x: movementData.x,
        y: movementData.y,
      });
    });

    this.realRoom.onMessage('current-players', (players: Player[]) => {
      players.forEach((player: Player) => {
        if (player.id === this.realRoom.sessionId) {
          this.addPlayer(player);
        } else {
          this.addOtherPlayer(player);
        }
      });
    });

    this.realRoom.onMessage('player-left', (id: string) => {
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

    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    const gridEngineConfig: GridEngineConfig = {
      characters: [
        {
          id: 'placeholder',
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 0, y: 0 },
        },
      ],
    };

    this.gridEngine.create(tileMap, gridEngineConfig);
    // this.gridEngine.setSpeed('player', 10);

    // this.gridEngine.positionChangeStarted().subscribe((data) => {
    //   this.realRoom.send('move', {
    //     x: data.enterTile.x,
    //     y: data.enterTile.y,
    //   });
    // });
    playerSprite.setAlpha(0);

    //Path finding strategy
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
    this.input.keyboard?.clearCaptures();

    //Update player position to server
    const playerExists = this.gridEngine.hasCharacter('player');
    if (playerExists) {
      const isMoving = this.gridEngine.isMoving('player');
      if (isMoving) {
        const playerPosition = this.gridEngine.getPosition('player');
        this.realRoom.send('move', {
          x: playerPosition.x,
          y: playerPosition.y,
        });
      }
    }
  }

  addPlayer(playerInfo: Player) {
    const { x, y, id, name, selectedChar } = playerInfo;
    const playerSprite = this.add
      .sprite(x, y, 'player')
      .setName(id)
      .setScale(1.5);
    const playerName = this.add.text(0, -10, name, {
      color: '#00f7ff',
      fontSize: '18px',
      align: 'center',
      fontFamily: 'Helvetica',
      backgroundColor: "#363636",
    }).setPadding(5, 2.4, 5, 2.5);

    playerSprite.setOrigin(0.5, 1);
    const offsetX = (playerSprite.width - playerName.width) / 2 + 10;
    const offsetY = -playerName.height - 5; // Adjust this value as needed to position the name correctly above the character's head
    playerName.setPosition(playerSprite.x + offsetX, playerSprite.y + offsetY);

    const container = this.add.container(0, 0, [playerSprite, playerName]);
    this.cameras.main.startFollow(container, true);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    this.gridEngine.addCharacter({
      id: 'player',
      sprite: playerSprite,
      container,
      walkingAnimationMapping: selectedChar,
      startPosition: { x, y },
    });
    this.gridEngine.setSpeed('player', 10);
    this.gridEngine.setCollisionGroups('player', []);
  }

  addOtherPlayer(playerInfo: Player) {
    const { x, y, id, name, selectedChar } = playerInfo;
    const otherPlayerSprite = this.add
      .sprite(x, y, 'player')
      .setName(id)
      .setScale(1.5);
    const otherPlayerName = this.add.text(0, -10, name, {
      color: 'white',
      fontSize: '18px',
      align: 'center',
      fontFamily: 'Helvetica',
      backgroundColor: "#363636"
    }).setPadding(5, 2.4, 5, 2.5);

    otherPlayerSprite.setOrigin(0.5, 1);
    const offsetX = (otherPlayerSprite.width - otherPlayerName.width) / 2 + 10;
    const offsetY = -otherPlayerName.height - 5; // Adjust this value as needed to position the name correctly above the character's head
    otherPlayerName.setPosition(
      otherPlayerSprite.x + offsetX,
      otherPlayerSprite.y + offsetY
    );

    const container = this.add
      .container(0, 0, [otherPlayerSprite, otherPlayerName])
      .setName(id);
    this.gridEngine.addCharacter({
      id,
      sprite: otherPlayerSprite,
      startPosition: { x, y },
      walkingAnimationMapping: selectedChar,
      container,
    });
    this.gridEngine.setSpeed(id, 10);
    this.otherPlayersGroup.add(container);
    this.gridEngine.setCollisionGroups(id, []);
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
