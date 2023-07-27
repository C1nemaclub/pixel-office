import Phaser from 'phaser';

export class Background extends Phaser.Scene {
  private backgroundImage!: Phaser.GameObjects.TileSprite;
  private height!: number;
  private width!: number;
  constructor() {
    super('background');
  }

  create() {
    this.height = this.game.canvas.height;
    this.width = this.game.canvas.width;
    this.backgroundImage = this.add
      .tileSprite(0, 0, this.width, this.height, 'background')
      .setOrigin(0, 0);
    this.backgroundImage.displayWidth = this.game.canvas.width;
    this.backgroundImage.displayHeight = this.game.canvas.height;
    // backgroundImage.x = this.game.canvas.width / 2;
    // backgroundImage.y = this.game.canvas.height / 2;
    this.cameras.main.setBounds(
      0,
      0,
      this.game.canvas.width * 2,
      this.game.canvas.height
    );
    this.scene.launch('office').bringToTop('office');
  }

  update() {
    // scroll background
    //   Scroll the background to the left
    this.backgroundImage.tilePositionX -= 1;

    // If the this.backgroundImage reaches its maximum width (when scrolling to the left)
    if (this.backgroundImage.tilePositionX <= -this.backgroundImage.width) {
      // Reset the position of the tile sprite to start the repeat
      this.backgroundImage.tilePositionX = 0;
    }
  }
}
