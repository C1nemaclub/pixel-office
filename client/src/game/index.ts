import Phaser from 'phaser';
import { GridEngine } from 'grid-engine';
import { Background, Boot, Office } from './scenes';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  render: {
    antialias: false,
  },
  scale: {
    // mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    //Resize
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
    // width: 700,
    // height: 528,
  },
  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine',
      },
    ],
  },
  backgroundColor: '#363636',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [Boot, Office, Background],
};
