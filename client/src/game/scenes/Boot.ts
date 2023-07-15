import Phaser from 'phaser';

export class Boot extends Phaser.Scene {
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super('boot');
  }
  preload() {}
  create() {
    this.loadingText = this.add.text(20, 20, 'Loading game...', {
      color: 'limegreen',
      fontSize: '48px',
      fontFamily: 'monospace',
    });
  }
  update() {}
}
